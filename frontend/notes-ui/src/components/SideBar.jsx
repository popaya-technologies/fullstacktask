import React from "react";
import { Link, useLocation } from "react-router-dom";
import { StickyNote, FolderOpen, Star, Layers } from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { label: "Notes Workspace", icon: StickyNote, to: "/" },
    { label: "Archived Folders", icon: FolderOpen, to: "/archived" },
    { label: "Starred Snippets", icon: Star, to: "/starred" },
  ];

  return (
    <aside className="w-64 bg-kaiDark text-gray-400 fixed inset-y-0 left-0 z-40 hidden md:block border-r border-gray-800">
      <div className="h-16 flex items-center justify-between px-6 border-b border-gray-800 bg-kaiDark">
        <div className="text-white text-lg font-bold tracking-wide flex items-center gap-3 select-none">
          <Layers className="text-kaiPrimary w-6 h-6 animate-pulse" />
          <span>
            NOTIFY <span className="font-light text-gray-500 text-sm ml-0.5"></span>
          </span>
        </div>
      </div>

      <div className="py-6 px-4 overflow-y-auto h-[calc(100vh-4rem)]">
        <ul className="space-y-1.5">
          {menuItems.map((item, idx) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.to;

            return (
              <li key={idx}>
                <Link
                  to={item.to}
                  className={`flex items-center space-x-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 text-left group cursor-pointer focus:outline-none ${
                    isActive
                      ? "bg-kaiPrimary text-white shadow-md"
                      : "hover:bg-white/5 hover:text-gray-200"
                  }`}
                >
                  <IconComponent 
                    className={`w-5 h-5 transition-colors ${
                      isActive ? "text-white" : "text-gray-500 group-hover:text-kaiPrimary"
                    }`} 
                  />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}