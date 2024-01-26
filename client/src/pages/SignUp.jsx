import React from "react";
import { Link } from "react-router-dom";
import { Button, Label, TextInput } from "flowbite-react";
import img1 from "../img/ios memoji 3.jpg";
const SignUp = () => {
  return (
    <div className="border border-black min-h-screen mt-20">
      <div className="border border-black flex flex-col md:flex-row md:items-center max-w-3xl md:max-w-5xl mx-auto gap-10 md:gap-14">
        {/* left side */}
        {/* flex-1 cause equal distribution of size between left part and right part */}
        <div className="flex-1 flex flex-col">
          <div className="md:flex md:items-center self-center border border-black ">
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
          <p className="text-lg mt-5 border border-black">
            This is a blog website.You can sign up with your email and password
            or with google
          </p>
        </div>
        {/* right side */}
        <div className="flex-1">
          <form className="flex flex-col gap-4">
            <div>
              <Label value="Your username" className="text-[1rem]" />
              <TextInput id="username" placeholder="Username" required />
            </div>
            <div>
              <Label value="Your email" className="text-[1rem]" />
              <TextInput id="email" placeholder="Email" required />
            </div>
            <div>
              <Label value="Your password" className="text-[1rem]" />
              <TextInput id="password" placeholder="Password" required />
            </div>
            <Button type="submit" size={"md"} gradientDuoTone={"purpleToPink"}>
              Sign Up
            </Button>
          </form>
          <div className="flex gap-2 mt-2 text-[1rem]">
            <span>Have an account?</span>
            <Link to={"/sign-in"} className="text-blue-500">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
