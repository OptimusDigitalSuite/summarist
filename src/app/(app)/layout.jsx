import "../app.css";
import AppShell from "@/components/app/AppShell";

// Route group for the signed-in app shell. The sidebar and search bar show on
// every page in here — which is exactly the set the documentation names: all
// pages except the home page and the sales page, both of which sit outside
// this group.
export default function AppLayout({ children }) {
  return <AppShell>{children}</AppShell>;
}
