import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import ViewStory from "./modals/ViewStory";
import styles from "../assets/Stories.module.css";

function Stories({ catagory }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [storyModal, setStoryModal] = useState(false);

  return (
    <>
      <section className={styles.storySection}>
        <h2>Top Stories About {catagory}</h2>
        <div className={styles.storyList}>
          <div
            className={styles.card}
            style={{
              backgroundImage: `url(https://www.foodiesfeed.com/wp-content/uploads/2023/06/burger-with-melted-cheese.jpg)`,
            }}
            onClick={() => {
              setStoryModal(true);
              setSearchParams({ story: catagory, slide: 0 });
            }}
          >
            <div className={styles.content}>
              <h3>This is a heading</h3>
              <p>
                This is its description lorem This is its description lorem This
                is its description lorem This is its description lorem This is
                its description lorem{" "}
              </p>
            </div>
          </div>
          <div
            className={styles.card}
            style={{
              backgroundImage: `url(https://www.foodiesfeed.com/wp-content/uploads/2023/06/burger-with-melted-cheese.jpg)`,
            }}
          >
            <div className={styles.content}>
              <h3>This is a heading</h3>
              <p>
                This is its description lorem This is its description lorem This
                is its description lorem This is its description lorem This is
                its description lorem{" "}
              </p>
            </div>
          </div>
          <div
            className={styles.card}
            style={{
              backgroundImage: `url(https://www.foodiesfeed.com/wp-content/uploads/2023/06/burger-with-melted-cheese.jpg)`,
            }}
          >
            <div className={styles.content}>
              <h3>This is a heading</h3>
              <p>
                This is its description lorem This is its description lorem This
                is its description lorem This is its description lorem This is
                its description lorem{" "}
              </p>
            </div>
          </div>
          <div
            className={styles.card}
            style={{
              backgroundImage: `url(https://www.foodiesfeed.com/wp-content/uploads/2023/06/burger-with-melted-cheese.jpg)`,
            }}
          >
            <div className={styles.content}>
              <h3>This is a heading</h3>
              <p>
                This is its description lorem This is its description lorem This
                is its description lorem This is its description lorem This is
                its description lorem
              </p>
            </div>
          </div>
        </div>
        <button>See more</button>
      </section>
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

export default Stories;
