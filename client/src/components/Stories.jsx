import React from "react";
import styles from "../assets/Stories.module.css";

function Stories({ catagory }) {
  return (
    <section className={styles.storySection}>
      <h2>Top Stories About {catagory}</h2>
      <div className={styles.storyList}>
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
              is its description lorem This is its description lorem This is its
              description lorem{" "}
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
              is its description lorem This is its description lorem This is its
              description lorem{" "}
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
              is its description lorem This is its description lorem This is its
              description lorem{" "}
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
              is its description lorem This is its description lorem This is its
              description lorem{" "}
            </p>
          </div>
        </div>
      </div>
      <button>See more</button>
    </section>
  );
}

export default Stories;
