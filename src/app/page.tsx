import Image from "next/image";

import { ArrowDown, ArrowUpRight, Clock3, Camera, MapPin, Phone } from "lucide-react";
import { ScrollExperience } from "@/components/scroll-experience";
import { Header } from "@/components/header";
import { RestaurantMenu } from "@/components/menu";
import { asset, restaurant } from "@/lib";

export default function Home() {
  return <>
    <Header />
    <ScrollExperience />
    <main id="main">
      <section className="hero" id="home" aria-labelledby="hero-title">
        <div className="hero-copy">
          <h1 id="hero-title">Neapolitan soul.<br /><em>Cambodian coast.</em></h1>
          <p className="hero-description">Good pizza. A proper drink. Nowhere to rush.<br />A little piece of Naples, here on the shores of Kep.</p>
          <div className="hero-actions"><a className="button" href="#menu">Explore the menu <ArrowUpRight size={18} /></a><a className="text-link" href="#visit">Come find us <ArrowUpRight size={16} /></a></div>
          <div className="hero-bottom"><p><span className="status-dot" /> OPEN DAILY <span className="hours">11 AM — 9 PM</span></p><a href="#our-story" aria-label="Discover our story"><ArrowDown size={20} /></a></div>
        </div>
        <div className="coastal-invitation">
          <div className="invitation-main">
            <p className="invitation-title">Your table.<br /><em>No hurry.</em></p>
            <div className="invitation-bottom">
              <div className="ticket-stickers" aria-hidden="true">
                <Image className="ticket-sticker" src={asset("/images/proof-cover.jpg")} alt="" width={72} height={48} />
                <Image className="ticket-sticker" src={asset("/images/pizza.jpg")} alt="" width={72} height={48} />
                <Image className="ticket-sticker" src={asset("/images/storefront-horizontal.webp")} alt="" width={72} height={48} />
                <Image className="ticket-sticker ticket-sticker-seal" src={asset("/images/proof-logo-alternative.jpg")} alt="" width={48} height={48} />
              </div>
              <span>Pizza. Coffee. Cocktails.</span><span>Good company encouraged.</span>
            </div>
          </div>
          <div className="invitation-stub">
            <span className="invitation-mark" aria-hidden="true">p.</span>
            <div><p className="invitation-place">A little Naples.<br />A little Kep.</p><p className="invitation-address">Find us near Kep Main Beach.</p></div>
            <a className="invitation-link" href="#visit">Meet us here <ArrowUpRight size={22} /></a>
          </div>
        </div>
      </section>
      <div className="manifesto-strip"><span>Neapolitan pizza. Coffee. Cocktails.</span><span>The slow life, well lived.</span></div>
      <section id="our-story" className="story-section section" aria-labelledby="story-title">
        <div className="story-mark" aria-hidden="true"><span>p.</span><div>GOOD FOOD.<br />GOOD COMPANY.<br />THAT’S THE PROOF.</div></div>
        <div className="story-copy"><p className="eyebrow">WELCOME TO PROOF</p><h2 id="story-title">Some things are<br />worth <em>slowing down for.</em></h2><p>There’s a particular kind of happiness in a pizza fresh from the oven, a glass poured just right, and a table full of your favourite people.</p><p>That’s the feeling we’re here for. Neapolitan pizza is at the heart of Proof — with coffee, a bar, and the easy rhythm of Kep Beach for company. Come for lunch. Stay for a little longer.</p><a className="text-link" href="#visit">Your table by the coast <ArrowUpRight size={17} /></a></div>
      </section>
      <section className="craft-section" aria-labelledby="craft-title">
        <div className="craft-photo"><Image src={asset("/images/pizza.jpg")} alt="Detail of a golden pizza crust, shown as inspiration for the menu" fill sizes="(max-width: 760px) 100vw, 50vw" /></div>
        <div className="craft-copy"><h2 id="craft-title"><span className="craft-line">The crust.</span><span className="craft-line">The char.</span><em className="craft-line">The whole thing.</em></h2><p>Light, airy edges. A tender centre. The beautiful simplicity of tomato, mozzarella, and basil. This is pizza the Neapolitan way.</p><a href="#menu" className="text-link">Meet your next favourite <ArrowUpRight size={17} /></a><div className="craft-progress" aria-hidden="true"><span /></div></div>
      </section>
      <RestaurantMenu />
      <section className="aperitivo section" aria-labelledby="bar-heading"><div className="bar-art" aria-hidden="true"><span>Stay a<br />little longer.</span></div><div className="bar-copy"><p className="eyebrow">MAKE AN EVENING OF IT</p><h2 id="bar-heading">One more slice.<br /><em>One more round.</em></h2><p>From an afternoon coffee to a cocktail as the light softens. Pull up a chair, order something lovely, and let the evening find its own pace.</p><a className="text-link" href="#menu">Find your perfect pairing <ArrowUpRight size={17} /></a></div></section>
      <section id="visit" className="visit-section section" aria-labelledby="visit-title"><div className="visit-heading"><p className="eyebrow">THE BEST PLANS ARE SIMPLE</p><h2 id="visit-title">See you <em>at Proof.</em></h2><p>Near Kep Main Beach. A world away from the rush.</p></div><div className="visit-grid"><div className="visit-block"><MapPin size={23} strokeWidth={1.3} /><h3>A little closer to the sea</h3><p>Kep Beach<br />Kep, Cambodia</p><a href={restaurant.maps} target="_blank" rel="noopener noreferrer" className="text-link">Get directions <ArrowUpRight size={16} /></a></div><div className="visit-block"><Clock3 size={23} strokeWidth={1.3} /><h3>Your everyday escape</h3><p>Monday — Sunday<br />11:00 am — 9:00 pm</p><span className="visit-small">Lunch, a late coffee, or a long dinner.</span></div><div className="visit-block"><Phone size={23} strokeWidth={1.3} /><h3>We’ll save you a seat</h3><p>For a table or a little celebration,<br />give us a call.</p><a href={restaurant.phoneHref} className="text-link">{restaurant.phone} <ArrowUpRight size={16} /></a></div></div><div className="visit-banner"><span>Less scrolling. More living.</span><a href={restaurant.instagram} target="_blank" rel="noopener noreferrer"><Camera size={18} /> Follow along @proofpizzabar <ArrowUpRight size={16} /></a></div></section>
    </main>
    <footer className="footer"><div className="footer-top"><a href="#home" className="footer-logo" aria-label="Proof home">proof<span>PIZZA · BAR · CAFÉ</span></a><p>Neapolitan soul.<br />Cambodian coast.</p><div><a href={restaurant.facebook} target="_blank" rel="noopener noreferrer">Facebook <ArrowUpRight size={14} /></a><a href={restaurant.instagram} target="_blank" rel="noopener noreferrer">Instagram <ArrowUpRight size={14} /></a><a href={restaurant.maps} target="_blank" rel="noopener noreferrer">Find us <ArrowUpRight size={14} /></a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Proof Pizza Bar & Cafe</span><span>Made for the good moments. Kep, Cambodia.</span><a href="#home">Back to top ↑</a></div></footer>
  </>;
}
