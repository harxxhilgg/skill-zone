import React from "react";
import Logo from "../../assets/Logo/Logo-Full-Light.png";
import { Link } from "react-router-dom";
import { FooterLink2 } from "../../data/footer-links";
import { FaFacebook, FaGoogle, FaTwitter, FaYoutube } from "react-icons/fa";

const Resources = [
  "Articles",
  "Blog",
  "Chart Sheet",
  "Code challenges",
  "Docs",
  "Projects",
  "Videos",
  "Workspaces",
];

const Plans = ["Paid memberships", "For students", "Business solutions"];

const Community = ["Forums", "Chapters", "Events"];

const About = ["About", "Careers", "Affiliaters"];

const BottomFooter = ["Privacy Policy", "Cookie Policy", "Terms"];

const Footer = () => {
  return (
    <div className="bg-richblack-800">
      <div className=" lg:flex-row flex gap-8 items-center justify-between w-11/12 max-w-maxContent text-richblack-400 py-14 relative mx-auto leading-6">
        <div className="w-[100%] flex flex-col border-b border-richblack-700 lg:flex-row pb-5">
          {/* section - 1 */}
          <div className="lg:w-[50%] flex flex-row justify-between pl-3 gap-3 lg:border-r lg:border-richblack-700 lg:pr-5">
            <div className="w-[30%] lg:w-[30%] flex flex-col gap-3 mb-7 lg:pl-0">
              {/* //section - 1 first colum */}
              <img src={Logo} alt="" className="object-contain" />
              <h1 className="text-richblack-50 font-semibold text-[16px]">
                Company
              </h1>
              <div className="flex flex-col gap-2">
                {About.map((ele, i) => {
                  return (
                    <div
                      key={i}
                      className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                    >
                      <Link to={ele.toLowerCase()}>{ele}</Link>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-3 text-lg">
                <FaFacebook />
                <FaGoogle />
                <FaTwitter />
                <FaYoutube />
              </div>
            </div>
            {/* section - 1 second colum */}
            <div className="lg:w-[30%] lg:pl-0">
              <h1 className=" text-richblack-50 font-semibold text-[16px]">
                Resources
              </h1>
              <div className="flex flex-col gap-2 mt-2">
                {Resources.map((ele, index) => {
                  return (
                    <div
                      key={index}
                      className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                    >
                      <Link to={ele.split(" ").join("-").toLowerCase()}>
                        {ele}
                      </Link>
                    </div>
                  );
                })}
              </div>
              <h1 className="text-richblack-50 font-semibold text-[16px] mt-7">
                Support
              </h1>
              <div className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200 mt-2">
                <Link to={"/help-center"}>Help Center</Link>
              </div>
            </div>
            {/* section - 1 third colum  */}
            <div className="w-[48%] lg:w-[30%] mb-7 lg:pl-0">
              <h1 className="text-richblack-50 font-semibold text-[16px]">
                Plans
              </h1>

              <div className="flex flex-col gap-2 mt-2">
                {Plans.map((ele, index) => {
                  return (
                    <div
                      key={index}
                      className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                    >
                      <Link to={ele.split(" ").join("-").toLowerCase()}>
                        {ele}
                      </Link>
                    </div>
                  );
                })}
              </div>
              <h1 className="text-richblack-50 font-semibold text-[16px] mt-7">
                Community
              </h1>
              <div className="flex flex-col gap-2 mt-2">
                {Community.map((ele, index) => {
                  return (
                    <div
                      key={index}
                      className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                    >
                      <Link to={ele.split(" ").join("-").toLowerCase()}>
                        {ele}
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          {/* section - 2 */}
          <div className="lg:w-[50%] flex flex-row pl-3 lg:pl-5 gap-3 justify-between">
            {FooterLink2.map((ele, index) => {
              return (
                <div key={index} className="w-[48%] lg:w-[30%] mb-7 lg:pl-0">
                  <h1 className="text-richblack-50 font-semibold text-[16px]">
                    {ele.title}
                  </h1>
                  <div className="flex flex-col gap-2 mt-2">
                    {ele.links.map((link, i) => {
                      return (
                        <div
                          key={index}
                          className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                        >
                          <Link to={link.link}>{link.title}</Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center justify-between w-11/12 max-w-maxContent text-richblack-400 mx-auto pb-14 text-sm">
        <div className="flex lg:items-start items-center justify-between flex-col lg:flex-row gap-3 w-full">
          <div className="flex flex-row">
            {BottomFooter.map((ele, index) => {
              return (
                <div
                  key={index}
                  className={` ${
                    BottomFooter.length - 1 === index
                      ? ""
                      : "border-r border-richblack-700 cursor-pointer hover:text-richblack-50 transition-all duration-200"
                  } px-3 `}
                >
                  <Link to={ele.split(" ").join("-").toLocaleLowerCase()}>
                    {ele}
                  </Link>
                </div>
              );
            })}
          </div>
          <div className="text-center">
            Made with ❤️ © 2024 SkillZone
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
