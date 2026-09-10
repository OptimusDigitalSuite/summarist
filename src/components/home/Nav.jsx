"use client";

import Image from "next/image";
import { useDispatch } from "react-redux";
import { openLogin } from "@/redux/modalSlice";

export default function Nav() {
  const dispatch = useDispatch();

  return (
    <nav className="nav">
      <div className="nav__wrapper">
        <figure className="nav__img--mask">
          <Image className="nav__img" src="/assets/logo.png" alt="logo" width={200} height={40} style={{ width: "auto", height: "40px" }} priority />
        </figure>
        <ul className="nav__list--wrapper">
          <li className="nav__list nav__list--login" onClick={() => dispatch(openLogin())}>
            Login
          </li>
          <li className="nav__list nav__list--mobile">About</li>
          <li className="nav__list nav__list--mobile">Contact</li>
          <li className="nav__list nav__list--mobile">Help</li>
        </ul>
      </div>
    </nav>
  );
}
