import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSideBar from "../components/DashSideBar";
import DashProfile from "../components/DashProfile";
import DashPosts from "../components/DashPosts";
import DashUsers from "../components/DashUsers";
import DashComments from "../components/DashComments";
import { useSelector } from "react-redux";

const DashBoard = () => {
  const location = useLocation();
  //return the objects that contains path and search value;

  const [tab, setTab] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromURL = urlParams.get("tab"); //return value of tab;
    if (tabFromURL) {
      setTab(tabFromURL);
    }
  }, [location.search]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* DashBoard side bar */}
      <div className="md:w-56">
        <DashSideBar />
      </div>
      {/* DashBoard profile */}
      {tab === "profile" && <DashProfile />}

      {currentUser &&
        currentUser.isAdmin &&
        ((tab === "posts" && <DashPosts />) ||
          (tab === "users" && <DashUsers />) ||
          (tab === "comments" && <DashComments />))}
    </div>
  );
};

export default DashBoard;
