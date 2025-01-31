import Link from "next/link";

export default function Header() {
  return (
    <header className="header">
      <div style={{display: "flex", alignItems: "center"}}>
        <img src="./logo.png" alt="logo" />
        <img src="./logoYazi.png" alt="logoYazi" width={"180px"} height={"25px"}/>
      </div>
      <div>
        <ul className="nav-list">
            <li className="home"><Link href="/">Anasayfa</Link></li>
            <li className="quiz"><Link href="/quiz">Test</Link></li>
            <li className="customerService"><Link href="/customerService">Müşteri Temsilcisi</Link></li>
        </ul>
      </div>
    </header>
  );
}