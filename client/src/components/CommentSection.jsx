import { Button, Textarea, Spinner, Alert } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Comment from "./Comment";
import { useNavigate } from "react-router-dom";

const CommentSection = ({ postId }) => {
  const [comment, setComment] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [comments, setComments] = useState([]); //storing fetched comments to this array
  const navigate = useNavigate();
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

  const likeHandler = async (commentId) => {
    if (!currentUser) {
      return navigate("/sign-in");
    }

    try {
      const res = await fetch(`/api/comment/likeComments/${commentId}`, {
        method: "PUT",
      });
      if (res.ok) {
        const data = await res.json();
        setComments((prev) =>
          prev.map((prevComment) =>
            prevComment._id === commentId
              ? {
                  ...prevComment,
                  likes: data.likes,
                  numberOfLikes: data.likes.length,
                }
              : prevComment
          )
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const editCommentHandler = async (comment, editedComment) => {
    setComments((prev) =>
      prev.map((c) =>
        c._id === comment._id ? { ...c, content: editedComment } : c
      )
    );
  };

  return (
    <div className="max-w-2xl w-full mx-auto">
      {currentUser ? (
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
      ) : (
        <div className="flex items-center gap-2 text-teal-500  max-w-2xl w-full p-3 my-5 mx-auto ">
          <p>You must be signed in to comment.</p>
          <Link to={`/sign-in`} className="text-blue-500 hover:underline">
            Sign in
          </Link>
        </div>
      )}
      {/* comment form */}
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
            <Comment
              key={comment._id}
              comment={comment}
              onLike={likeHandler}
              onEdit={editCommentHandler}
            />
          ))}
        </>
      )}
    </div>
  ); //target
};

export default CommentSection;
