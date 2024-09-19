import React, { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { fetchUserApi } from "../apis/User";
import UserAuth from "./modals/UserAuth";
import styles from "../assets/Navbar.module.css";

function Navbar() {
  const token = useAuth();

  const [userToken, setUserToken] = useState(token);
  const [showMenu, setShowMenu] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const [authModal, setAuthModal] = useState(false);
  const [authType, setAuthType] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const fetchUser = async () => {
    const data = await fetchUserApi(userToken);
    if (data) {
      setIsLoggedIn(true);
      setUserData(data);
    }
  };

  const detectDevice = () => {
    const isSmallScreen = window.innerWidth < 768;
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isMobile =
      /android|iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    setMobileMenu(isMobile || isSmallScreen);
  };

  useEffect(() => {
    if (token) setUserToken(token);
    if (userToken) fetchUser();
    detectDevice();
    window.addEventListener("resize", detectDevice);
    return () => window.removeEventListener("resize", detectDevice);
  }, [token, userToken]);

  return (
    <>
      <nav className={styles.nav}>
        <div className={styles.logo}>
          Story<span>Stash</span>
        </div>
        <div className={styles.menu}>
          <div className={styles.menuList}>
            {isLoggedIn ? (
              <>
                <button>
                  <img src="/icons/save.svg" height={20} alt="save" />
                  Bookmark
                </button>
                <button>Add Story</button>
                <img
                  src="https://rashhworld.github.io/assets/images/profile.webp"
                  width={40}
                  height={40}
                  alt="profile"
                />
              </>
            ) : (
              <>
                <button
                  className={styles.RegisterBtn}
                  onClick={() => {
                    setAuthModal(true);
                    setAuthType("Register");
                  }}
                >
                  Register Now
                </button>
                <button
                  className={styles.loginBtn}
                  onClick={() => {
                    setAuthModal(true);
                    setAuthType("Login");
                  }}
                >
                  Sign In
                </button>
              </>
            )}
          </div>
          {showMenu && (
            <div className={styles.menuDropdown}>
              {isLoggedIn ? (
                <>
                  <div className={styles.profile}>
                    {mobileMenu && (
                      <img
                        src="https://rashhworld.github.io/assets/images/profile.webp"
                        width={40}
                        height={40}
                        alt="profile"
                      />
                    )}
                    <h4>{userData.userName}</h4>
                  </div>
                  {mobileMenu && <button>Your Story</button>}
                  {mobileMenu && <button>Add Story</button>}
                  {mobileMenu && (
                    <button>
                      <img src="/icons/save.svg" height={20} alt="save" />
                      Bookmark
                    </button>
                  )}
                  <button
                    onClick={() => {
                      localStorage.removeItem("authToken");
                      setIsLoggedIn(false);
                      setShowMenu(false);
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setAuthModal(true);
                      setAuthType("Register");
                    }}
                  >
                    Register Now
                  </button>
                  <button
                    onClick={() => {
                      setAuthModal(true);
                      setAuthType("Login");
                    }}
                  >
                    Sign In
                  </button>
                </>
              )}
            </div>
          )}
          {(mobileMenu || isLoggedIn) && (
            <img
              className={styles.menuToggle}
              src="/icons/hamburger.svg"
              onClick={() => setShowMenu(!showMenu)}
              alt="hamburger"
            />
          )}
        </div>
      </nav>
      <UserAuth
        open={authModal}
        onClose={() => setAuthModal(false)}
        authType={authType}
        userToken={(token) => setUserToken(token)}
      />
    </>
  );
}

export default Navbar;
