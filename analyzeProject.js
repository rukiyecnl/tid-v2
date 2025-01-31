import { readFileSync, readdirSync, statSync, writeFileSync } from 'fs';
import path from 'path';
import fetch from 'node-fetch';

// __dirname'i ES6 modüllerinde kullanmak için
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Proje dizini (kendi proje dizininizi belirtin)
const PROJECT_DIR = path.join(__dirname, 'app');

// LM Studio API endpoint'i
const API_URL = 'http://localhost:1234/v1/completions';

// Dosyaları tarayıp analiz eden fonksiyon
async function analyzeFile(filePath) {
  const code = readFileSync(filePath, 'utf-8');

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: `Aşağıdaki kodun mimarisi, güvenliği ve yazılım best practice'leri hakkında yorum yap:\n${code}`,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    return data.choices[0].text;
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
      } else if (stat.isFile() && file.endsWith('.jsx')) { // Sadece .js dosyalarını analiz eder
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
    const outputPath = path.join(__dirname, 'analysis_results.json');
    writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`Analysis results saved to ${outputPath}`);
  })
  .catch((error) => {
    console.error('Error analyzing project:', error);
  });