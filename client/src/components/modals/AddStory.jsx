import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { createStoryApi } from "../../apis/Story";
import { Modal } from "react-responsive-modal";
import "../../assets/modals/AddStory.css";

function AddStory({
  open,
  onClose,
  userToken,
  storyId = null,
  storyData = [],
}) {
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  const [allSlides, setAllSlides] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const videoRef = useRef(null);

  const maxSlides = 6;
  const minSlides = 3;

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

    setError("media", {
      type: "manual",
      message: "Checking media. Please wait ...",
    });

    await new Promise((resolve) => setTimeout(resolve, 500));

    if (mediaTypes.image.includes(ext)) {
      const img = new Image();
      img.src = url;

      return new Promise((resolve) => {
        img.onload = () => {
          clearErrors("media");
          resolve(true);
        };
        img.onerror = () => {
          setError("media", {
            type: "manual",
            message: "Failed to load image. Please check the URL.",
          });
          resolve(false);
        };
      });
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

  const validateForm = async () => {
    clearErrors();
    const currentValues = getValues();
    let hasError = false;

    ["heading", "description", "media", "category"].forEach((field) => {
      if (!currentValues[field]) {
        setError(field, {
          type: "manual",
          message: `${
            field.charAt(0).toUpperCase() + field.slice(1)
          } is required.`,
        });
        hasError = true;
      }
    });

    const isMediaValid =
      currentValues.media && (await validateMediaUrl(currentValues.media));
    if (!isMediaValid) {
      hasError = true;
    }

    return !hasError;
  };

  const handleAddSlide = async () => {
    const isFormValid = await validateForm();
    if (!isFormValid) return;

    const currentValues = getValues();
    const updatedAllSlides = [...allSlides];

    if (currentSlideIndex >= updatedAllSlides.length) {
      updatedAllSlides.push(currentValues);
    } else {
      updatedAllSlides[currentSlideIndex] = currentValues;
    }

    setAllSlides(updatedAllSlides);

    if (updatedAllSlides.length < maxSlides) {
      setCurrentSlideIndex(updatedAllSlides.length);
      reset();
    }
  };

  const handlePreviousSlide = async () => {
    const isFormValid = await validateForm();
    if (!isFormValid) return;

    const currentValues = getValues();
    const updatedAllSlides = [...allSlides];

    if (currentSlideIndex >= updatedAllSlides.length) {
      updatedAllSlides.push(currentValues);
    } else {
      updatedAllSlides[currentSlideIndex] = currentValues;
    }

    setAllSlides(updatedAllSlides);

    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
      setFormValues(updatedAllSlides[currentSlideIndex - 1]);
    }
  };

  const handleNextSlide = async () => {
    const isFormValid = await validateForm();
    if (!isFormValid) return;

    const currentValues = getValues();
    const updatedAllSlides = [...allSlides];

    if (currentSlideIndex >= updatedAllSlides.length) {
      updatedAllSlides.push(currentValues);
    } else {
      updatedAllSlides[currentSlideIndex] = currentValues;
    }

    setAllSlides(updatedAllSlides);

    if (currentSlideIndex < allSlides.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
      setFormValues(updatedAllSlides[currentSlideIndex + 1]);
    }
  };

  const handleDirectNavigation = async (index) => {
    const isFormValid = await validateForm();
    if (!isFormValid) return;

    const currentValues = getValues();
    const updatedAllSlides = [...allSlides];

    if (currentSlideIndex >= updatedAllSlides.length) {
      updatedAllSlides.push(currentValues);
    } else {
      updatedAllSlides[currentSlideIndex] = currentValues;
    }

    setAllSlides(updatedAllSlides);

    setCurrentSlideIndex(index);
    setFormValues(updatedAllSlides[index]);
  };

  const setFormValues = (slide) => {
    setValue("heading", slide.heading);
    setValue("description", slide.description);
    setValue("media", slide.media);
    setValue("category", slide.category);
  };

  const handleDeleteSlide = (index, event) => {
    event.stopPropagation();

    const updatedAllSlides = [...allSlides];

    updatedAllSlides.splice(index, 1);
    setAllSlides(updatedAllSlides);

    const newSlideIndex = updatedAllSlides.length - 1;

    setCurrentSlideIndex(newSlideIndex);
    setFormValues(updatedAllSlides[newSlideIndex]);
  };

  const handlePost = async () => {
    const isFormValid = await validateForm();
    if (!isFormValid) return;

    const currentValues = getValues();
    const updatedAllSlides = [...allSlides];

    if (currentSlideIndex >= updatedAllSlides.length) {
      updatedAllSlides.push(currentValues);
    } else {
      updatedAllSlides[currentSlideIndex] = currentValues;
    }

    setAllSlides(updatedAllSlides);

    if (updatedAllSlides.length >= minSlides - 1) {
      const lastSelectedCategory = currentValues.category;
      const processedSlides = updatedAllSlides.map((slide) => ({
        ...slide,
        category: lastSelectedCategory,
        likes: slide.likes > 0 ? slide.likes : 0,
      }));
      await createStoryApi(processedSlides, userToken, storyId);
    } else {
      setError("global", {
        type: "manual",
        message: "Please add at least 3 slides before posting.",
      });
    }
  };

  useEffect(() => {
    if (storyData.length > 0) {
      setAllSlides(storyData);
      setCurrentSlideIndex(0);
      setFormValues(storyData[0]);
    } else {
      setAllSlides([]);
      reset();
      setCurrentSlideIndex(0);
    }
  }, [storyData]);

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
            <div className="slideBox" key={i}>
              {i >= 3 && (
                <img
                  src="/icons/x-circle.svg"
                  onClick={(event) => handleDeleteSlide(i, event)}
                  alt="x-circle"
                />
              )}
              <div
                className={`card ${i === currentSlideIndex ? "active" : ""}`}
                onClick={() => handleDirectNavigation(i)}
              >
                Slide {i + 1}
              </div>
            </div>
          ))}
          {allSlides.length < 6 && (
            <div className="slideBox">
              <div
                className="card"
                onClick={handleAddSlide}
                disabled={allSlides.length >= maxSlides}
              >
                Add +
              </div>
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit(handlePost)}>
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
                  maxLength: {
                    value: 120,
                    message: "Description must be at most 120 characters",
                  },
                })}
                maxLength={120}
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
              <button
                type="button"
                className="prevSlide"
                onClick={handlePreviousSlide}
                disabled={currentSlideIndex === 0}
              >
                Previous
              </button>
              <button
                type="button"
                className="nextSlide"
                onClick={handleNextSlide}
                disabled={currentSlideIndex >= allSlides.length - 1}
              >
                Next
              </button>
            </div>
            <div>
              <button type="submit" disabled={allSlides.length < minSlides - 1}>
                Post
              </button>
            </div>
          </div>
        </form>
        <video ref={videoRef} style={{ display: "none" }} />
      </div>
    </Modal>
  );
}

export default AddStory;
