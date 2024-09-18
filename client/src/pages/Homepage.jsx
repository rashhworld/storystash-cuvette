import React, { useState, useRef } from "react";
import Navbar from "../components/Navbar";
import Catagories from "../components/Catagories";
import Stories from "../components/Stories";

function Homepage() {
  const isLoggedIn = false;

  const catagories = [
    {
      name: "All",
      img: "https://www.quadrant.io/hs-fs/hubfs/philipp-kammerer-6Mxb_mZ_Q8E-unsplash.jpg",
    },
    {
      name: "Food",
      img: "https://www.foodiesfeed.com/wp-content/uploads/2023/06/burger-with-melted-cheese.jpg",
    },
    {
      name: "Health and fitness",
      img: "https://static.toiimg.com/thumb/imgsize-681673,msid-75126749,width-600,height-335,resizemode-75/75126749.jpg",
    },
    {
      name: "Travel",
      img: "https://www.quadrant.io/hs-fs/hubfs/philipp-kammerer-6Mxb_mZ_Q8E-unsplash.jpg",
    },
    {
      name: "Movie",
      img: "https://assets.gadgets360cdn.com/pricee/assets/product/202212/65_1671448856.jpg",
    },
    {
      name: "Education",
      img: "https://www.timeshighereducation.com/student/sites/default/files/styles/default/public/istock-499343530.jpg",
    },
  ];

  return (
    <>
      <Navbar />
      <Catagories catagories={catagories} />
      {catagories
        .filter((cat) => cat.name !== "All")
        .map((cat, index) => (
          <Stories catagory={cat.name} key={index} />
        ))}
    </>
  );
}

export default Homepage;
