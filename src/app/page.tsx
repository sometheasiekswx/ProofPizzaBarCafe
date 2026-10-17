import Image from "next/image";
import { ArrowDown, ArrowUpRight, Wine, Wheat } from "lucide-react";
import { Header } from "@/components/header";
import { RestaurantMenu } from "@/components/menu";
import { asset, restaurant } from "@/lib";

export default function Home() {
  return <>
    <Header />
    <main id="main">
      <section className="hero" id="home" aria-labelledby="hero-title">
        <div className="hero-topline"><span>NEAPOLITAN SOUL. CAMBODIAN COAST.</span><span>KEP BEACH · 11 AM—9 PM DAILY</span></div>
        <h1 id="hero-title">A little Naples.<br /><span>A lot of Kep.</span></h1>
        <div className="hero-editorial"><p>Pizza, a proper drink,<br />and nowhere to rush.</p><a className="text-link" href="#menu">Explore the menu <ArrowDown size={18} /></a></div>
        <div className="hero-photo"><Image src={asset("/images/pizza.jpg")} alt="Illustrative pizza photography with tomato, basil and a golden crust" fill priority sizes="(max-width: 760px) 100vw, 90vw" /><span className="photo-note">THE SIMPLE THINGS. DONE BEAUTIFULLY.</span><span className="photo-credit">Illustrative photography</span><a className="photo-stamp" href="#visit">Meet you<br />at Proof. <ArrowUpRight size={28} /></a></div>
        <div className="hero-caption"><span>01 / PIZZA BY THE SEA</span><span>Good food. Better company.</span></div>
      </section>
      <section className="story-section section" id="our-story" aria-labelledby="story-title"><p className="eyebrow">THE PROOF IS IN THE MOMENT</p><h2 id="story-title">Good dough.<br />Good company.<br /><em>The rest can wait.</em></h2><div className="story-bottom"><Wheat className="rocking" size={84} strokeWidth={1} aria-hidden="true" /><p>Some things are worth slowing down for. A pizza fresh from the oven. A glass poured just right. A table full of your favourite people.<br /><br />Neapolitan pizza is at the heart of Proof. The easy rhythm of Kep is everything around it.</p><a className="text-link" href="#visit">Pull up a chair <ArrowUpRight size={18} /></a></div></section>
      <section className="craft-section" aria-labelledby="craft-title"><div className="craft-photo"><Image src={asset("/images/pizza.jpg")} alt="Illustrative detail of artisan pizza" fill sizes="(max-width: 760px) 100vw, 50vw" /></div><div className="craft-copy"><p className="eyebrow">A LOVE LETTER TO THE CLASSICS</p><h2 id="craft-title">Less fuss.<br /><em>More flavour.</em></h2><p>A blistered crust. A tender centre. Tomato, mozzarella, basil. The beautiful simplicity of pizza the Neapolitan way.</p><a className="text-link" href="#menu">Find your favourite <ArrowUpRight size={18} /></a><span className="craft-number" aria-hidden="true">P / 01</span></div></section>
      <RestaurantMenu />
      <section className="bar-section section" aria-labelledby="bar-title"><div><p className="eyebrow">SOMETHING WORTH STAYING FOR</p><h2 id="bar-title">One more slice.<br /><em>One more round.</em></h2><p>From an afternoon coffee to a cocktail as the light softens. Let the evening find its own pace.</p><a className="text-link" href="#menu">Find your perfect pairing <ArrowUpRight size={18} /></a></div><div className="bar-art" aria-hidden="true"><Wine className="rocking" size={190} strokeWidth={.65} /><span>cin cin.</span></div></section>
      <section className="visit-section section" id="visit" aria-labelledby="visit-title"><div className="visit-heading"><p className="eyebrow">NO COMPLICATED PLANS REQUIRED</p><h2 id="visit-title">Your table<br /><em>is this way.</em> <ArrowUpRight aria-hidden="true" /></h2></div><div className="visit-grid"><article><span className="eyebrow">01 / FIND US</span><h3>Close to the coast.</h3><p>Kep Beach<br />Kep, Cambodia</p><a className="text-link" href={restaurant.maps} target="_blank" rel="noopener noreferrer">Get directions <ArrowUpRight size={17} /></a></article><article><span className="eyebrow">02 / TAKE YOUR TIME</span><h3>Every day is a good day.</h3><p>Monday — Sunday<br />11:00 am — 9:00 pm</p><span className="visit-note">Lunch, a late coffee, or a long dinner.</span></article><article><span className="eyebrow">03 / SAY HELLO</span><h3>We’ll save you a seat.</h3><p>For a table or a little celebration,<br />give us a call.</p><a className="text-link" href={restaurant.phoneHref}>{restaurant.phone} <ArrowUpRight size={17} /></a></article></div></section>
    </main>
    <footer className="footer"><div className="footer-top"><p>NEAPOLITAN SOUL.<br />CAMBODIAN COAST.</p><div><a href={restaurant.instagram} target="_blank" rel="noopener noreferrer">Instagram ↗</a><a href={restaurant.facebook} target="_blank" rel="noopener noreferrer">Facebook ↗</a><a href="#home">Back to top ↑</a></div></div><a href="#home" className="footer-wordmark" aria-label="Proof home">proof<span>®</span></a><div className="footer-bottom"><span>© {new Date().getFullYear()} Proof Pizza Bar & Cafe</span><span>KEP, CAMBODIA — COME AS YOU ARE.</span></div></footer>
  </>;
}
