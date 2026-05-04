import { useEffect, useState } from "react";
import BookingBar from "./BookingBar";
import hero1 from "../assets/Loby.png";
import hero2 from "../assets/Facade.png";
import hero3 from "../assets/Outside.png";
import "../css/Hero.css";

const images = [hero1, hero2, hero3];

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((c) => (c + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero">
      <div className="hero__frame">
        <div className="hero__slides">
          {images.map((img, i) => (
            <div
              key={i}
              className={`hero__slide ${i === index ? "is-active" : ""}`}
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
        </div>

        <article className="hero__content">
          <div className="hero__panel">
            <p className="hero__eyebrow">Harmony Hotel</p>
            <h1 className="hero__title">
              A refined stay shaped by calm, light and quiet luxury.
            </h1>
            <p className="hero__subtitle">
              Discover elegant rooms, thoughtful service and a slower rhythm from the moment you arrive.
            </p>
            <div className="hero__meta">
              <span>Boutique comfort</span>
              <span>Curated rooms</span>
              <span>Private atmosphere</span>
            </div>
          </div>
        </article>
      </div>

      <div className="hero__bookingWrap">
        <BookingBar />
      </div>
    </section>
  );
}
