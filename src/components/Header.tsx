"use client";

import Link from "next/link";
import { type FC } from "react";

export const Header: FC = () => {
  return (
    <div className="flex items-center justify-center px-16 pt-4 text-white">
      <Link href="/" className="text-3xl font-bold">
        NeynarClient
      </Link>
    </div>
  );
};
