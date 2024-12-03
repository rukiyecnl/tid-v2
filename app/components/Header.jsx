import Link from "next/link";

export default function Header() {
  return (
    <header className="header">
      <div><img src="./logo.png" alt="logo" /></div>
      <div>
        <ul className="nav-list">
            <li><Link href="/">Anasayfa</Link></li>
            <li><Link href="/quiz">Test</Link></li>
        </ul>
      </div>
    </header>
  );
}