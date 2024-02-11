import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const DashBoardComponent = () => {
  const { currentUser } = useSelector((state) => state.user); //getting currentUser;

  // useStates;
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [numberOfUsers, setNumberOfUsers] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [numberOfPosts, setNumberOfPosts] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/user/getUsers?limit=5`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setNumberOfUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers);
        }
      } catch (error) {
        console.log(error);
      }
    };
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/post/getposts?limit=5");
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
          setNumberOfPosts(data.totalPosts);
          setLastMonthPosts(data.lastMonthPosts);
        }
      } catch (error) {
        console.log(error);
      }
    };
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/getComments?limit=5`);
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          setTotalComments(data.totalComment);
          setLastMonthComments(data.lastMonthComments);
        }
      } catch (error) {
        console.log(error);
      }
    };

    // allow fetch if  user is Admin; do not make request;if user is not admin;
    if (currentUser.isAdmin) {
      fetchUsers();
      fetchPosts();
      fetchComments();
    }
  }, [currentUser]);

  return <div>DashBoardComponent</div>;
};

export default DashBoardComponent;
