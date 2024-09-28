import React, { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { fetchUserApi, fetchUserBookmarkApi } from "../apis/User";

import Navbar from "../components/Navbar";
import UserAuth from "../components/modals/UserAuth";
import AddStory from "../components/modals/AddStory";
import Stories from "../components/Stories";

function Bookmark() {
  const token = useAuth();

  const [authType, setAuthType] = useState(null);
  const [authModal, setAuthModal] = useState(false);

  const [userToken, setUserToken] = useState(token);
  const [userData, setUserData] = useState({});
  const [userBookmark, setUserBookmark] = useState([]);
  const [addStoryModal, setAddStoryModal] = useState(false);

  const fetchUser = async () => {
    const data = await fetchUserApi(userToken);
    if (data) {
      setUserData(data);
      setUserBookmark(await fetchUserBookmarkApi(userToken));
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
      setUserBookmark([]);
    }
  }, [userToken]);

  // console.log(userBookmark);

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
      {userBookmark && userBookmark.length > 0 && (
        <Stories
          storyTitle="Bookmarks"
          userToken={userToken}
          userStory={userBookmark}
        />
      )}
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

export default Bookmark;
