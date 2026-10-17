"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { asset, restaurant } from "@/lib";

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <a className="brand" href="#home" aria-label="Proof — home" onClick={() => setOpen(false)}>
        <Image src={asset("/images/proof-logo.jpg")} alt="Proof Pizza Bar & Cafe" width={66} height={66} priority />
        <span className="brand-type">proof<span>PIZZA · BAR · CAFÉ</span></span>
      </a>
      <button className="nav-toggle" aria-expanded={open} aria-controls="navigation" aria-label={open ? "Close navigation" : "Open navigation"} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      <nav id="navigation" className={open ? "navigation is-open" : "navigation"} aria-label="Main navigation" onKeyDown={(event) => { if (event.key === "Escape") { setOpen(false); document.querySelector<HTMLButtonElement>(".nav-toggle")?.focus(); } }}>
        <a href="#our-story" onClick={() => setOpen(false)}>Our story</a>
        <a href="#menu" onClick={() => setOpen(false)}>The menu</a>
        <a href="#visit" onClick={() => setOpen(false)}>Find us</a>
        <a className="button button-small" href={restaurant.phoneHref}>Book a table <ArrowUpRight size={16} /></a>
      </nav>
    </header>
  );
}
