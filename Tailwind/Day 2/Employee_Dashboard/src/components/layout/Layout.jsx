import { Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import BottomNav from "./BottomNav";
import NotificationPanel from "./NotificationPanel";
import ToastContainer from "../ui/ToastContainer";
import { setSidebarOpen, closeMobileMenu } from "../../store/slices/uiSlice";
import { setLoading } from "../../store/slices/employeeSlice";
import useMediaQuery from "../../hooks/useMediaQuery";

export default function Layout() {
  const dispatch = useDispatch();
  const { sidebarOpen, notificationOpen, mobileMenuOpen } = useSelector(
    (s) => s.ui,
  );
  const isMd = useMediaQuery("(min-width: 768px)");
  const isLg = useMediaQuery("(min-width: 1024px)");

  useEffect(() => {
    const timer = setTimeout(() => dispatch(setLoading(false)), 1500)
    return () => clearTimeout(timer)
  }, [dispatch])

  useEffect(() => {
    if (isLg) {
      dispatch(setSidebarOpen(true));
      dispatch(closeMobileMenu());
    } else if (!isMd) {
      dispatch(setSidebarOpen(false));
    }
  }, [isLg, isMd, dispatch]);

  return (
    <div className="flex h-screen overflow-hidden bg-surface-50 dark:bg-surface-950">
      <Sidebar />

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden animate-fade-in"
          onClick={() => dispatch(closeMobileMenu())}
        />
      )}

      <div
        className={`flex flex-col flex-1 min-w-0 transition-all duration-300 ${sidebarOpen && isLg ? "lg:ml-0" : ""}`}
      >
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
          <Outlet />
        </main>
      </div>

      <NotificationPanel />

      <BottomNav />

      <ToastContainer />
    </div>
  );
}