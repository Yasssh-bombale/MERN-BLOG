import React, { useEffect, useState } from "react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Button, Textarea, Alert } from "flowbite-react";

const Comment = ({ comment, onLike, onEdit, onDelete }) => {
  const [user, setUser] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  const [isEditable, setIsEditable] = useState(false);
  const [editedComment, setEditedComment] = useState(comment.content);
  const [editCommentError, setEditCommentError] = useState("");

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/${comment.userId}`);
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getUser();
  }, [comment]);

  //setter for edit comment
  const editCommentHandler = () => {
    setIsEditable(true);
  };

  //edit comment save handler both in database and ui;
  const editSaveHandler = async () => {
    try {
      setEditCommentError("");
      const res = await fetch(`/api/comment/editComment/${comment._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: editedComment.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        onEdit(comment, editedComment);
        setIsEditable(false);
        setEditCommentError("");
      } else {
        setEditCommentError(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex p-4 border-b dark:border-gray-600 ">
      <div className="flex-shrink-0 mr-3">
        <img
          className="h-11 w-11 object-cover bg-gray-200 rounded-full"
          src={user.profilePicture}
          alt={user.username}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1  ">
          <span className="text-sm font-bold truncate mr-2 ">
            {user ? `@${user.username}` : "anonymous user"}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        {isEditable ? (
          <>
            <Textarea
              className="mb-2 mt-2"
              value={editedComment}
              onChange={(e) => setEditedComment(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button
                onClick={editSaveHandler}
                size={"sm"}
                gradientMonochrome={"success"}
              >
                Save
              </Button>
              <Button
                onClick={() => setIsEditable(false)}
                size={"sm"}
                gradientDuoTone={"purpleToBlue"}
                outline
              >
                Cancel
              </Button>
            </div>
            {editCommentError && (
              <Alert className="mt-2 text-sm font-semibold" color={"failure"}>
                {editCommentError}
              </Alert>
            )}
          </>
        ) : (
          <>
            <p className="text-gray-500 pl-2 mb-2 dark:text-gray-400">
              {comment.content}
            </p>
            <div className="flex items-center gap-2 border-t dark:border-gray-700 max-w-fit pt-2">
              <button
                onClick={() => onLike(comment._id)}
                className={`text-gray-500 hover:text-blue-500 ${
                  currentUser &&
                  comment.likes.includes(currentUser._id) &&
                  "!text-blue-500"
                }`}
              >
                <FaThumbsUp className="text-sm" />
              </button>
              <p className="text-sm text-gray-400">
                {comment.numberOfLikes > 0 &&
                  comment.numberOfLikes +
                    " " +
                    (comment.numberOfLikes === 1 ? "like" : "likes")}
              </p>
              {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <>
                    <button
                      onClick={editCommentHandler}
                      className="text-gray-400 hover:text-blue-500 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(comment._id)}
                      className="text-gray-400 hover:text-red-500 text-sm"
                    >
                      Delete
                    </button>
                  </>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Comment;
