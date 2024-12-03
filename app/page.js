"use client";
import Image from "next/image";
import styles from "./page.module.css";
import "./globals.css";
import { useEffect } from "react";
export default function Home() {

  return (
    <div className="container">
      <div className="main">
        <div>
          <img src="/tid_alfabe.png" alt="logo" />
        </div>
        <div className="home-content">
          <p>İşaret dili, işitme engelli bireylerin iletişim kurmasını sağlayan, el hareketleri, yüz ifadeleri ve beden dili gibi görsel unsurları içeren bir dil sistemidir.
              Her ülkenin kendi işaret dili vardır ve Türkiye’de Türk İşaret Dili (TİD) kullanılır. İşaret dili, yalnızca işitme engelliler için değil, aynı zamanda toplumsal 
              iletişim ve empati geliştirmek için de önemlidir.
              İşaret dili öğrenmek, bireylerin hem dil hem de sosyal becerilerini güçlendirmelerine yardımcı olur ve teknoloji sayesinde öğrenim süreçleri daha erişilebilir 
              hale gelmiştir.
          </p>
        </div>
      </div>
    </div>
  );
}
