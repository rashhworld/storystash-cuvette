import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchStoryByCatagoryApi } from "../apis/Story";
import styles from "../assets/Stories.module.css";

function Stories({ category, setStoryModal, userToken }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [storyData, setStoryData] = useState([]);

  const getMediaType = (media) => {
    const extension = media.split(".").pop().toLowerCase();
    const mediaTypes = {
      image: ["jpg", "jpeg", "png", "gif", "webp", "svg"],
      video: ["mp4", "mkv", "webm", "ogg", "avi", "mov"],
    };
    for (const [type, exts] of Object.entries(mediaTypes)) {
      if (exts.includes(extension)) {
        return { type, extension };
      }
    }
    return { type: "unknown", extension: null };
  };

  const fetchStoryByCatagory = async () => {
    const data = await fetchStoryByCatagoryApi(category);
    if (data) setStoryData(data);
  };

  useEffect(() => {
    fetchStoryByCatagory();
  }, []);

  return (
    <section className={styles.storySection}>
      <h2>Top Stories About {category}</h2>
      <div className={styles.storyList}>
        {storyData.length > 0 &&
          storyData.map((story, index) => {
            const { heading, description, media } = story.firstSlide;
            return (
              <div
                className={styles.card}
                onClick={() => {
                  setStoryModal(true);
                  setSearchParams({ story: story._id, slide: 0 });
                }}
                key={index}
              >
                <div className={styles.media}>
                  {getMediaType(media).type === "image" ? (
                    <img src={media} alt="media" />
                  ) : (
                    <video>
                      <source
                        src={media}
                        type={`video/${getMediaType(media).extension}`}
                      />
                    </video>
                  )}
                </div>
                <div className={styles.content}>
                  <h3>{heading}</h3>
                  <p>{description}</p>
                </div>
              </div>
            );
          })}
      </div>
      {storyData.length > 4 && <button>See more</button>}
      {storyData.length === 0 && (
        <p className={styles.nodata}>No stories Available</p>
      )}
    </section>
  );
}

export default Stories;
