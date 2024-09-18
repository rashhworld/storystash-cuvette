import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Catagories from "../components/Catagories";
import Stories from "../components/Stories";
import ViewStory from "../components/modals/ViewStory";

function Homepage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [storyModal, setStoryModal] = useState(
    searchParams.has("story") && searchParams.has("slide")
  );

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

  useEffect(() => {}, []);

  return (
    <>
      <Navbar />
      <Catagories catagories={catagories} />
      {catagories
        .filter((cat) => cat.name !== "All")
        .map((cat, index) => (
          <Stories catagory={cat.name} key={index} />
        ))}
      <ViewStory
        open={storyModal}
        onClose={() => {
          setStoryModal(false);
          setSearchParams({});
        }}
      />
    </>
  );
}

export default Homepage;
