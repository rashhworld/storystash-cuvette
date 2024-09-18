import React, { useState, useRef } from "react";
import styles from "../assets/Catagories.module.css";

function Catagories({ catagories }) {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const scrollContainerRef = useRef(null);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    scrollContainerRef.current.style.userSelect = "none";
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div
      className={`${styles.catagories}`}
      ref={scrollContainerRef}
      onMouseDown={handleMouseDown}
      onMouseLeave={() => setIsDragging(false)}
      onMouseUp={() => setIsDragging(false)}
      onMouseMove={handleMouseMove}
    >
      {catagories.map((cat, index) => (
        <div
          className={`${styles.card} ${index === 0 && styles.active}`}
          key={index}
          style={{ backgroundImage: `url(${cat.img})` }}
        >
          <p>{cat.name}</p>
        </div>
      ))}
    </div>
  );
}

export default Catagories;
