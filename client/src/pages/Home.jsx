import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PostCard from "../components/PostCard";

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts`);
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setPosts(data.posts);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-6 p-28 px-10  max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold lg:text-5xl">Welcome to my Blog</h1>
        <p className="text-gray-500 text-sm">
          Here you'll find a variety of articles and tutorials on topics such as
          web development, software engineering, and programming languages.
        </p>
        <Link
          to={`/search`}
          className="text-teal-500 hover:underline font-medium text-xs sm:text-sm w-fit"
        >
          View all posts
        </Link>
      </div>
      <div className="max-w-6xl py-7 mx-auto flex flex-col gap-8 px-3 ">
        {posts && posts.length > 0 && (
          <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-semibold text-center">Recent posts</h1>
            <div className="flex flex-wrap gap-5 justify-center">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          </div>
        )}
        <Link
          to={`/search`}
          className="text-teal-500 hover:underline font-medium text-sm sm:text-lg w-fit mx-auto "
        >
          View all posts
        </Link>
      </div>
    </div>
  );
};

export default Home;
