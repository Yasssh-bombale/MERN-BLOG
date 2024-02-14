import React, { useEffect, useState } from "react";
import { Button, Navbar, TextInput, Dropdown, Avatar } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { BsFillMoonStarsFill } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/theme.slice";
import { FiSun } from "react-icons/fi";
import { signOutSuccess } from "../redux/user/user.slice";
import toast from "react-hot-toast";

const Header = () => {
  const path = useLocation().pathname;
  const location = useLocation();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [searchTerm, setSearchTerm] = useState("");

  // implimenting search functionality;
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const urlSearchTerm = urlParams.get("searchTerm");

    if (urlSearchTerm) {
      setSearchTerm(urlSearchTerm);
    }
  }, [location.search]);

  const submitSearchHandler = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    const serachQuery = urlParams.toString();
    navigate(`/search?${serachQuery}`);
  };

  //signOut handler;
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
    <Navbar className="border-b-2">
      <Link
        to={"/"}
        className="whitespace-nowrap self-center text-sm sm:text-lg font-semibold dark:text-white"
      >
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 to-pink-500  text-white rounded-md">
          Yassshu's
        </span>
        Blog
      </Link>

      <form onSubmit={submitSearchHandler}>
        <TextInput
          type="text"
          placeholder="search..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button color="gray" className="w-12 h-10 lg:hidden" pill>
          <AiOutlineSearch className="text-xl" />
        </Button>
      </form>
      <div className="flex gap-4 md:order-2">
        <Button
          color="gray"
          className="w-15 h-10 inline"
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === "light" ? <BsFillMoonStarsFill /> : <FiSun />}
        </Button>

        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar rounded alt="user" img={currentUser.profilePicture} />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm ">@{currentUser.username}</span>
              <span className="block text-sm font-medium truncate mb-3">
                {currentUser.email}
              </span>
              <Link to={"/dashboard?tab=profile"}>
                <Dropdown.Item className="text-sm font-semibold">
                  Profile
                </Dropdown.Item>
              </Link>
              <Dropdown.Divider />
              <Dropdown.Item
                className="ext-sm font-semibold"
                onClick={signOutHandler}
              >
                Sign Out
              </Dropdown.Item>
            </Dropdown.Header>
          </Dropdown>
        ) : (
          <Link to={"/sign-in"}>
            <Button gradientDuoTone={"purpleToPink"} outline>
              Sign In
            </Button>
          </Link>
        )}

        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        {/* Note: Navbar.Link will give error in console because we are using two Link in each other that are not allowed hence we are converting Navbar.Link as={div} */}
        <Navbar.Link active={path === "/"} as={"div"}>
          <Link to={"/"}>Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link to={"/about"}>About</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
