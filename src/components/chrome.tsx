import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Navigation } from './interactive';
export function Brand() { return <Link href="/" className="brand" aria-label="SEO PLUS home"><span className="brand-crop"><Image src="/seo-plus-logo.png" alt="SEO PLUS" width={1280} height={1280} priority sizes="150px"/></span></Link>; }
export function Header() { return <header className="site-header"><div className="container header-inner"><Brand/><Navigation/></div></header>; }
export function Footer() { return <footer className="footer container"><div className="footer-top"><div><Brand/><p>Your vision. Our next challenge.</p></div><Link className="footer-contact" href="/#contact">Let’s build what’s next. <ArrowUpRight/></Link></div><div className="footer-bottom"><span>© {new Date().getFullYear()} SEO PLUS E-Solutions.</span><span>Thoughtfully designed. Purposefully built.</span><Link href="/privacy">Privacy</Link><a href="#top">Back to top ↑</a></div></footer>; }
