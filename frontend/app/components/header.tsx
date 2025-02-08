import React from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <div className="flex w-full h-[59px] bg-[#181818] shadow-md items-center justify-between px-4">
      <Link href="/">
        <div className="text-white font-normal text-lg select-none">Name</div>
      </Link>
      <Link href="/login">
        <div className="w-[92px] h-[40px] bg-lightBlue text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 select-none">
          Sign in
        </div>
      </Link>
    </div>
  );
}
