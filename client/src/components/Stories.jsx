import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchStoryByCatagoryApi } from "../apis/Story";
import styles from "../assets/Stories.module.css";

function Stories({
  category,
  setStoryModal,
  editStory,
  storyTitle,
  userStory,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentParams = Object.fromEntries(searchParams.entries());

  const [storyData, setStoryData] = useState([]);
  const [visibleCount, setVisibleCount] = useState(4);

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
    const data = category ? await fetchStoryByCatagoryApi(category) : userStory;
    if (data) setStoryData(data);
  };

  useEffect(() => {
    fetchStoryByCatagory();
  }, [category, userStory]);

  return (
    <section className={styles.storySection}>
      <h2>
        {storyTitle ? `Your ${storyTitle}` : `Top Stories About ${category}`}
      </h2>
      <div className={styles.storyList}>
        {storyData.length > 0 &&
          storyData.slice(0, visibleCount).map((story, index) => {
            const { heading, description, media } = story.slide;
            return (
              <div
                className={styles.card}
                onClick={() => {
                  if (setStoryModal) {
                    setStoryModal(true);
                    setSearchParams({
                      ...currentParams,
                      story: story._id,
                      slide: 0,
                    });
                  }
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
                {storyTitle === "Stories" && (
                  <button
                    className={styles.editStoryBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      editStory(story._id);
                    }}
                  >
                    <img src="/icons/pen.svg" alt="pen" />
                    <span>Edit</span>
                  </button>
                )}
              </div>
            );
          })}
      </div>
      {visibleCount < storyData.length && (
        <button onClick={() => setVisibleCount(storyData.length)}>
          See more
        </button>
      )}
      {storyData.length === 0 && (
        <p className={styles.nodata}>No stories available</p>
      )}
    </section>
  );
}

export default Stories;
