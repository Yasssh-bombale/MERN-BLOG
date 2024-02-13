import { Button, Select, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sideBarData, setSideBarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "uncategorized",
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const urlSearchTerm = urlParams.get("searchTerm");
    const urlSort = urlParams.get("order");
    const urlCategory = urlParams.get("category");

    if (urlSearchTerm || urlSort || urlCategory) {
      setSideBarData({
        ...sideBarData,
        searchTerm: urlSearchTerm,
        sort: urlSort,
        category: urlCategory,
      });
    }

    const fetchPosts = async () => {
      try {
        setLoading(true);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/post/getposts?${searchQuery}`);
        if (!res.ok) {
          setLoading(false);
          return;
        } else {
          const data = await res.json();
          setLoading(false);
          setPosts(data.posts);
          if (data.posts.length === 9) {
            setShowMore(true);
          } else {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === "search") {
      setSideBarData({ ...sideBarData, searchTerm: e.target.value });
    }
    if (e.target.id === "sort") {
      const sortOrder = e.target.value || "desc";
      setSideBarData({ ...sideBarData, sort: sortOrder });
    }
    if (e.target.id === "category") {
      const category = e.target.value || "uncategorized";
      setSideBarData({ ...sideBarData, category });
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", sideBarData.searchTerm);
    urlParams.set("order", sideBarData.sort);
    urlParams.set("category", sideBarData.category);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const showMoreClickHandler = async () => {
    try {
      const startIndex = posts.length;
      const urlParams = new URLSearchParams(location.search);
      urlParams.set("startIndex", startIndex);
      const searchQuery = urlParams.toString();

      const res = await fetch(`/api/post/getposts?${searchQuery}`);

      if (!res.ok) {
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setPosts([...posts, ...data.posts]);
        if (data.posts.length === 9) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* sidebar */}
      <div className="p-7 border-b border-gray-300 dark:border-gray-500 md:border-r md:min-h-screen">
        <form className="flex flex-col gap-7" onSubmit={submitHandler}>
          <div className="flex  items-center gap-3">
            <label className="whitespace-nowrap font-medium">
              Search Term:
            </label>
            <TextInput
              placeholder="Search..."
              id="search"
              type="text"
              value={sideBarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="font-medium">Sort:</label>
            <Select onChange={handleChange} id="sort" value={sideBarData.sort}>
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>
          <div className="flex items-center gap-3">
            <label className="font-medium">Sort:</label>
            <Select
              value={sideBarData.category}
              onChange={handleChange}
              id="category"
            >
              <option value="uncategorized">Uncategorized</option>
              <option value="javascript">Javascript.js</option>
              <option value="reactjs">React.js</option>
              <option value="nextjs">Next.js</option>
              <option value="nodejs">Node.js</option>
            </Select>
          </div>
          <Button type="submit" gradientDuoTone={"purpleToPink"} outline>
            Apply filters
          </Button>
        </form>
      </div>
      {/* right part */}
      <div className="w-full p-3">
        <h1 className="text-3xl font-semibold sm:border-b-2 border-gray-300 dark:border-gray-500 p-3">
          Posts results:
        </h1>
        <div className="flex flex-wrap p-7 gap-4 sm:gap-7 justify-center">
          {!loading && posts.length === 0 && (
            <p className="text-xl text-gray-500">No posts found.</p>
          )}
          {loading && <p className="text-xl text-gray-500">Loading...</p>}
          {!loading &&
            posts.length > 0 &&
            posts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
        {showMore && (
          <div className="w-full flex">
            <button
              onClick={showMoreClickHandler}
              className="font-medium    text-teal-500 hover:underline mx-auto"
            >
              Show more
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
