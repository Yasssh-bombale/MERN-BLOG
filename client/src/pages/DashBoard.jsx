import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSideBar from "../components/DashSideBar";
import DashProfile from "../components/DashProfile";

const DashBoard = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");
  //return the objects that contains path and searcg value;

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
    </div>
  );
};

export default DashBoard;
