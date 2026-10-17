"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function ScrollExperience() {
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add("(min-width: 900px) and (min-height: 650px) and (prefers-reduced-motion: no-preference)", () => {
      const timeline = gsap.timeline({
        scrollTrigger: { trigger: ".craft-section", start: "top 64px", end: "+=900", pin: true, scrub: 0.6, invalidateOnRefresh: true },
      });
      timeline.fromTo(".craft-photo img", { scale: 1 }, { scale: 1.5, xPercent: -4, yPercent: -30, ease: "none", duration: 2 }, 0)
        .fromTo(".craft-line", { opacity: 0.35, y: 16 }, { opacity: 1, y: 0, stagger: 0.8, duration: 0.6, ease: "power2.out" }, 0)
        .fromTo(".craft-progress span", { scaleX: 0 }, { scaleX: 1, ease: "none", duration: 2 }, 0);

      // Text reveal animations
      // Hero copy
      gsap.fromTo(".hero-copy", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: ".hero-copy", start: "top 80%", end: "bottom 20%", toggleActions: "play none none reverse" } });
      // Story section copy
      gsap.fromTo(".story-copy", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: ".story-copy", start: "top 80%", end: "bottom 20%", toggleActions: "play none none reverse" } });
      // Craft copy heading and text (staggered)
      gsap.from(".craft-copy h2, .craft-copy p", { opacity: 0, y: 20, stagger: 0.1, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: ".craft-copy", start: "top 80%", end: "bottom 20%", toggleActions: "play none none reverse" } });
      // Menu section headings (if any) - we'll target common heading pattern
      gsap.from(".section h2", { opacity: 0, y: 20, stagger: 0.1, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: ".section", start: "top 80%", end: "bottom 20%", toggleActions: "play none none reverse" } });
      // Footer text reveal (optional)
      gsap.from(".footer", { opacity: 0, y: 20, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: ".footer", start: "top 80%", end: "bottom 20%", toggleActions: "play none none reverse" } });

      return () => { timeline.kill(); };
    });
    // Reduced motion fallback: set opacity to 1 immediately
    media.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set([".hero-copy", ".story-copy", ".craft-copy h2", ".craft-copy p", ".section h2", ".footer"], { opacity: 1, y: 0 });
    });
    return () => media.revert();
  }, []);
  return null;
}
