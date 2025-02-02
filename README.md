# Next.js Projesi

Bu proje, [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) kullanılarak başlatılmış bir [Next.js](https://nextjs.org) projesidir.

## Başlangıç

Öncelikle geliştirme sunucusunu çalıştırın:

```bash
npm run dev
# veya
yarn dev
# veya
pnpm dev
# veya
bun dev
```

Sonucu görmek için tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

Sayfayı düzenlemeye başlamak için `app/page.js` dosyasını değiştirin. Dosyayı düzenledikçe sayfa otomatik olarak güncellenecektir.

Bu proje, [Vercel](https://vercel.com/font) tarafından sağlanan yeni bir yazı tipi ailesi olan [Geist](https://vercel.com/font) yazı tipini otomatik olarak optimize etmek ve yüklemek için [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) kullanmaktadır.

## Daha Fazla Bilgi

Next.js hakkında daha fazla bilgi edinmek için aşağıdaki kaynaklara göz atabilirsiniz:

- [Next.js Dokümantasyonu](https://nextjs.org/docs) - Next.js özellikleri ve API hakkında bilgi edinin.
- [Next.js Öğrenme](https://nextjs.org/learn) - Etkileşimli bir Next.js eğitimi.

Ayrıca [Next.js GitHub deposuna](https://github.com/vercel/next.js) göz atabilirsiniz - geri bildirimleriniz ve katkılarınız memnuniyetle karşılanır!

## Vercel Üzerinde Yayınlama

Next.js uygulamanızı yayınlamanın en kolay yolu, [Vercel Platformu](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) kullanmaktır.

Daha fazla detay için [Next.js dağıtım dokümantasyonuna](https://nextjs.org/docs/app/building-your-application/deploying) göz atabilirsiniz.

---

# DeepSeek R1 Entegrasyonu

Bu projede, DeepSeek R1 modelinin 7 milyar ve 8 milyar parametreli versiyonlarını kullanarak yazılım süreçlerimize entegre ettik. LM Studio aracılığıyla modelleri lokal ortamımıza kurup API üzerinden kod reposuna erişim sağladık.

## Entegrasyon Süreci

- **Model Kurulumu:** DeepSeek R1'in 7B ve 8B parametreli versiyonları LM Studio aracılığıyla lokal ortamımıza kuruldu.
- **API Erişimi:** Modeller API aracılığıyla yazılım repomuza entegre edildi.
- **Kod Analizi:** DeepSeek R1, kod repomuzu analiz ederek yazılım mimarisi, güvenlik ve best practice'ler açısından yorumlar üretebilir hale getirildi.
- **Hata Analizi:** Uygulamadan fırlatılan exception'ların neden kaynaklandığını analiz edebilmesi için müşteri temsilcilerimizin sorgulayabileceği bir mekanizma geliştirildi.
- **Roadmap Önerileri:** Kod reposuna erişimi olan DeepSeek R1, sağlanan fonksiyonellikleri analiz ederek ürün geliştirme sürecimize yönelik roadmap önerileri sunmaktadır.

## Kullanım Alanları

1. **Yazılım Kalite Analizi:**
   - Mimari ve güvenlik açısından inceleme
   - Yazılım best practice'lerine uygunluk değerlendirmesi

     <img width="1204" alt="Screenshot 2025-02-03 at 01 25 40" src="https://github.com/user-attachments/assets/d35946f6-d077-4d75-afa2-6d7b8243871a" />
     <img width="1203" alt="Screenshot 2025-02-03 at 01 26 27" src="https://github.com/user-attachments/assets/716beeae-82ee-4ce2-bdf3-bc6e439863f9" />


   
2. **Hata Yönetimi:**
   - Exception'ların nedenlerini belirleme ve öneriler sunma
   - Müşteri temsilcilerinin hata sorgulamalarına destek sağlama
     
     ![WhatsApp Image 2025-02-03 at 00 31 15](https://github.com/user-attachments/assets/d3f8da7b-6d13-429a-bdea-ed1315874b74)

     ![WhatsApp Image 2025-02-03 at 00 31 41](https://github.com/user-attachments/assets/b2eb2d95-8d9f-474b-b958-b9d0abf51c2f)

   
3. **Stratejik Ürün Geliştirme:**
   - Kod reposundaki mevcut fonksiyonellikleri analiz ederek roadmap önerileri oluşturma
   - Geliştirme süreçlerine yapay zeka tabanlı içgörüler sağlama

     <img width="1186" alt="Screenshot 2025-02-03 at 01 31 33" src="https://github.com/user-attachments/assets/ece9127f-0229-4e59-8674-e46a8c79aa2e" />


Bu entegrasyon sayesinde, yazılım süreçlerimiz daha verimli, güvenli ve inovatif hale gelmiştir. 🚀

Ayrıca, **Google Analytics** entegrasyonu yaparak sayfadaki fonksiyonların işlevselliğini takip edebilir hale geldik. Bu sayede kullanıcı etkileşimlerini analiz ederek geliştirme süreçlerimizi daha verimli yönetebilmeyi hedefliyoruz.



