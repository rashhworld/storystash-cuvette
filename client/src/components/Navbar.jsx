import React, { useState, useEffect } from "react";
import styles from "../assets/Navbar.module.css";

function Navbar({ authType, userData, setUserToken, setAddStoryModal }) {
  const [showMenu, setShowMenu] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const detectDevice = () => {
    const isSmallScreen = window.innerWidth < 768;
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isMobile =
      /android|iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    setMobileMenu(isMobile || isSmallScreen);
  };

  useEffect(() => {
    setIsLoggedIn(userData._id && true);
    detectDevice();
    window.addEventListener("resize", detectDevice);
    return () => window.removeEventListener("resize", detectDevice);
  }, [userData]);

  return (
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
              <button onClick={() => setAddStoryModal(true)}>Add Story</button>
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
                onClick={() => authType("Register")}
              >
                Register Now
              </button>
              <button
                className={styles.loginBtn}
                onClick={() => authType("Login")}
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
                {mobileMenu && (
                  <button onClick={() => setAddStoryModal(true)}>
                    Add Story
                  </button>
                )}
                {mobileMenu && (
                  <button>
                    <img src="/icons/save.svg" height={20} alt="save" />
                    Bookmark
                  </button>
                )}
                <button
                  onClick={() => {
                    localStorage.removeItem("authToken");
                    setShowMenu(false);
                    setUserToken(null);
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    authType("Register");
                    setShowMenu(false);
                  }}
                >
                  Register Now
                </button>
                <button
                  onClick={() => {
                    authType("Login");
                    setShowMenu(false);
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
  );
}

export default Navbar;
