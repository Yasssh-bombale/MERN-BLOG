import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const CreatePost = () => {
  const [file, setFile] = useState("");
  const [imageUploadProgress, setImageUploadProgress] = useState("");
  const [formData, setFormData] = useState({});
  const [imageUploadError, setImageUploadError] = useState("");
  const [publishError, setPublishError] = useState("");

  const navigate = useNavigate();

  const imageUploadHandler = async () => {
    if (!file) return setImageUploadError("Please select an image");
    try {
      setImageUploadError("");
      setImageUploadProgress("");
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          console.log(error);
          setImageUploadError(
            "Could not upload image (file must be less than 2MB)"
          );
          setImageUploadProgress("");
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURl) => {
            // console.log(`image is live at :${downloadURl}`);
            setFormData({ ...formData, image: downloadURl });
            setImageUploadProgress("");
            setImageUploadError("");
          });
        }
      );
    } catch (error) {
      setImageUploadError("Image upload failed");
      setImageUploadProgress("");
      console.log(error);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/post/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        return setPublishError(data.message);
      } else {
        navigate(`/${data.post.slug}`);
        toast.success(data.message);
        setPublishError("");
      }
    } catch (error) {
      console.log(error);
      setPublishError(error.message);
    }
  };

  return (
    <div className="min-h-screen max-w-3xl p-3 mx-auto">
      <h1 className="text-center text-3xl font-semibold my-7">Create a post</h1>
      <form className="flex flex-col gap-4" onSubmit={submitHandler}>
        <div className="flex flex-col gap-4 sm:flex-row">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value={"uncategorized"}>Select a category</option>
            <option value={"javascript"}>JavaScript</option>
            <option value={"reactjs"}>React.js</option>
            <option value={"nextjs"}>Next.js</option>
            <option value={"nodejs"}>Node.js</option>
          </Select>
        </div>
        <div className="border-4 border-teal-500 border-dotted p-3 flex justify-between items-center gap-2">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            gradientDuoTone={"purpleToBlue"}
            outline
            size={"sm"}
            onClick={imageUploadHandler}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <CircularProgressbar
                className="w-16 h-16"
                value={imageUploadProgress}
                text={`${imageUploadProgress}%` || 0}
              />
            ) : (
              "Upload image"
            )}
          </Button>
        </div>
        {imageUploadError && (
          <Alert color={"failure"}>{imageUploadError}</Alert>
        )}
        {formData.image && (
          <img
            src={formData.image}
            alt="upload"
            className="w-full h-72 object-cover"
          />
        )}
        <ReactQuill
          theme="snow"
          placeholder="Write something..."
          className="h-72 mb-12"
          required
          onChange={(value) => setFormData({ ...formData, content: value })}
        />
        <Button type="submit" gradientDuoTone={"purpleToPink"}>
          Publish
        </Button>
        {publishError && (
          <Alert color={"failure"} className="mt-4 font-semibold">
            {" "}
            {publishError}{" "}
          </Alert>
        )}
      </form>
    </div>
  );
};

export default CreatePost;
