import { Button, Table, TableBody, TableHead } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { BiCommentDetail } from "react-icons/bi";
import { HiArrowNarrowUp, HiDocumentText } from "react-icons/hi";
import { HiMiniUserGroup } from "react-icons/hi2";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

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

  return (
    <div className="p-3 md:mx-auto">
      <div
        className="flex flex-wrap  justify-center
      gap-4 "
      >
        {/* users */}
        <div className="flex flex-col dark:bg-slate-800 gap-4 p-3 w-full md:w-72 rounded-md shadow-md">
          <div className="flex justify-between">
            <div>
              <h3 className="text-xl font-medium text-gray-500 uppercase">
                Total users
              </h3>
              <p className="text-2xl">{numberOfUsers}</p>
            </div>
            <HiMiniUserGroup className="bg-teal-600 text-5xl p-2 rounded-full text-white shadow-lg" />
          </div>
          <div className="flex gap-2">
            <span className="flex text-green-500 items-center font-medium">
              <HiArrowNarrowUp />
              {lastMonthUsers}
            </span>
            <div className="text-gray-500">Last month</div>
          </div>
        </div>
        {/* total comments */}
        <div className="flex flex-col dark:bg-slate-800 gap-4 p-3 w-full md:w-72 rounded-md shadow-md">
          <div className="flex justify-between">
            <div>
              <h3 className="text-xl font-medium text-gray-500 uppercase">
                Total comments
              </h3>
              <p className="text-2xl">{totalComments}</p>
            </div>
            <BiCommentDetail className="bg-indigo-600 text-center text-5xl p-2 rounded-full text-white shadow-lg" />
          </div>
          <div className="flex gap-2">
            <span className="flex text-green-500 items-center font-medium">
              <HiArrowNarrowUp />
              {lastMonthComments}
            </span>
            <div className="text-gray-500">Last month</div>
          </div>
        </div>
        {/* posts */}
        <div className="flex flex-col dark:bg-slate-800 gap-4 p-3 w-full md:w-72 rounded-md shadow-md">
          <div className="flex justify-between">
            <div>
              <h3 className="text-xl font-medium text-gray-500 uppercase">
                Total posts
              </h3>
              <p className="text-2xl">{numberOfPosts}</p>
            </div>
            <HiDocumentText className="bg-lime-600 text-5xl p-2 rounded-full text-white shadow-lg" />
          </div>
          <div className="flex gap-2">
            <span className="flex text-green-500 items-center font-medium">
              <HiArrowNarrowUp />
              {lastMonthPosts}
            </span>
            <div className="text-gray-500">Last month</div>
          </div>
        </div>
      </div>

      {/* tables section */}

      <div className="flex flex-wrap gap-4 p-3 mx-auto justify-center">
        {/* user table */}
        <div className="w-full flex flex-col md:w-auto shadow-md p-2 rounded-md dark:bg-slate-800">
          <div className="flex justify-between items-center p-3 font-semibold">
            <h1 className="text-[1.1rem]">Recent users</h1>
            <Button gradientDuoTone={"purpleToPink"} outline>
              <Link to={`/dashboard?tab=users`}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <TableHead>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
            </TableHead>
            <TableBody className="divide-y">
              {users.length > 0 &&
                users.map((user) => (
                  <Table.Row
                    key={user._id}
                    className="bg-white dark:border-gray-800 dark:bg-slate-700"
                  >
                    <Table.Cell>
                      <img
                        src={user.profilePicture}
                        alt="userImg"
                        className="w-10 h-10 rounded-full bg-gray-400"
                      />
                    </Table.Cell>
                    <Table.Cell>{user.username}</Table.Cell>
                  </Table.Row>
                ))}
            </TableBody>
          </Table>
        </div>
        {/* comments table */}
        <div className="w-full flex flex-col md:w-auto shadow-md p-2 rounded-md dark:bg-slate-800">
          <div className="flex justify-between items-center p-3 font-semibold">
            <h1 className="text-[1.1rem]">Recent comments</h1>
            <Button gradientDuoTone={"purpleToPink"} outline>
              <Link to={`/dashboard?tab=comments`}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <TableHead>
              <Table.HeadCell>Comment content</Table.HeadCell>
              <Table.HeadCell>Number of likes</Table.HeadCell>
            </TableHead>
            <TableBody className="divide-y">
              {comments.length > 0 &&
                comments.map((comment) => (
                  <Table.Row
                    key={comment._id}
                    className="bg-white dark:border-gray-800 dark:bg-slate-700"
                  >
                    <Table.Cell className="w-96">
                      <p className="line-clamp-2">{comment.content}</p>
                    </Table.Cell>
                    <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                  </Table.Row>
                ))}
            </TableBody>
          </Table>
        </div>
        {/* post table */}
        <div className="w-full flex flex-col md:w-auto shadow-md p-2 rounded-md dark:bg-slate-800">
          <div className="flex justify-between items-center p-3 font-semibold">
            <h1 className="text-[1.1rem]">Recent posts</h1>
            <Button gradientDuoTone={"purpleToPink"} outline>
              <Link to={`/dashboard?tab=posts`}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <TableHead>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
            </TableHead>
            <TableBody className="divide-y">
              {posts.length > 0 &&
                posts.map((post) => (
                  <Table.Row
                    key={post._id}
                    className="bg-white dark:border-gray-800 dark:bg-slate-700"
                  >
                    <Table.Cell>
                      <img
                        src={post.image}
                        alt="userImg"
                        className="w-14 h-10 rounded-md bg-gray-400 object-cover"
                      />
                    </Table.Cell>
                    <Table.Cell className="font-medium w-96">
                      {post.title}
                    </Table.Cell>
                    <Table.Cell>{post.category}</Table.Cell>
                  </Table.Row>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default DashBoardComponent;
