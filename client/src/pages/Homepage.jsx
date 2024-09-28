import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { fetchUserApi, fetchUserStoryApi } from "../apis/User";
import { fetchStoryByIdApi } from "../apis/Story";

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

  const [storyId, setStoryId] = useState(null);
  const [storyData, setStoryData] = useState([]);

  const [category, setCategory] = useState(categoryList);
  const [storyModal, setStoryModal] = useState(
    searchParams.has("story") && searchParams.has("slide")
  );
  const [addStoryModal, setAddStoryModal] = useState(false);
  const [yourStory, setYourStory] = useState(searchParams.has("yourstory"));

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

  const fetchStoryById = async (storyId) => {
    const data = await fetchStoryByIdApi(storyId);
    if (data) {
      setStoryId(storyId);
      setStoryData(data);
      setAddStoryModal(true);
    }
  };

  useEffect(() => {
    if (token) setUserToken(token);
  }, [token]);

  useEffect(() => {
    if (userToken) {
      fetchUser();
      yourStory && setAuthModal(false);
    } else {
      setUserData({});
      setUserStory([]);
      yourStory && setAuthModal(true);
    }
  }, [userToken]);

  useEffect(() => {
    if (searchParams.get("yourstory")) setYourStory(true);
    else setYourStory(false);
  }, [searchParams]);

  // console.log(storyData);

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
      {!yourStory && (
        <Categories
          categories={categoryList}
          filterCatagory={(category) => filterCatagory(category)}
        />
      )}
      {userStory.length > 0 && (
        <div className="yourStory">
          <Stories
            storyTitle="Stories"
            setStoryModal={setStoryModal}
            userStory={userStory}
            editStory={(storyId) => fetchStoryById(storyId)}
          />
        </div>
      )}
      {!yourStory &&
        category
          .filter((cat) => cat.name !== "All")
          .map((cat, index) => (
            <Stories
              category={cat.name}
              setStoryModal={setStoryModal}
              key={index}
            />
          ))}
      <ViewStory
        open={storyModal}
        onClose={() => {
          setStoryModal(false);
          searchParams.delete("story");
          searchParams.delete("slide");
          setSearchParams(searchParams);
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
        onClose={() => {
          setAddStoryModal(false);
          setStoryData([]);
        }}
        userToken={userToken}
        storyId={storyId}
        storyData={storyData}
      />
    </>
  );
}

export default Homepage;
