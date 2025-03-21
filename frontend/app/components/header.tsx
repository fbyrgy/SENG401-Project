'use client'

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { isLoggedIn, logout } = useAuth();
  return (
    <div className="flex w-full h-[59px] bg-[#181818] shadow-md items-center justify-between px-4">
      <Link href="/">
        <div className="text-white font-normal text-lg select-none">BrokeNoMo</div>
      </Link>
      
        {isLoggedIn ? (
            <div
            className="w-[92px] h-[40px] bg-lightBlue text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 select-none"
            onClick={() => {
              logout();
            }}
            >
            Logout
            </div>
        ) : (
          <Link href="/login">
            <div className="w-[92px] h-[40px] bg-lightBlue text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 select-none">
              Sign in
            </div>
          </Link>
        )}
    </div>
  );
}
