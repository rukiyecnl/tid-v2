import { readFileSync, readdirSync, statSync, writeFileSync } from "fs";
import path from "path";
import fetch from "node-fetch";

// __dirname'i ES6 modüllerinde kullanmak için
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";
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
        prompt: `İncelemenizi istediğim aşağıdaki kodu değerlendirin ve aşağıdaki başlıklara göre detaylı bir teknik analiz sağlayın, olabilecek en kısa şekilde. Lütfen her başlık için ayrı bir inceleme yaparak, spesifik öneriler verin. Yüzeysel veya genel yorumlardan kaçının, doğrudan koddaki iyi ve eksik yönleri belirtin.

1. Mimari ve Kod Yapısı
Kod modüler ve okunabilir mi? Fonksiyonlar, sınıflar ve bileşenler arasındaki ilişki mantıklı mı?
Katmanlı mimari veya belirli bir design pattern kullanılmış mı? Kullanılmışsa doğru uygulanmış mı?
Eğer modülerlik eksikse, kod nasıl daha iyi organize edilebilir?
2. Güvenlik Analizi
Veri güvenliği açısından açıklar var mı? (Örneğin: SQL injection, XSS, güvenli olmayan şifreleme, kimlik doğrulama hataları)
Kullanıcı girişleri sanitize ediliyor mu?
Şifreleme ve güvenli bağlantılar kullanılmış mı?
3. Kod Kalitesi ve Best Practices
Değişken ve fonksiyon isimlendirmeleri anlamlı ve tutarlı mı?
Kod tekrarı (code duplication) var mı? Daha iyi bir yapı için refaktör önerileri sunun.
Hata yönetimi (error handling) nasıl yapılmış? Eksik veya hatalı ise nasıl iyileştirilebilir?
Bellek ve performans açısından optimizasyon yapılmış mı? Gereksiz işlemler veya kaynak tüketimi var mı?
4. Test Edilebilirlik ve Bakım Kolaylığı
Kodun test edilebilirliği ne durumda? (Bağımlılık enjeksiyonu, mock kullanımı gibi yöntemler var mı?)
Birim testler ve entegrasyon testleri için uygun bir yapı var mı?
Eğer testler eksikse, nasıl daha iyi hale getirilebilir?

Aşağıda verilen kodu detaylıca inceleyip yukarıdaki kriterlere göre geri bildirimde bulunun.
:\n${code}`,
        temperature: 0.4,
        max_tokens: 1500,
      }),
    });

    const data = await response.json(); // JSON formatına çevir
    const responseText =
      data.choices && data.choices.length > 0 ? data.choices[0].text : "";

    // Eğer API yanıtında "Thoughts:" bölümü varsa onu ayır
    const parts = responseText.includes("Thoughts:")
      ? responseText.split("Thoughts:")[1].trim()
      : responseText;

    console.log(parts);

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
    const outputPath = path.join(__dirname, "analysis_results.txt"); // JSON yerine TXT kaydedeceğiz
    let outputText = "";

    results.forEach((result) => {
      outputText += `Şu dosya okundu: ${result.filePath}\n`;
      outputText += "--------------------------------------------\n";
      outputText += result.analysis
        ? result.analysis
        : "Analiz sonucu bulunamadı.\n";
      outputText += "\n\n"; // Her dosyanın analizini ayırmak için boşluk bırak
    });

    writeFileSync(outputPath, outputText, "utf-8");
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
      prompt: `Sen deneyimli bir yazılım geliştiricisin. Verilen proje kodlarını analiz ederek bir geliştirme yol haritası oluşturmalısın, olabilecek en kısa şekilde. Aşağıdaki proje kodlarını analiz ederek, mantıklı bir geliştirme yol haritası oluştur:
  ${allCode}
  
  Lütfen roadmap'i aşağıdaki formatta hazırla:
  1. **Proje Tanıtımı** - Mevcut kodun amacını açıkla.
  2. **Mevcut Özellikler** - Projenin şu anda hangi özellikleri içerdiğini belirt.
  3. **Eksikler ve İyileştirme Alanları** - Kodda eksik olan veya geliştirilmesi gereken bölümleri açıkla.
  4. **Önerilen Roadmap** - Mantıklı bir geliştirme sırası oluştur (öncelikli hatalar, performans iyileştirmeleri, yeni özellikler).
  5. **Teknoloji Bağımlılıkları ve Riskler** - Kullanılan kütüphaneler, uyumluluk sorunları ve potansiyel riskler hakkında bilgi ver.
  
  Lütfen roadmap’i detaylı ve uygulanabilir şekilde oluştur!`,
      temperature: 0.7,
      max_tokens: 1500,
    }),
  });

  const data = await response.json(); // JSON formatına çevir
  const responseText =
    data.choices && data.choices.length > 0 ? data.choices[0].text : "";

  // Eğer API yanıtında "Thoughts:" bölümü varsa onu ayır
  const parts = responseText.includes("Thoughts:")
    ? responseText.split("Thoughts:")[1].trim()
    : responseText;

  console.log(parts);
  //setResponse(parts);

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
