"use client";

import Image from "next/image";
import bgImage from "@public/login_pic.webp";
import logo from "@public/WHITELOGOTEXT_AICAD.svg";
import logo1 from "@public/WHITEICON_AICAD.svg";
import { signIn } from "next-auth/react";

export default function Home() {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <Image
        src={bgImage}
        layout="fill"
        objectFit="cover"
        alt="background-image"
      />
      <div className="fixed bg-accent/50 flex w-full h-full items-center justify-center">
        <section className="flex flex-row ">
          <Image
            src={logo}
            className="bg-secondary-darker px-5 hidden lg:block lg:w-[320px] 2xl:w-[360px]"
            alt="logo"
          />
          <Image
            src={logo1}
            className="bg-secondary-darker px-5 w-[120px] sm:w-[140px] lg:hidden"
            alt="logo"
          />
          <div className="bg-accent pr-5 sm:pr-16 lg:pr-24 xl:pr-40 3xl:pr-60 pl-7 lg:pl-10 py-7 lg:py-10">
            <h1 className="font-arima text-secondary-dark text-2xl md:text-3xl lg:text-4xl 2xl:text-5xl font-bold">
              Discover. Access. Cite
            </h1>
            <p className=" text-white text-sm md:text-base lg:text-xl xl:text-[22px] 2xl:text-2xl mt-2 ">
              Your gateway to student academic excellence
            </p>
            <button
              className="flex cursor-pointer bg-white gap-2 lg:gap-5 mt-5 lg:mt-8 py-1.5 pl-2 pr-4 items-center"
              onClick={() =>
                signIn("google", { callbackUrl: "/search-engine" })
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                className="size-5 xl:size-6 3xl:size-7"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
                <path
                  fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                ></path>
                <path
                  fill="#4CAF50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                ></path>
                <path
                  fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
              </svg>
              <span className="text-xs md:text-sm xl:text-base 3xl:text-lg font-medium">
                Sign in with Google
              </span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
