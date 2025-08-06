"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [showGasSubMenu, setShowGasSubMenu] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (
      pathname === "/dashboard-layout/Download" ||
      pathname === "/dashboard-layout/pm25" ||
      pathname.startsWith("/dashboard-layout/Ges/")
    ) {
      setShowSubMenu(true);
      if (pathname.startsWith("/dashboard-layout/Ges/")) {
        setShowGasSubMenu(true);
      } else {
        setShowGasSubMenu(false);
      }
    } else {
      setShowSubMenu(false);
      setShowGasSubMenu(false);
    }
  }, [pathname]);

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen">
      <aside
        className={`bg-gray-800 text-white p-6 fixed h-full transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "w-60" : "w-0"
        } ${!isSidebarOpen && "hidden"}`}
      >
        {isSidebarOpen && (
          <>
            <div className="flex items-center justify-between mb-10">
              <div className="text-2xl font-bold">ข้อมูลรายวัน</div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-white focus:outline-none ml-auto"
              >
                <FaTimes size={24} />
              </button>
            </div>

            <nav className="flex flex-col space-y-4">
              <Link
                href="/dashboard-layout/Home"
                className={`hover:text-blue-400 ${
                  pathname === "/dashboard-layout/Home" ? "text-blue-400 font-semibold" : ""
                }`}
              >
                หน้าหลัก
              </Link>

              <button
                onClick={() => setShowSubMenu((prev) => !prev)}
                className={`flex items-center justify-between w-full text-left hover:text-blue-400 ${
                  showSubMenu ? "text-blue-400 font-semibold" : ""
                }`}
              >
                ดูข้อมูลต่างๆ
                <span
                  className={`transform transition-transform duration-200 ${
                    showSubMenu ? "rotate-90" : ""
                  }`}
                >
                  &#9658;
                </span>
              </button>

              {showSubMenu && (
                <div className="ml-4 flex flex-col space-y-2 border-l border-gray-600 pl-4">
                  <Link
                    href="/dashboard-layout/Download"
                    className={`hover:text-blue-400 ${
                      pathname === "/dashboard-layout/Download" ? "text-blue-400 font-semibold" : ""
                    }`}
                  >
                    ข้อมูลปริมาณน้ำฝน
                  </Link>

                  <button
                    onClick={() => setShowGasSubMenu((prev) => !prev)}
                    className={`flex items-center justify-between w-full text-left hover:text-blue-400 ${
                      showGasSubMenu ? "text-blue-400 font-semibold" : ""
                    }`}
                  >
                    ข้อมูลแก๊ส
                    <span
                      className={`transform transition-transform duration-200 ${
                        showGasSubMenu ? "rotate-90" : ""
                      }`}
                    >
                      &#9658;
                    </span>
                  </button>

                  {showGasSubMenu && (
                    <div className="ml-4 flex flex-col space-y-2 border-l border-gray-700 pl-4">
                      <Link
                        href="/dashboard-layout/Ges/So2"
                        className={`hover:text-blue-400 ${
                          pathname === "/dashboard-layout/Ges/So2" ? "text-blue-400 font-semibold" : ""
                        }`}
                      >
                        แก๊ส So2
                      </Link>
                      <Link
                        href="/dashboard-layout/Ges/Choho"
                        className={`hover:text-blue-400 ${
                          pathname === "/dashboard-layout/Ges/Choho" ? "text-blue-400 font-semibold" : ""
                        }`}
                      >
                        แก๊ส Choho
                      </Link>
                      <Link
                        href="/dashboard-layout/Ges/No2"
                        className={`hover:text-blue-400 ${
                          pathname === "/dashboard-layout/Ges/No2" ? "text-blue-400 font-semibold" : ""
                        }`}
                      >
                        แก๊ส No2
                      </Link>
                    </div>
                  )}

                  <Link
                    href="/dashboard-layout/pm25"
                    className={`hover:text-blue-400 ${
                      pathname === "/dashboard-layout/pm25" ? "text-blue-400 font-semibold" : ""
                    }`}
                  >
                    ข้อมูล PM2.5
                  </Link>
                </div>
              )}

              <Link
                href="/dashboard-layout/About"
                className={`hover:text-blue-400 ${
                  pathname === "/dashboard-layout/About" ? "text-blue-400 font-semibold" : ""
                }`}
              >
                เกี่ยวกับเรา
              </Link>

              {/* <button
                onClick={handleLogout}
                className="mt-4 bg-red-600 text-white p-2 rounded hover:bg-red-700 transition-colors duration-200"
              >
                Logout
              </button> */}
            </nav>
          </>
        )}
      </aside>

      <main
        className={`flex-1 p-6 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-60" : "ml-0"
        }`}
      >
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="fixed top-6 left-6 text-gray-800 bg-gray-200 p-2 rounded-full shadow-md z-50 hover:bg-gray-300"
            title="Open Sidebar"
          >
            <FaBars size={24} />
          </button>
        )}

        {children}
      </main>
    </div>
  );
}
