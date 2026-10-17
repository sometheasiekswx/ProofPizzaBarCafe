"use client";

import { useState } from "react";
import { ArrowUpRight, Leaf } from "lucide-react";
import menu from "@/data/menu.json";
import { restaurant } from "@/lib";

const categories = ["Pizza", "Small plates", "Cocktails", "Wine", "Coffee & more"];
const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
const khr = new Intl.NumberFormat("en-US");

export function RestaurantMenu() {
  const [category, setCategory] = useState("Pizza");
  const items = menu.items.filter((item) => item.category === category);
  return (
    <section className="menu-section section" id="menu" aria-labelledby="menu-heading">
      <div className="section-heading">
        <div><p className="eyebrow">MADE TO BE SHARED. OR NOT.</p><h2 id="menu-heading">Good things.<br /><em>No shortcuts.</em></h2></div>
        <p>A little Naples. A little Kep. A menu for long lunches, another round, and one more slice.</p>
      </div>
      {menu.source === "sample" && <p className="sample-note">A taste of what’s to come — this is an illustrative menu. Dishes and prices are awaiting the owner’s confirmation.</p>}
      <div className="menu-filters" role="group" aria-label="Menu categories">
        {categories.map((name, i) => <button key={name} aria-pressed={category === name} onClick={() => setCategory(name)}><span className="category-number">0{i + 1}</span>{name}</button>)}
      </div>
      <div className="menu-intro"><span>{category === "Pizza" ? "NEAPOLITAN AT HEART" : category.toUpperCase()}</span><span>{category === "Pizza" ? "A blistered crust. A soft centre. Simple pleasures." : "Find your new favourite."}</span></div>
      <div className="menu-grid" aria-live="polite" aria-atomic="true">
        {items.length ? items.map((item) => <article className="menu-item" key={item.id}>
          <div className="dish-heading"><h3>{item.name}</h3><div className="dish-price"><strong>{item.priceUsd} <span className="small">USD</span></strong></div></div>
          <p>{item.description}</p>
          {item.tags.length > 0 && <div className="dish-tags">{item.tags.map((tag) => <span key={tag}>{tag.toLowerCase() === "vegetarian" && <Leaf size={12} aria-hidden="true" />}{tag}</span>)}</div>}
        </article>) : <p className="menu-empty">We’re refreshing this part of the menu. Call us to discover today’s selection.</p>}
      </div>
      <div className="menu-footnote">
        <a className="text-link" href={restaurant.phoneHref}>Something special in mind? <ArrowUpRight size={16} /></a></div>
    </section>
  );
}
