import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Modal } from "react-responsive-modal";
import { toast } from "react-toastify";
import "../../assets/modals/ViewStory.css";

function ViewStory({ open, onClose }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const slide = parseInt(searchParams.get("slide"), 10) || 0;

  const stories = [
    {
      id: 1,
      title: "Heading 1",
      desc: "This description is all about heading 1",
      img: "https://assets.gadgets360cdn.com/pricee/assets/product/202212/65_1671448856.jpg",
      likes: 105,
    },
    {
      id: 2,
      title: "Heading 2",
      desc: "This description is all about heading 2",
      img: "https://www.quadrant.io/hs-fs/hubfs/philipp-kammerer-6Mxb_mZ_Q8E-unsplash.jpg",
      likes: 115,
    },
    {
      id: 3,
      title: "Heading 3",
      desc: "This description is all about heading 3",
      img: "https://static.toiimg.com/thumb/imgsize-681673,msid-75126749,width-600,height-335,resizemode-75/75126749.jpg",
      likes: 125,
    },
    {
      id: 4,
      title: "Heading 4",
      desc: "This description is all about heading 4",
      img: "https://www.timeshighereducation.com/student/sites/default/files/styles/default/public/istock-499343530.jpg",
      likes: 135,
    },
  ];

  const [activeSlide, setActiveSlide] = useState(slide);
  const touchStartRef = useRef(null);

  const nextSlide = () => {
    const nextIndex = activeSlide === stories.length - 1 ? 0 : activeSlide + 1;
    setActiveSlide(nextIndex);
    updateSlide(nextIndex);
  };

  const prevSlide = () => {
    const prevIndex = activeSlide === 0 ? stories.length - 1 : activeSlide - 1;
    setActiveSlide(prevIndex);
    updateSlide(prevIndex);
  };

  const handleTouchStart = (e) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchDiff = touchStartRef.current - touchEndX;

    if (touchDiff > 30) nextSlide();
    else if (touchDiff < -30) prevSlide();
  };

  const updateSlide = (newSlide) => {
    const params = Object.fromEntries(searchParams);
    setSearchParams({ ...params, slide: newSlide });
  };

  const shareSlide = async () => {
    const link = `${window.location.origin}?story=123456&slide=${activeSlide}`;
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Link copied to clipboard.");
    } catch (error) {}
  };

  useEffect(() => {
    if (open) setActiveSlide(slide);
  }, [open, slide]);

  console.log(Object.fromEntries(searchParams));

  return (
    <Modal
      open={open}
      onClose={onClose}
      center
      classNames={{ modal: "viewStory" }}
      styles={{
        overlay: {
          background: "rgba(0, 0, 0, 0.9)",
        },
      }}
      showCloseIcon={false}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <img
        src="/icons/arrow-left.svg"
        className="arrowNav"
        onClick={prevSlide}
        alt="arrow left"
      />
      <div
        className="storyCard"
        style={{
          backgroundImage: `url(${stories[activeSlide].img})`,
        }}
      >
        <div className="header">
          <div className="slidecount">
            {stories.map((_, idx) => (
              <hr
                className={`line ${
                  idx === stories[activeSlide].id - 1 && "active"
                }`}
                key={idx}
              />
            ))}
          </div>
          <div className="action">
            <div>
              <img src="/icons/x-mark.svg" onClick={onClose} alt="x-mark" />
            </div>
            <div>
              <img src="/icons/send.svg" onClick={shareSlide} alt="share" />
            </div>
          </div>
        </div>
        <div className="footer">
          <h3>{stories[activeSlide].title}</h3>
          <p>{stories[activeSlide].desc}</p>
          <div className="action">
            <div className="bookmark active">
              <svg
                viewBox="0 0 24 24"
                data-name="Line Color"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="m12 17-7 4V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v17Z" />
              </svg>
            </div>
            <div className="download">
              <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                <path d="M232 64h48v150l-3 56 23-28 56-53 32 32-132 132-132-132 32-32 56 53 23 28-3-56zM64 400h384v48H64z" />
              </svg>
            </div>
            <div className="like active">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 3c-1.535 0-3.078.5-4.25 1.7-2.343 2.4-2.279 6.1 0 8.5L12 23l9.25-9.8c2.279-2.4 2.343-6.1 0-8.5-2.343-2.3-6.157-2.3-8.5 0l-.75.8-.75-.8C10.078 3.5 8.536 3 7 3" />
              </svg>
              <p>{stories[activeSlide].likes}</p>
            </div>
          </div>
        </div>
      </div>
      <img
        src="/icons/arrow-right.svg"
        className="arrowNav"
        onClick={nextSlide}
        alt="arrow right"
      />
    </Modal>
  );
}

export default ViewStory;
