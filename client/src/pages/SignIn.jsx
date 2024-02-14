import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Label, TextInput, Alert, Spinner } from "flowbite-react";
import img1 from "../img/ios memoji 3.jpg";
import { BiError } from "react-icons/bi";
import toast from "react-hot-toast";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/user.slice";
import { useDispatch, useSelector } from "react-redux";
import Oauth from "../components/Oauth";
import confetti from "canvas-confetti";
import logo1 from "../img/logo1.jpg";
import logo2 from "../img/logo2.jpg";
import logo3 from "../img/logo3.jpg";
import logo4 from "../img/logo4.jpg";
import b1 from "../img/b1.jpg";
import b2 from "../img/b2.jpg";
import b3 from "../img/b3.jpg";
import b4 from "../img/b4.jpg";

const SignIn = () => {
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch(); //dispatcher for redux;
  const { loading, error: errorMessage } = useSelector((state) => state.user);

  // launching confetti animation on user sign in;
  const launchConfetti = () => {
    confetti({
      scalar: 1,
      spread: 180,
      particleCount: 100,
      angle: 90,
      origin: { y: -0.5 },
      startVelocity: -60,
    });

    setTimeout(() => {
      confetti({
        scalar: 1,
        spread: 180,
        particleCount: 100,
        angle: 90,
        origin: { y: -0.5 },
        startVelocity: -60,
      });
    }, 1000);
  };

  //input change Handler;
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() }); //trim() removes blank spaces;
  };
  // form handler;
  const submitHandler = async (e) => {
    e.preventDefault();
    // if (!formData.username || !formData.email || !formData.password) {
    //   setErrorMessage("All fields are required");
    // }
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      data.success === true ? dispatch(signInSuccess(data.rest)) : "";
      if (data.success === false) {
        if (data.message) {
          return dispatch(signInFailure(data.message));
        }
      }
      if (res.ok) {
        if (data.message) {
          toast.success(data.message);
          launchConfetti();
        }
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };
  return (
    <div className="min-h-screen mt-20">
      <div className="flex flex-col md:flex-row md:items-center max-w-3xl md:max-w-5xl mx-auto gap-6 md:gap-10">
        {/* left side */}
        {/* flex-1 cause equal distribution of size between left part and right part */}
        <div className="flex-1 flex flex-col p-5 md:p-2">
          <div className="md:flex md:items-center self-center">
            <Link
              to={"/"}
              className="text-3xl md:text-4xl  font-bold dark:text-white "
            >
              <div className="h-52 w-52 bg-white flex items-center rounded-2xl md:rounded-r-none">
                <img src={b4} alt="logo" className="w-full h-28 object-cover" />
              </div>
            </Link>
            <img
              src={img1}
              className="w-52 h-52 hidden md:inline rounded-r-2xl"
              alt="memoji"
            />
          </div>
          <p className="text-lg mt-5">
            This is a blog website.You can sign in with your email and password
            or with google
          </p>
        </div>
        {/* right side */}
        <div className="flex-1 p-3">
          <form className="flex flex-col gap-4" onSubmit={submitHandler}>
            <div>
              <Label value="Your email" className="text-[1rem]" />
              <TextInput
                id="email"
                type="email"
                placeholder="Email"
                // required
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your password" className="text-[1rem]" />
              <TextInput
                id="password"
                type="password"
                placeholder="***********"
                // required
                onChange={handleChange}
              />
            </div>
            <Button
              type="submit"
              size={"md"}
              gradientDuoTone={"purpleToPink"}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size={"sm"} />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            <Oauth />
          </form>
          <div className="flex gap-2 mt-2 text-[1rem]">
            <span>Dont have an account?</span>
            <Link to={"/sign-up"} className="text-blue-500">
              Sign Up
            </Link>
          </div>
          {errorMessage && (
            <Alert className="mt-4" color={"failure"} icon={BiError}>
              <p className="text-[1rem]">{errorMessage}</p>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
