'use client';
import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDownIcon, GridIcon, ListIcon, UserCircleIcon, EnvelopeIcon } from "../icons";

type NavItem = {
  name: string;
  path?: string;
  icon?: React.ReactNode;
  pro?: boolean;
  new?: boolean;
  subItems?: NavItem[];
};

// Menu items
const navItems: NavItem[] = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: <GridIcon />,
  },  
  {
    name: "Masters",
    icon: <ListIcon />,
    subItems: [
      {
        name: "Cab Types",
        path: "/admin/masters/cab-types",       
      },      
    ],
  },
  {
    name: "Users",
    icon: <UserCircleIcon />,
    subItems: [
      {
        name: "NDIS Users",
        path: "/admin/ndis-users",       
      },
      {
        name: "Business Users",
        path: "/admin/business-users",
       
      },
    ],
  },
  {
    name: "Legal Content",
    icon: <EnvelopeIcon />,
    subItems: [
      {
        name: "Terms & Conditions",
        // icon: <ListIcon />,
        path: "/admin/term-conditions",
        // subItems: [
        //   { name: "List", path: "/term-conditions" },
        //   { name: "Create", path: "/term-conditions/create" },
        // ],
      },
      {
        name: "Privacy Policy",
        //  icon: <ListIcon />,
        path: "/admin/privacy-policy",
        // subItems: [
        //   { name: "List", path: "/privacy-policy" },
        //   { name: "Create", path: "/privacy-policy/create" },
        // ],
      },
    ],
  },
  
];

const NavMenu: React.FC = () => {
  const pathname = usePathname();
  const isActive = useCallback((path?: string) => pathname === path, [pathname]);

  return (
    <nav className="flex gap-6 items-center relative">
      {navItems.map((item, index) => (
        <RecursiveMenuItem key={index} item={item} isActive={isActive} depth={0} />
      ))}
    </nav>
  );
};

export default NavMenu;

const RecursiveMenuItem: React.FC<{
  item: NavItem;
  isActive: (path?: string) => boolean;
  depth: number; // track depth
}> = ({ item, isActive, depth }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const toggle = () => setOpen((prev) => !prev);
  const hasChildren = item.subItems && item.subItems.length > 0;

  // Auto-open if any subitem is active
  useEffect(() => {
    if (item.subItems?.some((sub) => isActive(sub.path))) {
      setOpen(true);
    }
  }, [item.subItems, isActive]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Determine submenu position: first level => bottom, others => right
  const submenuPosition =
    depth === 0
      ? "absolute left-0 top-full mt-1" // below parent
      : "absolute top-0 left-full ml-1"; // right of parent

  return (
    <div ref={ref} className="relative group">
      {hasChildren ? (
        <>
          <button
            onClick={toggle}
            className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 ${
              open
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-700 dark:text-gray-300"
            }`}
          >
            {item.icon}
            {item.name}
            <ChevronDownIcon className="w-4 h-4" />
          </button>

          {/* Nested submenu */}
          <div
            className={`w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-50 ${
              open ? "block" : "hidden"
            } ${submenuPosition}`}
          >
            {item.subItems?.map((sub, i) => (
              <RecursiveMenuItem
                key={i}
                item={sub}
                isActive={isActive}
                depth={depth + 1}
              />
            ))}
          </div>
        </>
      ) : (
        <Link
          href={item.path || "#"}
          className={`flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
            isActive(item.path)
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-700 dark:text-gray-200"
          }`}
        >
          <span className="flex items-center gap-2">
            {item.icon}
            {item.name}
          </span>
          <span className="ml-auto flex gap-1">
            {item.new && (
              <span className="text-xs text-white bg-green-500 px-1.5 py-0.5 rounded">
                NEW
              </span>
            )}
            {item.pro && (
              <span className="text-xs text-white bg-purple-500 px-1.5 py-0.5 rounded">
                PRO
              </span>
            )}
          </span>
        </Link>
      )}
    </div>
  );
};
