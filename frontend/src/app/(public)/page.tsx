"use client";

import Image from "next/image";
import bgImage from "@public/login_pic.webp";
import logo from "@public/WHITELOGOTEXT_AICAD.svg";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <Image
        src={bgImage}
        layout="fill"
        objectFit="cover"
        alt="background-image"
      />
      <div className="fixed bg-accent/50 flex w-screen h-screen ">
        <section className="flex sm:absolute sm:flex-row sm:right-0 sm:bottom-1/4 ">
          <Image
            src={logo}
            className="bg-secondary-darker px-5 pb-3 w-[240px] lg:w-[320px] 2xl:w-[360px]"
            alt="logo"
          />
          <div className="bg-accent pr-16 lg:pr-24 xl:pr-40 3xl:pr-60 pl-7 lg:pl-10 py-7 lg:py-10">
            <h1 className="font-arima text-secondary-dark text-2xl md:text-3xl lg:text-4xl 2xl:text-5xl font-bold">
              Discover. Access. Cite
            </h1>
            <p className=" text-white text-sm md:text-base lg:text-xl xl:text-[22px] 2xl:text-2xl mt-2 ">
              Your gateway to student academic excellence
            </p>
            <button
              onClick={() => signIn("google", { callbackUrl: "/search-engine" })}
              className="flex cursor-pointer bg-white gap-3 lg:gap-5 mt-5 lg:mt-8 py-1.5 pl-2 pr-6 items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-4 md:size-5 xl:size-6 3xl:size-7"
                viewBox="0 0 48 48"
              >
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
