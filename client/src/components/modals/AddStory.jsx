import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { userLoginApi, userRegisterApi } from "../../apis/User";
import { Modal } from "react-responsive-modal";
import "../../assets/modals/AddStory.css";

function AddStory({ open, onClose }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm();

  const [allSlides, setAllSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(-1);
  const videoRef = useRef(null);

  const mediaTypes = {
    image: ["jpg", "jpeg", "png", "gif", "webp", "svg"],
    video: ["mp4", "mkv", "webm", "ogg", "avi", "mov"],
  };

  const getAllowedExtensions = () => {
    const imageExt = mediaTypes.image.join(", ");
    const videoExt = mediaTypes.video.join(", ");
    return `Supported image formats are: ${imageExt}. Supported video formats are: ${videoExt}.`;
  };

  const validateMediaUrl = async (url) => {
    const ext = url.split(".").pop().toLowerCase();

    if (mediaTypes.image.includes(ext)) {
      clearErrors("media");
      return true;
    }

    if (mediaTypes.video.includes(ext)) {
      if (videoRef.current) {
        return new Promise((resolve) => {
          videoRef.current.src = url;
          videoRef.current.load();

          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current.duration > 16) {
              setError("media", {
                type: "manual",
                message: "Video length must be 15 seconds or less.",
              });
              resolve(false);
            } else {
              clearErrors("media");
              resolve(true);
            }
          };

          videoRef.current.onerror = () => {
            setError("media", {
              type: "manual",
              message: "Failed to load video. Please check the URL.",
            });
            resolve(false);
          };
        });
      }
    }

    setError("media", {
      type: "manual",
      message: `The media URL is invalid. ${getAllowedExtensions()}`,
    });
    return false;
  };

  const changeCategory = (newCategory) => {
    const updatedSlides = allSlides.map((slide) => ({
      ...slide,
      category: newCategory,
    }));

    setAllSlides(updatedSlides);
  };

  const onSubmit = async (data) => {
    const isValid = await validateMediaUrl(data.media);

    if (isValid) {
      data.likes = 0;
      changeCategory(data.category);
      setAllSlides((prevSlide) => [...prevSlide, data]);
      setCurrentSlide((prevCount) => prevCount + 1);
      reset();
    }
  };

  const nextSlide = () => {
    const nextIndex =
      currentSlide === allSlides.length - 1 ? currentSlide : currentSlide + 1;
    setCurrentSlide(nextIndex);
    reset(allSlides[nextIndex]);
  };

  const prevSlide = () => {
    const prevIndex = currentSlide === 0 ? currentSlide : currentSlide - 1;
    setCurrentSlide(prevIndex);
    reset(allSlides[prevIndex]);
  };

  const deleteSlide = (index) => {
    setAllSlides((prevSlides) => prevSlides.filter((_, i) => i !== index));
    reset(allSlides[index - 1]);
  };

  console.log(allSlides);

  return (
    <Modal
      open={open}
      onClose={onClose}
      center
      classNames={{ modal: "addStory" }}
      showCloseIcon={false}
    >
      <img
        className="closeModal"
        src="/icons/x-circle.svg"
        onClick={onClose}
        alt="Close"
      />
      <div className="header">
        <h2>Add story to feed</h2>
        <p className="hints">Add upto 6 slides </p>
      </div>
      <div className="storyContainer">
        <div className="slideCount">
          {allSlides.map((_, i) => (
            <div
              className="slideBox"
              onClick={() => {
                reset(allSlides[i]);
                setCurrentSlide(i);
              }}
              key={i}
            >
              {i >= 3 && (
                <img
                  src="/icons/x-circle.svg"
                  onClick={() => deleteSlide(i)}
                  alt="x-circle"
                />
              )}
              <div className="card">Slide {i + 1}</div>
            </div>
          ))}
          {allSlides.length < 6 && (
            <div className="slideBox">
              <div className="card active" onClick={handleSubmit(onSubmit)}>
                Add +
              </div>
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="inputs">
            <label htmlFor="heading">Heading :</label>
            <div className="group">
              <input
                type="text"
                id="heading"
                {...register("heading", {
                  required: "Heading is required",
                })}
                placeholder="Your heading"
              />
              {errors.heading && (
                <span className="error">{errors.heading.message}</span>
              )}
            </div>
          </div>
          <div className="inputs">
            <label htmlFor="description">Description :</label>
            <div className="group">
              <textarea
                rows={5}
                id="description"
                {...register("description", {
                  required: "Description is required",
                })}
                placeholder="Story Description"
              />
              {errors.description && (
                <span className="error">{errors.description.message}</span>
              )}
            </div>
          </div>
          <div className="inputs">
            <label htmlFor="media">Image/Video :</label>
            <div className="group">
              <input
                type="text"
                id="media"
                {...register("media", {
                  required: "Media link is required",
                })}
                placeholder="Add Image/Video URL"
              />
              {errors.media && (
                <span className="error">{errors.media.message}</span>
              )}
            </div>
          </div>
          <div className="inputs">
            <label htmlFor="category">Category :</label>
            <div className="group">
              <select
                id="category"
                {...register("category", {
                  required: "Category is required",
                })}
              >
                <option value="" hidden>
                  Select category
                </option>
                <option value="Food">Food</option>
                <option value="Health and fitness">Health and fitness</option>
                <option value="Travel">Travel</option>
                <option value="Movie">Movie</option>
                <option value="Education">Education</option>
              </select>
              {errors.category && (
                <span className="error">{errors.category.message}</span>
              )}
            </div>
          </div>
          <div className="storyAction">
            <div>
              <button type="button" className="prevSlide" onClick={prevSlide}>
                Previous
              </button>
              <button type="button" className="nextSlide" onClick={nextSlide}>
                Next
              </button>
            </div>
            <div>
              <button type="submit">Post</button>
            </div>
          </div>
          <video ref={videoRef} style={{ display: "none" }} />
        </form>
      </div>
    </Modal>
  );
}

export default AddStory;
