import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Spinner } from "flowbite-react";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";
const PostPage = () => {
  //getting postSlug from params using useParams hook;
  const { postSlug } = useParams();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState("");
  const [recentPosts, setRecentPosts] = useState([]);
  // console.log(post);
  useEffect(() => {
    try {
      setLoading(true);
      const fetchPost = async () => {
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setLoading(false);
          setError(true);
        } else {
          if (data.posts) {
            setPost(data.posts[0]); //storing data ;
          }
          setLoading(false);
          setError(false);
        }
      };

      fetchPost();
    } catch (error) {
      console.log(error);
      setError(true);
      setLoading(false);
    }
  }, [postSlug]);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?limit=3`);
        if (res.ok) {
          const data = await res.json();
          setRecentPosts(data.posts);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchRecentPosts();
  }, []); //mount only ones;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner className="w-20 h-20" size={"xl"} />
      </div>
    );
  }
  return (
    <main className="flex flex-col min-h-screen max-w-6xl p-3 mx-auto">
      <h1
        className="text-3xl mt-10 text-center font-serif mx-auto p-2 lg:text-4xl max-w-2xl 
      break-normal "
      >
        {post && post.title}
      </h1>
      <Link
        to={`/search?category=${post && post.category}`}
        className="self-center mt-5"
      >
        <Button color="gray" pill size={"xs"}>
          {post && post.category}
        </Button>
      </Link>
      <img
        src={post && post.image}
        alt={post && post.title}
        className="mt-10 max-h-[600px] w-full p-3 object-cover"
      />
      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto max-w-2xl w-full text-sm">
        {/* toDateString */}
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className="italic">
          {post && (post.content.length / 1000).toFixed(0)} mins read
        </span>
      </div>
      <div
        className="max-w-2xl w-full p-3  mx-auto post-content break-words"
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      ></div>
      <CommentSection postId={post._id} />
      <div className="flex flex-col justify-center items-center my-5 ">
        <h1 className="text-xl mt-5">Recent articles</h1>
        <div className="flex flex-wrap gap-5 mt-4 justify-center">
          {recentPosts &&
            recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      </div>
    </main>
  );
};

export default PostPage;
