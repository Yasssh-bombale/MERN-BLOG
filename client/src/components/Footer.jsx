import React from "react";
import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import { BsGithub, BsInstagram, BsLinkedin, BsTwitter } from "react-icons/bs";
import b4 from "../img/b4.jpg";

const FooterComp = () => {
  return (
    <Footer container className="border border-t-8 border-teal-500">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid w-full justify-between sm:flex md:grid-cols-1">
          <div className="mt-5">
            {/* logo */}
            <Link
              to={"/"}
              className="whitespace-nowrap self-center text-lg sm:text-xl font-semibold dark:text-white"
            >
              {/* <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 to-pink-500  text-white rounded-md">
                Yassshu's
              </span>
              Blog */}
              <img
                src={b4}
                alt="logo"
                className="w-32 h-16 rounded-lg object-cover"
              />
            </Link>
          </div>
          {/* About followUs legeal */}
          <div className="grid grid-cols-2 gap-12 mt-4 sm:grid-cols-3 sm:gap-6">
            <div>
              <Footer.Title title="ABOUT" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://www.linkedin.com/in/yash-bombale-110226244"
                  target="_blank"
                  rel="noopener noreferer"
                >
                  Linkdein
                </Footer.Link>
              </Footer.LinkGroup>
              <Footer.LinkGroup col>
                <Footer.Link
                  href="/about"
                  target="_blank"
                  rel="noopener noreferer"
                >
                  Yassshu's blog
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="FOLLOW US" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://github.com/Yasssh-bombale"
                  target="_blank"
                  rel="noopener noreferer"
                >
                  Github
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="LEGAL" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Privacy Policy</Footer.Link>
              </Footer.LinkGroup>
              <Footer.LinkGroup col>
                <Footer.Link href="#">Terms &amp; Conditions</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        {/* copyrights and social media icons */}
        {/* copyright */}
        <div className="w-full flex flex-col  items-center sm:flex-row sm:flex  sm:justify-between ">
          <div>
            <Footer.Copyright
              href="#"
              by="Yassshu's Blog"
              year={new Date().getFullYear()}
            />
          </div>
          {/* icons */}
          <div className="flex gap-7 mt-2">
            <Footer.Icon
              href="https://github.com/Yasssh-bombale"
              target="_blank"
              icon={BsGithub}
            />
            <Footer.Icon
              href="https://instagram.com/yash_bombale_official"
              target="_blank"
              icon={BsInstagram}
            />
            <Footer.Icon
              href="https://www.linkedin.com/in/yash-bombale-110226244"
              target="_blank"
              icon={BsLinkedin}
            />
            <Footer.Icon href="#" icon={BsTwitter} />
          </div>
        </div>
      </div>
    </Footer>
  );
};

export default FooterComp;
