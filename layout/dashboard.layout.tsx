"use client";

import "@/app/globals.css";

import React, { ReactNode } from "react";
import Link from "next/link";
import DefaultLayout from "./default.layout";
import {
  FaHome,
  FaPlus,
  FaBlog,
  FaUser,
  FaDatabase,
  FaFish,
  FaJava,
} from "react-icons/fa";
import { useCheckAndAddUser } from "@/hooks/user/useCheckAndAddUser";

const sidebarItems = [
  {
    name: "Home",
    href: "/dashboard",
    icon: <FaHome />,
    description: "Dashboard overview",
  },
  {
    name: "Create",
    href: "/dashboard/create",
    icon: <FaPlus />,
    description: "Create new content",
  },
  {
    name: "My Blogs",
    href: "/dashboard/my-blogs",
    icon: <FaBlog />,
    description: "View your blogs",
  },
  {
    name: "Profile",
    href: "/dashboard/profile",
    icon: <FaUser />,
    description: "Edit your profile",
  },
  {
    name: "Roles",
    href: "/dashboard/role",
    icon: <FaJava />,
    description: "Edit your roles",
  },
  {
    name: "Schemas",
    href: "/dashboard/schemas",
    icon: <FaDatabase />,
    description: "View Schemas",
  },
  {
    name: "Hooks",
    href: "/dashboard/hooks",
    icon: <FaFish />,
    description: "View Hooks",
  },
];

export default function DashboardLayout({
  children,
}: {
  children?: ReactNode;
}) {
  useCheckAndAddUser();

  return (
    <DefaultLayout>
      <div className="flex flex-col sm:flex-row">
        <div className="md:min-h-screen w-full sm:flex flex-col bg-muted-foreground hidden">
          {sidebarItems.map((item, index) => (
            <Link
              className="flex items-center justify-start border-b p-4 cursor-pointer transition-all bg-red-100"
              key={index}
              href={item.href}
            >
              <div className="flex items-center space-x-2 gap-4 hover:opacity-50">
                {item.icon}
                <div className="flex flex-col">
                  <span className="font-bold">{item.name}</span>
                  <span className="text-sm text-gray-500">
                    {item.description}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="bg-muted mx-auto sm:py-12 min-h-screen w-full">
          {children}
        </div>
      </div>
    </DefaultLayout>
  );
}
