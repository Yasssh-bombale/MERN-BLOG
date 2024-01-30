import { Button } from "flowbite-react";
import React from "react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/user.slice";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import toast from "react-hot-toast";
const Oauth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //  launching confetti animation on user sign in with google;
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

  //google btn handler;
  const changeHandler = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" }); // Allowing users if selecting popup window even if they have only one account

    try {
      //refering docs:- https://firebase.google.com/docs/auth/web/google-signin#web-modular-api_4
      const auth = getAuth(app);
      const resultFromGoogle = await signInWithPopup(auth, provider);
      // console.log(resultFromGoogle);

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: resultFromGoogle.user.displayName,
          email: resultFromGoogle.user.email,
          googlePhotoUrl: resultFromGoogle.user.photoURL,
        }),
      });
      const data = await res.json(); //*** Note : await is required */
      // console.log(data);
      if (res.ok) {
        if (data.rest) {
          dispatch(signInSuccess(data.rest));
          if (data.message) {
            toast.success(data.message);
            launchConfetti(); //launching confitte animation on success;
          }
        }

        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Button
        type="button"
        gradientDuoTone={"pinkToOrange"}
        outline
        onClick={changeHandler}
      >
        <AiFillGoogleCircle className="w-6 h-6 mr-2" />
        Continue with Google
      </Button>
    </>
  );
};

export default Oauth;
