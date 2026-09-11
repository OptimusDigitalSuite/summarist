"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import {
  AiOutlineHome,
  AiOutlineBook,
  AiOutlineFileText,
  AiOutlineSearch,
} from "react-icons/ai";
import { HiOutlineCog, HiOutlineLogout, HiOutlineLogin } from "react-icons/hi";
import { RiQuestionMark, RiVipCrownLine } from "react-icons/ri";
import { getFirebaseAuth } from "@/lib/firebase";
import { openLogin } from "@/redux/modalSlice";
import { selectIsSignedIn, selectIsSubscribed } from "@/redux/userSlice";

// Seven items, per the documentation: For you, Library, Highlights, Search,
// Settings, Help & Support, then Login/Logout pinned to the bottom.
// Highlights, Search and Help & Support are deliberately inert — cursor
// not-allowed, no navigation.
const TOP = [
  { label: "For you", href: "/for-you", icon: <AiOutlineHome /> },
  { label: "My Library", href: "/library", icon: <AiOutlineBook /> },
  { label: "Highlights", icon: <AiOutlineFileText />, disabled: true },
  { label: "Search", icon: <AiOutlineSearch />, disabled: true },
];

const BOTTOM = [
  { label: "Settings", href: "/settings", icon: <HiOutlineCog /> },
  { label: "Help & Support", icon: <RiQuestionMark />, disabled: true },
];

export default function Sidebar({ open = false, onNavigate }) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();
  const signedIn = useSelector(selectIsSignedIn);
  const subscribed = useSelector(selectIsSubscribed);

  const onAuthClick = async () => {
    onNavigate?.();
    if (!signedIn) {
      dispatch(openLogin());
      return;
    }
    await signOut(getFirebaseAuth());
    router.push("/");
  };

  return (
    <div className={`sidebar${open ? " sidebar--open" : ""}`}>
      <figure className="sidebar__logo">
        <Image src="/assets/logo.png" alt="Summarist" width={160} height={32} />
      </figure>

      <div className="sidebar__wrapper">
        <div className="sidebar__top">
          {TOP.map((item) => (
            <Item key={item.label} item={item} pathname={pathname} onNavigate={onNavigate} />
          ))}

          {/* Someone already paying has nothing to buy, so the plans link is
              only here for everyone else — including guests, who need a way to
              reach pricing without hunting for a premium book first. */}
          {!subscribed && (
            <Link
              href="/choose-plan"
              className={`sidebar__link--wrapper sidebar__link--cta${
                pathname === "/choose-plan" ? " sidebar__link--active" : ""
              }`}
              onClick={onNavigate}
            >
              <div className="sidebar__link--line" />
              <div className="sidebar__icon--wrapper">
                <RiVipCrownLine />
              </div>
              <div className="sidebar__link--text">Join Summarist</div>
            </Link>
          )}
        </div>

        <div className="sidebar__bottom">
          {BOTTOM.map((item) => (
            <Item key={item.label} item={item} pathname={pathname} onNavigate={onNavigate} />
          ))}

          <button type="button" className="sidebar__link--wrapper" onClick={onAuthClick}>
            <div className="sidebar__link--line" />
            <div className="sidebar__icon--wrapper">
              {signedIn ? <HiOutlineLogout /> : <HiOutlineLogin />}
            </div>
            <div className="sidebar__link--text">{signedIn ? "Logout" : "Login"}</div>
          </button>
        </div>
      </div>
    </div>
  );
}

function Item({ item, pathname, onNavigate }) {
  const active = item.href && pathname === item.href;

  if (item.disabled) {
    return (
      <div className="sidebar__link--wrapper sidebar__link--not-allowed">
        <div className="sidebar__link--line" />
        <div className="sidebar__icon--wrapper">{item.icon}</div>
        <div className="sidebar__link--text">{item.label}</div>
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className={`sidebar__link--wrapper${active ? " sidebar__link--active" : ""}`}
      onClick={onNavigate}
    >
      <div className="sidebar__link--line" />
      <div className="sidebar__icon--wrapper">{item.icon}</div>
      <div className="sidebar__link--text">{item.label}</div>
    </Link>
  );
}
