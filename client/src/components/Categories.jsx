import React, { useState, useRef } from "react";
import styles from "../assets/Categories.module.css";

function Categories({ categories, filterCatagory }) {
  const [activeCatagory, setActiveCatagory] = useState("All");
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
      className={`${styles.categories}`}
      ref={scrollContainerRef}
      onMouseDown={handleMouseDown}
      onMouseLeave={() => setIsDragging(false)}
      onMouseUp={() => setIsDragging(false)}
      onMouseMove={handleMouseMove}
    >
      {categories.map((cat, index) => (
        <div
          className={`${styles.card} ${
            activeCatagory === cat.name ? styles.active : ""
          }`}
          key={index}
          style={{ backgroundImage: `url(${cat.img})` }}
          onClick={() => {
            filterCatagory(cat.name);
            setActiveCatagory(cat.name);
          }}
        >
          <p>{cat.name}</p>
        </div>
      ))}
    </div>
  );
}

export default Categories;
