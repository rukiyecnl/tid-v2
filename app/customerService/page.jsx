"use client";

import { useState } from "react";

export default function CustomerService() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = 'http://localhost:1234/v1/completions';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse("");

      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: `Uygulamada meydana gelen bir hata ile ilgili müşteri temsilcilerine açıklama yapabilmemiz için, fırlatılan exception’ı detaylıca analiz ederek nedenini açıklayan bir metin oluşturmanı istiyoruz.  

Lütfen aşağıdaki noktaları içeren bir açıklama yap, hepsi için 3 cümleyi geçmemeye çalış:  

- **Hata Detayı:** "${input}"  
- **Olası Nedenler:** Bu hatanın ortaya çıkmasına sebep olabilecek durumları teknik ve anlaşılır şekilde belirt.  
- **Çözüm Önerileri:** Hatanın nasıl düzeltilebileceğine dair teknik ekibe yönlendirebilecek çözüm yolları sun.  
- **Etkileri:** Kullanıcı açısından bu hatanın nasıl bir sorun yaratabileceğini ve hangi senaryolarda ortaya çıkabileceğini açıkla.  
- **Örnek Senaryo:** Müşteri temsilcilerinin durumu daha iyi anlaması için, hatanın nasıl meydana geldiğini anlatan basit ve anlaşılır bir örnek ver.  

**Lütfen cevabını doğrudan ver, düşünme sürecini veya analiz notlarını yazma.**  
`,
            max_tokens: 1200,
            temperature: 0.7,
          }),
        });
    
        const data = await response.json();
        // const data = await res.json();
        const parts = data.choices[0].text.split("</think>");
        console.log(parts[1]);
        setResponse(parts[1]);
        // const data = await res.json();
        setResponse(data.choices[0].text);
        setLoading(false);
        return data.choices[0].text;
      } catch (error) {
        console.error(`hata mesajı: `, error);
      }

    // const res = await fetch("/api/chat", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ message: input }),
    // });


  };

  return (
    <div className="container">
    <div className="main">
        <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>Deepseek R1 Chat</h1>
        <form onSubmit={handleSubmit}>
            <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Hata mesajını buraya yazın..."
            style={{ padding: "10px", width: "300px" }}
            />
            <button type="submit" style={{ padding: "10px", marginLeft: "10px" }}>
            Gönder
            </button>
        </form>
        {loading && <p>Yanıt alınıyor...</p>}
        {response && (
            <p style={{ marginTop: "20px", fontWeight: "bold" }}>{response}</p>
        )}
        </div>
        </div>
    </div>
  );
}
