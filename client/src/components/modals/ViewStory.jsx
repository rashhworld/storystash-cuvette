import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Modal } from "react-responsive-modal";
import { toast } from "react-toastify";
import { saveUserActionApi, fetchUserActionApi } from "../../apis/User";
import {
  fetchStoryByIdApi,
  updateSlideLikeApi,
  downloadStoryApi,
} from "../../apis/Story";
import "../../assets/modals/ViewStory.css";

function ViewStory({ open, onClose, authType, userToken }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const storyId = searchParams.get("story");
  const [storyData, setStoryData] = useState([]);

  const slideParam = parseInt(searchParams.get("slide"), 10) || 0;
  const slideId = storyData[slideParam] !== undefined ? slideParam : 0;
  const [activeSlide, setActiveSlide] = useState(slideId);
  const [slideAction, setSlideAction] = useState({});

  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  const { heading, description, media, likes } = storyData[activeSlide] ?? {};

  const getMediaType = () => {
    const extension = media.split(".").pop().toLowerCase();
    const mediaTypes = {
      image: ["jpg", "jpeg", "png", "gif", "webp", "svg"],
      video: ["mp4", "mkv", "webm", "ogg", "avi", "mov"],
    };
    for (const [type, exts] of Object.entries(mediaTypes)) {
      if (exts.includes(extension)) return { type, extension };
    }
    return "unknown";
  };

  const nextSlide = () => {
    const nextIndex =
      activeSlide === storyData.length - 1 ? 0 : activeSlide + 1;
    setActiveSlide(nextIndex);
    updateSlide(nextIndex);
  };

  const prevSlide = () => {
    const prevIndex =
      activeSlide === 0 ? storyData.length - 1 : activeSlide - 1;
    setActiveSlide(prevIndex);
    updateSlide(prevIndex);
  };

  const updateSlide = (newSlide) => {
    const params = Object.fromEntries(searchParams);
    setSearchParams({ ...params, slide: newSlide });
  };

  const shareSlide = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}?story=${storyId}&slide=${activeSlide}`
      );
      toast.success("Link copied to clipboard.");
    } catch (error) {}
  };

  const toggleMediaSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const handleSlideAction = async (type) => {
    if (!userToken) {
      authType("Login");
      return;
    }
    if (type == "download") {
      await downloadStoryApi(media);
      return;
    }

    await saveUserActionApi(type, storyId, activeSlide, userToken);

    setSlideAction((prevData) => {
      const currentData = prevData[type];
      const updatedData = currentData.includes(activeSlide)
        ? currentData.filter((item) => item !== activeSlide)
        : [...currentData, activeSlide];
      return {
        ...prevData,
        [type]: updatedData,
      };
    });
  };

  const updateSlideLike = async () => {
    const like = slideAction.like.includes(activeSlide) ? -1 : 1;
    const updatedLikesCount = await updateSlideLikeApi(
      storyId,
      activeSlide,
      like,
      userToken
    );
    setStoryData((prevData) => {
      const newData = [...prevData];
      newData[activeSlide].likes = updatedLikesCount;
      return newData;
    });
  };

  useEffect(() => {
    (async () => {
      if (storyId) {
        const story = await fetchStoryByIdApi(storyId);
        const action =
          userToken && (await fetchUserActionApi(storyId, userToken));
        if (story) {
          setStoryData(story);
          setSlideAction(action);
          if (slideParam < 0 || slideParam >= story.length) onClose();
        } else onClose();
      }
    })();
  }, [storyId, userToken]);

  useEffect(() => {
    if (open) setActiveSlide(slideId);
  }, [open, slideId]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      center
      classNames={{ modal: "viewStory" }}
      showCloseIcon={false}
    >
      <img
        src="/icons/arrow-left.svg"
        className="arrowNav"
        onClick={prevSlide}
        alt="arrow left"
      />
      {storyData.length > 0 ? (
        <div className="storyCard">
          <div className="header">
            <div className="slidecount">
              {storyData.map((_, idx) => (
                <hr
                  className={`line ${idx === slideId && "active"}`}
                  onClick={() => setActiveSlide(idx)}
                  key={idx}
                />
              ))}
            </div>
            <div className="action">
              <img src="/icons/x-mark.svg" onClick={onClose} alt="x-mark" />
              {getMediaType().type == "video" && (
                <img
                  src="/icons/audio.svg"
                  onClick={toggleMediaSound}
                  alt="sound"
                />
              )}
              <img src="/icons/send.svg" onClick={shareSlide} alt="share" />
            </div>
          </div>
          <div className="media">
            {getMediaType().type == "image" ? (
              <img src={media} alt="media" />
            ) : (
              <video autoPlay loop muted={isMuted} ref={videoRef}>
                <source
                  src={media}
                  type={`video/${getMediaType().extension}`}
                />
              </video>
            )}
          </div>
          <div className="footer">
            <h3>{heading}</h3>
            <p>{description}</p>
            <div className="action">
              <div
                className={`bookmark ${
                  slideAction?.bookmark?.includes(activeSlide) && "active"
                }`}
                onClick={() => handleSlideAction("bookmark")}
              >
                <svg
                  viewBox="0 0 24 24"
                  data-name="Line Color"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="m12 17-7 4V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v17Z" />
                </svg>
              </div>
              <div
                className="download"
                onClick={() => handleSlideAction("download")}
              >
                <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                  <path d="M232 64h48v150l-3 56 23-28 56-53 32 32-132 132-132-132 32-32 56 53 23 28-3-56zM64 400h384v48H64z" />
                </svg>
              </div>
              <div
                className={`like ${
                  slideAction?.like?.includes(activeSlide) && "active"
                }`}
                onClick={() => {
                  handleSlideAction("like");
                  updateSlideLike();
                }}
              >
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 3c-1.535 0-3.078.5-4.25 1.7-2.343 2.4-2.279 6.1 0 8.5L12 23l9.25-9.8c2.279-2.4 2.343-6.1 0-8.5-2.343-2.3-6.157-2.3-8.5 0l-.75.8-.75-.8C10.078 3.5 8.536 3 7 3" />
                </svg>
                <p>{likes > 0 && likes}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="nodata">Loading ...</p>
      )}
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
