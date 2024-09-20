import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { userLoginApi, userRegisterApi } from "../../apis/User";
import { Modal } from "react-responsive-modal";
import "../../assets/modals/UserAuth.css";

function UserAuth({ open, onClose, authType, setUserToken }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [showPass, setShowPass] = useState(false);

  const onSubmit = async (data) => {
    const apiCall = authType === "Register" ? userRegisterApi : userLoginApi;
    const token = await apiCall(data);

    if (token) {
      localStorage.setItem("authToken", token);
      closeAuthModal();
      setUserToken(token);
    }
  };

  const closeAuthModal = () => {
    onClose();
    reset();
  };

  return (
    <Modal
      open={open}
      onClose={closeAuthModal}
      center
      classNames={{ modal: "userAuth" }}
      showCloseIcon={false}
    >
      <img
        className="closeModal"
        src="/icons/x-circle.svg"
        onClick={closeAuthModal}
        alt="Close"
      />
      <h1>{authType}</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="inputs">
          <label htmlFor="userName">Username</label>
          <div className="group">
            <input
              type="text"
              id="userName"
              {...register("userName", {
                required: "Username is required",
                pattern: {
                  value: /^[A-Za-z0-9]{6,}$/,
                  message:
                    "Username must be at least 6 characters and contain only letters and numbers without any space.",
                },
              })}
              placeholder="Enter Username"
            />
            {errors.userName && (
              <span className="error">{errors.userName.message}</span>
            )}
          </div>
        </div>
        <div className="inputs">
          <label htmlFor="userPass">Password</label>
          <div className="group">
            <input
              type={showPass ? "text" : "password"}
              id="userPass"
              {...register("userPass", {
                required: "Password is required",
                pattern: {
                  value:
                    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/,
                  message:
                    "Password must be at least 6 characters long, with one number, one letter and one special character.",
                },
              })}
              placeholder="Enter Password"
            />
            {errors.userPass && (
              <span className="error">{errors.userPass.message}</span>
            )}
          </div>
          <img
            className="togglePass"
            src="/icons/eye.svg"
            onClick={() => setShowPass(!showPass)}
            alt="Toggle Password Visibility"
          />
        </div>
        <button type="submit" className="loginBtn">
          {authType}
        </button>
      </form>
    </Modal>
  );
}

export default UserAuth;
