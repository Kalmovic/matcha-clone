"use client";
import { Bitcoin } from "lucide-react";
import React from "react";
import { ConnectKitButton } from "connectkit";

export default function NavBar() {
  return (
    <nav
      className="flex items-center justify-between px-8 py-2 shadow-sm"
      role="navigation"
    >
      <div className="flex items-center space-x-2 cursor-pointer">
        <Bitcoin />
        <h1 className="text-lg font-medium">matcha clone</h1>
      </div>
      <ConnectKitButton theme="soft" />
    </nav>
  );
}
