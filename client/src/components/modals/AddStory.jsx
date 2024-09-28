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
    formState: { errors },
    setError,
    clearErrors,
    trigger,
    getValues,
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

    setError("media", {
      type: "manual",
      message: "Checking media. Please wait ...",
    });

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
      changeCategory(data.category);
      const slideLen = allSlides.length;

      if (currentSlide === slideLen || currentSlide === -1) {
        setAllSlides((prevSlide) => [...prevSlide, data]);
        if (slideLen + 1 > 5) setCurrentSlide(5);
        else setCurrentSlide(slideLen + 1);
      } else {
        const updatedSlides = [...allSlides];
        updatedSlides[currentSlide] = data;
        setAllSlides(updatedSlides);
        setCurrentSlide(slideLen);
      }
      if (currentSlide < 5) {
        reset({
          heading: "",
          description: "",
          media: "",
          category: "",
        });
      }
      return true;
    }
    return false;
  };

  const handleHeaderNav = async (idx) => {
    let noData = true;
    Object.values(getValues()).forEach((value) => {
      if (value !== "") noData = false;
    });

    if (noData) {
      setCurrentSlide(idx);
      reset(allSlides[idx]);
      return;
    }

    if (await trigger()) {
      if (await onSubmit(getValues())) {
        reset(allSlides[idx]);
        setCurrentSlide(idx);
      }
    }
  };

  const handleFooterNav = async (type) => {
    let noData = true;
    Object.values(getValues()).forEach((value) => {
      if (value !== "") noData = false;
    });

    let navIdx;
    if (type === "prev") {
      if (currentSlide > 5) navIdx = 5;
      else navIdx = currentSlide === 0 ? currentSlide : currentSlide - 1;
    } else if (type === "next") {
      navIdx =
        currentSlide === allSlides.length - 1 ? currentSlide : currentSlide + 1;
    }

    if (noData) {
      setCurrentSlide(navIdx);
      reset(allSlides[navIdx]);
      return;
    }

    if (await trigger()) {
      if (await onSubmit(getValues())) {
        setCurrentSlide(navIdx);
        reset(allSlides[navIdx]);
      }
    }
  };

  const deleteSlide = (e, index) => {
    e.stopPropagation();

    setAllSlides((prevSlides) => {
      const newSlides = prevSlides.filter((_, i) => i !== index);
      if (newSlides.length > 0 && index > 0) {
        if (index < newSlides.length) {
          reset(newSlides[index]);
          setCurrentSlide(index);
        } else {
          reset(newSlides[newSlides.length - 1]);
          setCurrentSlide(newSlides.length - 1);
        }
      } else if (newSlides.length > 0) {
        reset(newSlides[0]);
        setCurrentSlide(0);
      }
      console.log("newSlide: ", newSlides);
      return newSlides;
    });
  };

  const createStory = async () => {
    if (!userToken) {
      alert("please login");
      return;
    }

    let noData = true;
    Object.values(getValues()).forEach((value) => {
      if (value !== "") noData = false;
    });

    if (noData && allSlides.length > 2) {
      createStoryApi(allSlides, userToken);
      setAllSlides([]);
      setCurrentSlide(-1);
      onClose();
      return;
    }

    if (await trigger()) {
      const values = getValues();
      const tempAllSlides = [...allSlides];

      if (currentSlide >= 0 && currentSlide < tempAllSlides.length) {
        tempAllSlides[currentSlide] = values;
      } else {
        tempAllSlides.push(values);
      }

      const updatedSlides = tempAllSlides.map((slide) => {
        return {
          ...slide,
          likes: slide.likes || 0,
        };
      });

      if (await onSubmit(values)) {
        setAllSlides(updatedSlides);
        await createStoryApi(updatedSlides, userToken, storyId);
        onClose();
      }
    }
  };

  useEffect(() => {
    reset({
      heading: "",
      description: "",
      media: "",
      category: "",
    });
    if (storyData.length > 0) {
      setAllSlides(storyData);
      reset(storyData[0]);
      setCurrentSlide(0);
    } else {
      setAllSlides([]);
      setCurrentSlide(-1);
    }
  }, [storyData]);

  // console.log(storyData);

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
              onClick={() => handleHeaderNav(i)}
              key={i}
            >
              {i >= 3 && (
                <img
                  src="/icons/x-circle.svg"
                  onClick={(e) => deleteSlide(e, i)}
                  alt="x-circle"
                />
              )}
              <div className={`card ${i === currentSlide ? "active" : ""}`}>
                Slide {i + 1}
              </div>
            </div>
          ))}
          {allSlides.length < 6 && (
            <div className="slideBox">
              <div className="card" onClick={handleSubmit(onSubmit)}>
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
              <button
                type="button"
                className="prevSlide"
                onClick={() => handleFooterNav("prev")}
                disabled={currentSlide === 0 || currentSlide === -1}
              >
                Previous
              </button>
              <button
                type="button"
                className="nextSlide"
                onClick={() => handleFooterNav("next")}
                disabled={currentSlide >= allSlides.length - 1}
              >
                Next
              </button>
            </div>
            <div>
              <button
                type="submit"
                disabled={currentSlide < 2 && allSlides.length < 3}
                onClick={createStory}
              >
                Post
              </button>
            </div>
          </div>
          <video ref={videoRef} style={{ display: "none" }} />
        </form>
      </div>
    </Modal>
  );
}

export default AddStory;
