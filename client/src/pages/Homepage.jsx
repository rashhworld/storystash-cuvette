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
    img: "/images/general.webp",
  },
  {
    name: "Food",
    img: "/images/food.webp",
  },
  {
    name: "Movie",
    img: "/images/movie.webp",
  },
  {
    name: "Travel",
    img: "/images/travel.webp",
  },
  {
    name: "Fitness",
    img: "/images/fitness.webp",
  },
  {
    name: "Education",
    img: "/images/education.webp",
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

  const [category, setCategory] = useState([]);
  const [storyModal, setStoryModal] = useState(
    searchParams.has("story") && searchParams.has("slide")
  );
  const [addStoryModal, setAddStoryModal] = useState(false);
  const [yourStory, setYourStory] = useState(searchParams.has("yourstory"));
  const [refreshKey, setRefreshKey] = useState(0);

  const filterCatagory = (category) => {
    if (category.includes("All") || category.length === 0) {
      setCategory(categoryList);
    } else {
      const newCategories = categoryList.filter((item) =>
        category.includes(item.name)
      );
      setCategory(newCategories);
    }
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

  return (
    <div key={refreshKey}>
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
          filteredCatagory={filterCatagory}
        />
      )}
      {userStory.length > 0 && (
        <div
          className="yourStory"
          style={{ display: yourStory ? "block" : "" }}
        >
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
          setStoryId(null);
          fetchUser();
          setRefreshKey((prevKey) => prevKey + 1);
        }}
        userToken={userToken}
        storyId={storyId}
        storyData={storyData}
      />
    </div>
  );
}

export default Homepage;
