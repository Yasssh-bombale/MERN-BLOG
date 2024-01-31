import { Alert, Button, Spinner, TextInput } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  updateStart,
  updateSuccess,
  updateFailure,
} from "../redux/user/user.slice";
import { toast } from "react-hot-toast";

const DashProfile = () => {
  const [imageFile, setImageFile] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [imageFileUploadingProgress, setImageFileUploadingProgress] =
    useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);

  const [formData, setFormData] = useState({});
  const [updateUserError, setUpdateUserError] = useState("");
  const [updateSuccessMSG, setUpdateSuccessMSG] = useState("");
  const filePickerRef = useRef();

  const dispatch = useDispatch(); //react-redux
  const { currentUser, loading } = useSelector((state) => state.user); //react-redux

  const imageChangeHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageURL(URL.createObjectURL(file));
    }
  };
  // useEffect()
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);
  //image uploading to firebase;
  const uploadImage = async () => {
    /*
    firestore data storage rules;
    service firebase.storage {
      match /b/{bucket}/o {
        match /{allPaths=**} {
          allow read;
          allow write:if request.resource.size < 2 * 1024 * 1024 &&
          request.resource.contentType.matches('image/.*')
        }
      }
    }
    */
    setImageFileUploading(true);
    setImageFileUploadError("");
    setImageFileUploadingProgress("");
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);

    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setImageFileUploadingProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          "Could not upload image (file must be less than 2MB)"
        );
        setImageFileUploadingProgress("");
        setImageFile(null);
        setImageURL(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURl) => {
          setImageURL(downloadURl);
          setFormData({ ...formData, profilePicture: downloadURl });
          setImageFileUploading(false);
        });
      }
    );
  };
  //formChnageHandler;
  const formChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  // formSubmitHandler
  const formSubmitHandler = async (e) => {
    e.preventDefault();
    setUpdateSuccessMSG("");
    setUpdateUserError("");
    if (Object.keys(formData).length === 0) {
      return setUpdateUserError("No changes made");
    }
    if (imageFileUploading) {
      return setUpdateUserError("Please wait for image to upload");
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data.rest));
        setImageFileUploadingProgress("");
        setUpdateUserError("");
        setUpdateSuccessMSG(data.message);
        toast.success(data.message); //success toast
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-4 font-semibold text-3xl text-center">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={formSubmitHandler}>
        <input
          type="file"
          accept="image/*"
          onChange={imageChangeHandler}
          ref={filePickerRef}
          hidden
        />
        <div
          className="relative w-32 h-32 self-center  overflow-hidden rounded-full cursor-pointer"
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadingProgress && (
            <CircularProgressbar
              value={imageFileUploadingProgress}
              text={`${imageFileUploadingProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  height: "100%",
                  width: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${
                    imageFileUploadingProgress / 100
                  })`,
                },
              }}
            />
          )}
          <img
            src={imageURL || currentUser.profilePicture}
            alt="user"
            className={`rounded-full w-full h-full border-8 border-[lightGray] object-cover ${
              imageFileUploadingProgress &&
              imageFileUploadingProgress < 100 &&
              "opacity-60"
            }`}
          />
        </div>
        {imageFileUploadError && (
          <Alert color={"failure"}>{imageFileUploadError}</Alert>
        )}
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          label="username"
          defaultValue={currentUser.username}
          onChange={formChangeHandler}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
          onChange={formChangeHandler}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="password"
          onChange={formChangeHandler}
        />
        <Button type="submit" gradientDuoTone={"purpleToBlue"} outline>
          {loading ? (
            <>
              <Spinner size={"sm"} />
              <span className="pl-3">Loading...</span>
            </>
          ) : (
            "Update account"
          )}
        </Button>
      </form>
      <div className="mt-4 text-red-500 flex justify-between">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Sign Out</span>
      </div>
      {updateUserError && (
        <Alert color={"failure"} className="mt-5">
          {updateUserError}
        </Alert>
      )}
      {updateSuccessMSG && (
        <Alert color={"success"} className="mt-5">
          {updateSuccessMSG}
        </Alert>
      )}
    </div>
  );
};

export default DashProfile;
