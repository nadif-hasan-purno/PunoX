"use client";
import { IconMenu2 } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const Navbar = () => {
  const links = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Contact", href: "/contact" },
  ];

  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <div
        className="flex relative md:rounded-full justify-between items-center md:mt-4 max-w-4xl mx-72
    border border-neutral-200 px-2 py-2 md:shadow-legit bg-white"
      >
        <Image
          src="/pno.png"
          alt="Logo"
          width={50}
          height={50}
          className="h-10 w-12"
        />

        <div className="hidden md:flex items-center gap-4 text-sm text-neutral-500 mr-10">
          {links.map((link, index) => (
            <Link
              className="hover:text-neutral-900"
              href={link.href}
              key={index}
            >
              {link.name}
            </Link>
          ))}
        </div>
        <button onClick={() => setOpen(!open)} className="md:hidden">
          <IconMenu2 />
        </button>
        {open && (
          <div className="absolute md:hidden inset-x-0 bg-white rounded-md shadow-legit top-15  max-w-[90%] mx-auto">
            <div className="flex flex-col items-center gap-4 text-sm text-neutral-500 p-4">
              {links.map((link, index) => (
                <Link
                  className="hover:text-neutral-900"
                  href={link.href}
                  key={index}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
