import React, { useEffect, useState } from "react";
import moment from "moment";

const Comment = ({ comment }) => {
  const [user, setUser] = useState({});

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
          <span className="text-sm font-bold truncate mr-1 ">
            {user ? `@${user.username}` : "anonymous user"}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        <p className="text-gray-500 pl-2 mb-2">{comment.content}</p>
      </div>
    </div>
  );
};

export default Comment;
