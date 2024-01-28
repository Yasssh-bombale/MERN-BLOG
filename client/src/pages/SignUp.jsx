import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Label, TextInput, Alert, Spinner } from "flowbite-react";
import img1 from "../img/ios memoji 3.jpg";
import { BiError } from "react-icons/bi";
import toast from "react-hot-toast";
import Oauth from "../components/Oauth";

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() }); //trim() removes blank spaces;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    // if (!formData.username || !formData.email || !formData.password) {
    //   setErrorMessage("All fields are required");
    // }
    try {
      setErrorMessage("");
      setIsLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setIsLoading(false);
      if (data.success === false) {
        return setErrorMessage(data.message);
      }
      if (res.ok) {
        if (data.message) {
          toast.success(data.message);
        }
        navigate("/sign-in");
      }
    } catch (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
    }
  };
  return (
    <div className=" min-h-screen mt-20">
      <div className="flex flex-col md:flex-row md:items-center max-w-3xl md:max-w-5xl mx-auto gap-6 md:gap-10">
        {/* left side */}
        {/* flex-1 cause equal distribution of size between left part and right part */}
        <div className="flex-1 flex flex-col p-5 md:p-2">
          <div className="md:flex md:items-center self-center">
            <Link
              to={"/"}
              className="text-3xl md:text-4xl  font-bold dark:text-white "
            >
              <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 to-pink-500  text-white rounded-md">
                Yassshu's
              </span>
              Blog
            </Link>
            <img
              src={img1}
              className="w-52 h-52 hidden md:inline"
              alt="memoji"
            />
          </div>
          <p className="text-lg mt-5">
            This is a blog website.You can sign up with your email and password
            or with google
          </p>
        </div>
        {/* right side */}
        <div className="flex-1 p-3">
          <form className="flex flex-col gap-4" onSubmit={submitHandler}>
            <div>
              <Label value="Your username" className="text-[1rem]" />
              <TextInput
                id="username"
                type="text"
                placeholder="Username"
                // required
                onChange={handleChange}
              />
            </div>
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
                placeholder="Password"
                // required
                onChange={handleChange}
              />
            </div>
            <Button
              type="submit"
              size={"md"}
              gradientDuoTone={"purpleToPink"}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner size={"sm"} />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
            <Oauth />
          </form>
          <div className="flex gap-2 mt-2 text-[1rem]">
            <span>Have an account?</span>
            <Link to={"/sign-in"} className="text-blue-500">
              Sign In
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

export default SignUp;
