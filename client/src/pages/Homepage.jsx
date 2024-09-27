import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { fetchUserApi, fetchUserStoryApi } from "../apis/User";

import Navbar from "../components/Navbar";
import Categories from "../components/Categories";
import Stories from "../components/Stories";
import UserAuth from "../components/modals/UserAuth";
import ViewStory from "../components/modals/ViewStory";
import AddStory from "../components/modals/AddStory";

const categoryList = [
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

function Homepage() {
  const token = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [authType, setAuthType] = useState(null);
  const [authModal, setAuthModal] = useState(false);

  const [userToken, setUserToken] = useState(token);
  const [userData, setUserData] = useState({});
  const [userStory, setUserStory] = useState([]);

  const [category, setCategory] = useState(categoryList);
  const [storyModal, setStoryModal] = useState(
    searchParams.has("story") && searchParams.has("slide")
  );
  const [addStoryModal, setAddStoryModal] = useState(false);

  const filterCatagory = (category) => {
    const data = categoryList.filter((item) => item.name == category);
    category !== "All" ? setCategory(data) : setCategory(categoryList);
  };

  const fetchUser = async () => {
    const data = await fetchUserApi(userToken);
    if (data) {
      setUserData(data);
      setUserStory(await fetchUserStoryApi(userToken));
    }
  };

  useEffect(() => {
    if (token) setUserToken(token);
  }, [token]);

  useEffect(() => {
    if (userToken) {
      fetchUser();
    } else {
      setUserData({});
      setUserStory([]);
    }
  }, [userToken]);

  // console.log(userStory);

  return (
    <>
      <Navbar
        authType={(type) => {
          setAuthType(type);
          setAuthModal(true);
        }}
        setUserToken={setUserToken}
        userData={userData}
        setAddStoryModal={setAddStoryModal}
      />
      <Categories
        categories={categoryList}
        filterCatagory={(category) => filterCatagory(category)}
      />
      {userStory.length > 0 && (
        <Stories
          category="User"
          setStoryModal={setStoryModal}
          userToken={userToken}
          userStory={userStory}
        />
      )}
      {category
        .filter((cat) => cat.name !== "All")
        .map((cat, index) => (
          <Stories
            category={cat.name}
            setStoryModal={setStoryModal}
            userToken={userToken}
            key={index}
          />
        ))}
      <ViewStory
        open={storyModal}
        onClose={() => {
          setStoryModal(false);
          setSearchParams({});
        }}
        authType={(type) => {
          setAuthType(type);
          setAuthModal(true);
        }}
        userToken={userToken}
      />
      <UserAuth
        open={authModal}
        onClose={() => setAuthModal(false)}
        authType={authType}
        setUserToken={setUserToken}
      />
      <AddStory
        open={addStoryModal}
        onClose={() => setAddStoryModal(false)}
        userToken={userToken}
        stories={[]}
      />
    </>
  );
}

export default Homepage;
