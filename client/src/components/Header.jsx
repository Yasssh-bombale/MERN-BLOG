import React from "react";
import { Button, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { BsFillMoonStarsFill } from "react-icons/bs";
const Header = () => {
  const path = useLocation().pathname;
  return (
    <Navbar className="border-b-2 ">
      <Link
        to={"/"}
        className="whitespace-nowrap self-center text-sm sm:text-lg font-semibold dark:text-white"
      >
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 to-pink-500  text-white rounded-md">
          Yassshu's
        </span>
        Blog
      </Link>

      <form>
        <TextInput
          type="text"
          placeholder="search..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
        />
        <Button color="gray" className="w-12 h-10 lg:hidden" pill>
          <AiOutlineSearch className="text-xl" />
        </Button>
      </form>
      <div className="flex gap-4 md:order-2">
        <Button color="gray" className="w-15 h-10 hidden sm:inline" pill>
          <BsFillMoonStarsFill />
        </Button>
        <Link to={"/sign-in"}>
          <Button gradientDuoTone={"purpleToPink"} outline>
            Sign In
          </Button>
        </Link>
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
        <Navbar.Link active={path === "/projects"} as={"div"}>
          <Link to={"/projects"}>Projects</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
