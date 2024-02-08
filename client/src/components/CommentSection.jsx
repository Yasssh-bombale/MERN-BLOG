import { Button, Textarea, Spinner, Alert } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Comment from "./Comment";

const CommentSection = ({ postId }) => {
  const [comment, setComment] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [comments, setComments] = useState([]); //storing fetched comments to this array

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/getPostComments/${postId}`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchComments();
  }, [postId]);

  const commentSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`/api/comment/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: comment.trim(),
          postId,
          userId: currentUser._id,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setComment("");
        setError("");
        setLoading(false);
        setComments((prev) => [data, ...prev]);
      } else {
        setLoading(false);
        setComment("");
        if (data.message) {
          setError(data.message);
        }
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError("Something went wrong !");
    }
  };

  return currentUser ? (
    <div className="max-w-2xl w-full mx-auto">
      <div className="flex p-3 items-center gap-2 text-gray-500 my-5">
        <p>signed in as :</p>
        <img
          className="w-6 h-6 object-cover rounded-full"
          src={currentUser.profilePicture}
          alt="userImg"
        />
        <Link
          to={"/dashboard?tab=profile"}
          className="text-sm text-cyan-600 hover:underline font-semibold"
        >
          @{currentUser.username}
        </Link>
      </div>
      {currentUser && (
        <form
          onSubmit={commentSubmitHandler}
          className="border border-teal-500 rounded-md p-3"
        >
          <Textarea
            placeholder="Add a comment..."
            rows={"3"}
            maxLength={"200"}
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            className="text-[1rem]"
          />
          <div className="w-full flex justify-between mt-5 items-center ">
            <p className="text-gray-500 pl-3">
              {200 - comment.length} characters remaining
            </p>
            <Button outline gradientDuoTone={"purpleToBlue"} type="submit">
              {loading ? (
                <>
                  <Spinner size={"sm"} className="mr-2" />
                  <span>Commenting...</span>
                </>
              ) : (
                "Comment"
              )}
            </Button>
          </div>
          {error && (
            <Alert color={"failure"} className="mt-4 text-[1rem]">
              {error}
            </Alert>
          )}
        </form>
      )}
      {comments && comments.length === 0 ? (
        <p className="my-5 text-[1rem]">No comments yet!</p>
      ) : (
        <>
          <div className="flex items-center gap-2 my-4">
            <p>Comments</p>
            <div className="border border-gray-400 px-3 py-1 rounded-md">
              <p>{comments && comments.length}</p>
            </div>
          </div>
          {comments.map((comment) => (
            <Comment key={comment._id} comment={comment} />
          ))}
        </>
      )}
    </div>
  ) : (
    <div className="flex items-center gap-2 text-teal-500  max-w-2xl w-full p-3 my-5 mx-auto ">
      <p>You must be signed in to comment.</p>
      <Link to={`/sign-in`} className="text-blue-500 hover:underline">
        Sign in
      </Link>
    </div>
  );
};

export default CommentSection;
