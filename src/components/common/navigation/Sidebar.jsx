"use client";
import React, { useEffect, useState } from "react";
import { MdOutlineCancel } from "react-icons/md";
import { FiLogOut, FiSettings } from "react-icons/fi";
import { patient, doctor } from "../../../../links";
import Link from "next/link";
import { useStateContext } from "@/state/AppContext";
import { usePathname, useRouter } from "next/navigation";
const Sidebar = () => {
  let {
    activeMenu,
    setActiveMenu,
    screenSize,
    openLogoutModal,
    setOpenLogoutModal,
    myDid,
    userRole,
  } = useStateContext();
  const router = useRouter();
  const pathname = usePathname();
  const [showSettings, setShowSettings] = useState(false);
  const [storedRole, setStoredRole] = useState("");
  const [links, setLinks] = useState([]);
  // console.log(userRole);
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setStoredRole(storedRole);
    if (storedRole === "patient") {
      setLinks(patient);
    } else {
      setLinks(doctor);
    }
  }, []);
  const handleCloseSidebar = () => {
    if (activeMenu && screenSize <= 900) {
      setActiveMenu(false);
    }
  };
  const handleShowModal = () => {
    console.log("clicked =>", openLogoutModal);
    setOpenLogoutModal(true);
  };
  const activeLink =
    "flex items-center gap-5 p-3 rounded-lg bg-[#145AE2] text-white font-[500] leading-[1.5rem] text-[1rem] m-2";
  const normalLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-black font-[400] text-[1rem] dark:text-gray-[#151515] dark:hover:text-slate-600 hover:bg-light-gray m-2";

  return (
    <div
      className={`h-screen  flex flex-col justify-between overflow-y-auto md:overflow-x-hidden px-[2rem] md:hover:overflow-y-auto py-[1.5rem] pb-[10px] w-full  shadow-sm `}
      style={{ boxShadow: "4px 4px 24px 0px rgba(206, 206, 206, 0.24)" }}
    >
      {/* <LogoutModal /> */}
      <div className="">
        {activeMenu && (
          <>
            <div className="flex justify-between items-center">
              <Link
                href="#"
                onClick={handleCloseSidebar}
                className="items-center gap-3 ml-3 mt-4 flex text-xl font-extrabold tracking-tight dark:text-white"
              >
                <p className="text-[1.25rem] font-[400] leading-normal uppercase p-0 mt-[-5px] text-primaryBlue">
                  AFIP MedLog
                </p>
              </Link>
              <button
                type="button"
                onClick={() => setActiveMenu((prevState) => !prevState)}
                className="text-xl rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden"
              >
                <MdOutlineCancel />
              </button>
            </div>
            <div className="mt-5 w-[240px]">
              {links.map((item) => (
                <div key={item.title}>
                  {/* <p className="text-gray-400 m-3 mt-4 uppercase">{item.title}</p> */}

                  {item.links.map((link) => {
                    return (
                      <Link
                        href={`/${storedRole}/${link.address}`}
                        key={link.address}
                        onClick={handleCloseSidebar}
                        className={
                          pathname.includes(link.address)
                            ? activeLink
                            : normalLink
                        }
                      >
                        {link.icon}
                        <span className="capitalize font-space font-[500] text-[14px] ">
                          {/* {link.name == '/' ? 'overview' : link.name} */}
                          {link.name}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="  flex items-end">
        <div className="">
          <Link
            href={`/${storedRole}/settings`}
            onClick={handleCloseSidebar}
            className={pathname.includes("settings") ? activeLink : normalLink}
          >
            <FiSettings />
            <span className="capitalize font-space font-[500] text-[14px] ">
              {/* {link.name == '/' ? 'overview' : link.name} */}
              Settings
            </span>
          </Link>
          {/* <button
            onClick={() => {
              handleShowModal();
              handleCloseSidebar();
            }}
            className={`${
              pathname.includes("settings") ? activeLink : normalLink
            } w-full justify-self-end`}
          >
            <FiSettings />
            <span className="capitalize">Settings</span>
          </button> */}
          {/* <button
            onClick={() => {
              handleShowModal();
              handleCloseSidebar();
            }}
            className={`${
              pathname.includes("login") ? activeLink : normalLink
            } w-full justify-self-end`}
          >
            <FiLogOut />
            <span className="capitalize">logout</span>
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
