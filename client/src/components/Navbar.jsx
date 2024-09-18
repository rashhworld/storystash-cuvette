import React, { useState, useEffect } from "react";
import styles from "../assets/Navbar.module.css";

function Navbar() {
  const isLoggedIn = true;

  const [showMenu, setShowMenu] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const detectDevice = () => {
    const isSmallScreen = window.innerWidth < 768;
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isMobile =
      /android|iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    setMobileMenu(isMobile || isSmallScreen);
  };

  useEffect(() => {
    detectDevice();
    window.addEventListener("resize", detectDevice);
    return () => window.removeEventListener("resize", detectDevice);
  }, []);

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
              <button className={styles.RegisterBtn}>Register Now</button>
              <button className={styles.loginBtn}>Sign In</button>
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
                  <h4>Rashmi Ranjan</h4>
                </div>
                {mobileMenu && <button>Your Story</button>}
                {mobileMenu && <button>Add Story</button>}
                {mobileMenu && (
                  <button>
                    <img src="/icons/save.svg" height={20} alt="save" />
                    Bookmark
                  </button>
                )}
                <button>Logout</button>
              </>
            ) : (
              <>
                <button>Register Now</button>
                <button>Sign In</button>
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
