"use client";

import WalacorLogo from "@/assets/walacor-logo.png";
import Image from "next/image";
import { useAddUser } from "@/hooks/useAddUser";

export default function BaseAlert() {
  const { addUser } = useAddUser();

  return (
    <div className="bg-primary text-primary-foreground p-4 text-center text-xs flex items-center justify-center">
      <button onClick={addUser}>Create User</button>
      <span className="flex items-center gap-1">
        Welcome to Walacor! <Image width={25} src={WalacorLogo} alt={""} /> Here
        you can interface with our data platform via your blog posts, profile,
        and settings.
      </span>
    </div>
  );
}
