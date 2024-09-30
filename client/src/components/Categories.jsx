import React, { useState, useEffect, useRef } from "react";
import styles from "../assets/Categories.module.css";

function Categories({ categories, filteredCatagory }) {
  const [selectedCategories, setSelectedCategories] = useState(["All"]);

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

  const filterCatagory = (categoryName) => {
    if (categoryName === "All") {
      setSelectedCategories(["All"]);
    } else {
      setSelectedCategories((prevSelected) => {
        if (prevSelected.includes(categoryName)) {
          return prevSelected.filter((cat) => cat !== categoryName);
        } else {
          const newSelection = prevSelected.includes("All")
            ? prevSelected.filter((cat) => cat !== "All")
            : prevSelected;
          return [...newSelection, categoryName];
        }
      });
    }
  };

  useEffect(() => {
    filteredCatagory(selectedCategories);
  }, [selectedCategories]);

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
            selectedCategories.includes(cat.name) ? styles.active : ""
          }`}
          key={index}
          style={{ backgroundImage: `url(${cat.img})` }}
          onClick={() => filterCatagory(cat.name)}
        >
          <p>{cat.name}</p>
        </div>
      ))}
    </div>
  );
}

export default Categories;
