import { readFileSync, readdirSync, statSync, writeFileSync } from "fs";
import path from "path";
import fetch from "node-fetch";

// __dirname'i ES6 modüllerinde kullanmak için
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from 'fs';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// Proje dizini (kendi proje dizininizi belirtin)
const PROJECT_DIR = path.join(__dirname, "app");

// LM Studio API endpoint'i
const API_URL = "http://localhost:1234/v1/completions";

// Dosyaları tarayıp analiz eden fonksiyon
async function analyzeFile(filePath) {
  const code = readFileSync(filePath, "utf-8");

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: `Yorumlamanızı istediğim aşağıdaki kodu değerlendirin. Lütfen kodun mimarisini, güvenliğini ve yazılım geliştirme best practice'lerine ne kadar uyduğunu detaylıca inceleyin. Aşağıdaki başlıklarda odaklanın:

1. **Mimari**:
   - Kodun genel yapısı nasıl? Modülerlik ve katmanlı mimari kullanımı nasıl?
   - Uygulama ile ilgili herhangi bir desen (design pattern) kullanılmış mı? Hangi desenler kullanılmışsa, bunlar doğru bir şekilde uygulanmış mı?

2. **Güvenlik**:
   - Kodda herhangi bir güvenlik açığı veya zayıf nokta var mı? (Örneğin, veri sızıntısı, kimlik doğrulama hataları, yetkilendirme eksiklikleri, SQL enjeksiyonu, vs.)
   - Kullanıcı verilerinin güvenliğini sağlamak için alınan önlemler yeterli mi? Şifreleme, güvenli bağlantılar ve diğer güvenlik önlemleri nasıl?

3. **Yazılım Best Practice'leri**:
   - Kodun okunabilirliği nasıl? Değişken ve fonksiyon isimleri anlamlı ve tutarlı mı?
   - Hata yönetimi (error handling) doğru bir şekilde yapılmış mı? 
   - Kod tekrarı var mı? Kodda yeniden kullanılabilirlik için iyileştirme önerileri olabilir mi?
   - Performans iyileştirmeleri yapılabilir mi? (Örneğin, gereksiz işlemler, bellek yönetimi, optimize edilmemiş döngüler vb.)
   - Kodun test edilebilirliği nasıl? Test kapsamı yeterli mi?

Aşağıda verilen kodu detaylıca inceleyip yukarıdaki kriterlere göre geri bildirimde bulunun.
:\n${code}`,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    if (data.choices && data.choices.length > 0) {
      return data.choices[0].text;
    } else {
      console.error(`No analysis result for ${filePath}`);
      return "No analysis result.";
    }
  } catch (error) {
    console.error(`Error analyzing file ${filePath}:`, error);
    return null;
  }
}

// Proje dizinindeki tüm dosyaları tarayan fonksiyon
async function analyzeProject(directory) {
  const results = [];

  // Dizindeki tüm dosyaları recursive olarak tarar
  function walkDir(dir) {
    const files = readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = statSync(filePath);

      if (stat.isDirectory()) {
        walkDir(filePath); // Alt dizinleri tarar
      } else if (stat.isFile() && file.endsWith(".jsx")) {
        // Sadece .js dosyalarını analiz eder
        results.push({ filePath, analysis: null });
      }
    }
  }

  walkDir(directory);

  // Her dosyayı analiz eder
  for (const result of results) {
    result.analysis = await analyzeFile(result.filePath);
    console.log(`Analyzed: ${result.filePath}`);
  }

  return results;
}

// Projeyi analiz et ve sonuçları kaydet
analyzeProject(PROJECT_DIR)
  .then((results) => {
    const outputPath = path.join(__dirname, "analysis_results.json");
    writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`Analysis results saved to ${outputPath}`);
  })
  .catch((error) => {
    console.error("Error analyzing project:", error);
  });

function readFilesRecursively(dir) {
  let filesContent = [];
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      filesContent = filesContent.concat(readFilesRecursively(filePath));
    } else if (
      file.endsWith(".js") ||
      file.endsWith(".ts") ||
      file.endsWith(".py")
    ) {
      // Sadece belirli uzantılardaki dosyaları oku
      const content = fs.readFileSync(filePath, "utf-8");
      filesContent.push({ file: filePath, content });
    }
  });
  return filesContent;
}

async function generateRoadmap() {
  const files = readFilesRecursively(PROJECT_DIR);
  let allCode = "";

  files.forEach((file) => {
    allCode += `\n\n=== ${file.file} ===\n${file.content}`;
  });

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4",
      prompt: `Sen deneyimli bir yazılım geliştiricisin. Verilen proje kodlarını analiz ederek bir geliştirme yol haritası oluşturmalısın. Aşağıdaki proje kodlarını analiz ederek, mantıklı bir geliştirme yol haritası oluştur:
  ${allCode}
  
  Lütfen roadmap'i aşağıdaki formatta hazırla:
  1. **Proje Tanıtımı** - Mevcut kodun amacını açıkla.
  2. **Mevcut Özellikler** - Projenin şu anda hangi özellikleri içerdiğini belirt.
  3. **Eksikler ve İyileştirme Alanları** - Kodda eksik olan veya geliştirilmesi gereken bölümleri açıkla.
  4. **Önerilen Roadmap** - Mantıklı bir geliştirme sırası oluştur (öncelikli hatalar, performans iyileştirmeleri, yeni özellikler).
  5. **Teknoloji Bağımlılıkları ve Riskler** - Kullanılan kütüphaneler, uyumluluk sorunları ve potansiyel riskler hakkında bilgi ver.
  
  Lütfen roadmap’i detaylı ve uygulanabilir şekilde oluştur!`,
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });
  
  const data = await response.json(); // JSON formatında işle
  
  if (!data.choices || data.choices.length === 0) {
    throw new Error("API yanıtı beklenilen formatta değil.");
  }
  
  const roadmap = data.choices[0].text;
  fs.writeFileSync("roadmap.txt", roadmap, "utf-8");
  
  console.log("=== AI TARAFINDAN OLUŞTURULAN ROADMAP ===");
  console.log(roadmap);
  console.log("\nRoadmap 'roadmap.txt' dosyasına kaydedildi! ✅");
  
}

generateRoadmap();
