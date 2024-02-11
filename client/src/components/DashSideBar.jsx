import React, { useEffect, useState } from "react";
import { Sidebar } from "flowbite-react";
import { HiChartPie, HiUser } from "react-icons/hi";
import { PiSignOutBold } from "react-icons/pi";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { signOutSuccess } from "../redux/user/user.slice";
import { useSelector } from "react-redux";
import { HiDocumentText } from "react-icons/hi";
import { HiMiniUserGroup } from "react-icons/hi2";
import { BiCommentDetail } from "react-icons/bi";
const DashSideBar = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    setTab(tabFromUrl);
  }, [location.search]);

  const signOutHandler = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess());
        toast.success(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <Sidebar className="w-full md:w-56">
        <Sidebar.Items>
          <Sidebar.ItemGroup className="flex flex-col gap-1">
            {currentUser && currentUser.isAdmin && (
              <Link to={"/dashboard?tab=dash"}>
                <Sidebar.Item
                  active={tab === "dash" || !tab}
                  icon={HiChartPie}
                  as="div"
                >
                  Dashboard
                </Sidebar.Item>
              </Link>
            )}
            <Link to={"/dashboard?tab=profile"}>
              <Sidebar.Item
                active={tab === "profile"}
                icon={HiUser}
                label={currentUser.isAdmin ? "Admin" : "user"}
                labelColor={currentUser.isAdmin ? "green" : "dark"}
                as="div"
              >
                Profile
              </Sidebar.Item>
            </Link>
            {currentUser.isAdmin && (
              <>
                <Link to={"/dashboard?tab=posts"}>
                  <Sidebar.Item
                    active={tab === "posts"}
                    icon={HiDocumentText}
                    as="div"
                  >
                    Posts
                  </Sidebar.Item>
                </Link>
                <Link to={"/dashboard?tab=users"}>
                  <Sidebar.Item
                    active={tab === "users"}
                    icon={HiMiniUserGroup}
                    as="div"
                  >
                    Users
                  </Sidebar.Item>
                </Link>
                <Link to={"/dashboard?tab=comments"}>
                  <Sidebar.Item
                    active={tab === "comments"}
                    icon={BiCommentDetail}
                    as="div"
                  >
                    Comments
                  </Sidebar.Item>
                </Link>
              </>
            )}

            <Sidebar.Item
              icon={PiSignOutBold}
              className={"cursor-pointer"}
              onClick={signOutHandler}
            >
              Sign Out
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </>
  );
};

export default DashSideBar;
