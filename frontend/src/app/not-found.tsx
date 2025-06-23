'use client';

import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
    return(
        <div className=" flex items-center justify-center min-h-screen px-4 py-10 bg-white overflow-hidden">
      <div className=" text-center w-full max-w-[472px]">
        <h1 className="mb-6 font-bold text-2xl text-gray-900">
          ERROR
        </h1>

        <div className="relative mx-auto w-[300px] h-[200px] hidden dark:block">
          <Image
            src="/dark.svg"
            alt="404"
            fill
            className="object-contain"
          />
        </div>

        <p className="mt-10 mb-6 text-base text-gray-700 ">
          We can’t seem to find the page you are looking for!
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3.5 text-sm font-medium text-gray-700 shadow hover:bg-gray-50 hover:text-gray-800 transition"
        >
          Back to Home Page
        </Link>
      </div>
    </div>
    )
}