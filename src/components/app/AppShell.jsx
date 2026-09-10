"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { HiMenu } from "react-icons/hi";
import Sidebar from "./Sidebar";
import Searchbar from "./Searchbar";

// Holds the one piece of shell state: whether the sidebar is showing on mobile.
// Local state rather than Redux — nothing outside the shell needs to read it.
export default function AppShell({ children }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="app">
      <Sidebar open={open} onNavigate={() => setOpen(false)} />

      {/* Tapping the dimmed page closes the drawer, the way every mobile nav
          behaves. Rendered only when open so it never eats clicks otherwise. */}
      {open && <div className="app__overlay" onClick={() => setOpen(false)} />}

      <div className="app__main">
        <div className="app__topbar">
          <button
            type="button"
            className="app__menu--btn"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <HiMenu />
          </button>
          <Searchbar key={pathname} />
        </div>
        <div className="app__content">{children}</div>
      </div>
    </div>
  );
}
