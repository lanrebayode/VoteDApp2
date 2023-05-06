import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import Style from "./NavBar.module.css";
import logo from "../../public/logo.png";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { BiMenu } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";

const NavBar = () => {
  const [sideBar, setSideBar] = useState(false);

  const openSideBar = () => {
    if (!sideBar) {
      setSideBar(true);
    } else {
      setSideBar(false);
    }
  };

  return (
    <div className={Style.NavBar}>
      <div className={Style.NavBar_box}>
        <div className={Style.NavBar_box_logo}>
          <Image
            className={Style.NavBar_box_logo_img}
            src={logo}
            alt="logo"
            width={50}
            height={50}
          />
          <h1>Voterz</h1>
        </div>

        <div className={Style.NavBar_box_connection}>
          <>
            {/* <button className={Style.NavBar_box_connection_btn}>
              Connect Wallet
            </button> */}
            <ConnectButton
              showBalance={{
                smallScreen: false,
                largeScreen: true,
              }}
              accountStatus={{
                smallScreen: "avatar",
                largeScreen: "full",
              }}
            />
          </>
        </div>

        <div className={Style.NavBar_box_nav}>
          <Link href={{ pathname: "initiate" }}>
            {" "}
            <p>Initiate</p>
          </Link>
          <Link href={{ pathname: "candidateInput" }}>
            {" "}
            <p>Add</p>
          </Link>
          <Link href={{ pathname: "vote" }}>
            {" "}
            <p>Vote</p>
          </Link>
          <Link href={{ pathname: "view" }}>
            <p>View</p>
          </Link>
        </div>

        {sideBar ? (
          <div className={Style.NavBar_box_sideBar}>
            <AiOutlineClose
              className={Style.NavBar_box_sideBar_menuIcon}
              onClick={() => openSideBar()}
            />
            <div className={Style.NavBar_box_sideBar_header}>
              <Image
                className={Style.NavBar_box_logo_img}
                src={logo}
                alt="logo"
                width={50}
                height={50}
              />
              <h3>Voterz</h3>
            </div>
            <div className={Style.NavBar_box_sideBar_nav}>
              <Link href={{ pathname: "initiate" }}>
                {" "}
                <p>Initiate</p>
              </Link>
              <Link href={{ pathname: "vote" }}>
                {" "}
                <p>Vote</p>
              </Link>
              <Link href={{ pathname: "view" }}>
                <p>View</p>
              </Link>
            </div>
          </div>
        ) : (
          <BiMenu
            className={Style.NavBar_box_menuIcon}
            onClick={() => openSideBar()}
          />
        )}
      </div>
    </div>
  );
};

export default NavBar;
