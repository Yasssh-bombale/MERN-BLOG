import React, { useEffect, useState } from "react";
import { Sidebar } from "flowbite-react";
import { HiUser } from "react-icons/hi";
import { PiSignOutBold } from "react-icons/pi";
import { Link, useLocation } from "react-router-dom";
const DashSideBar = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    setTab(tabFromUrl);
  }, [location.search]);
  return (
    <>
      <Sidebar className="w-full md:w-56">
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <Link to={"/dashboard?tab=profile"}>
              <Sidebar.Item
                active={tab === "profile"}
                icon={HiUser}
                label={"user"}
                labelColor={"dark"}
              >
                Profile
              </Sidebar.Item>
            </Link>
            <Sidebar.Item icon={PiSignOutBold} className={"cursor-pointer"}>
              Sign Out
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </>
  );
};

export default DashSideBar;
