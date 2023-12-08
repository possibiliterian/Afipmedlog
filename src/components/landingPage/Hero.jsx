import React from "react";
import Image from "next/image";
import HeroImageText from "./HeroImageText";
import Link from "next/link";

const Hero = () => {
  return (
    <div>
      <div className="w-[31.5625rem]">
        <h2 className="text-[2.5rem] font-medium">
          Be in Charge of Your Medical Records
        </h2>
        <p className="my-[2rem] text-[#5F5F5F]">
          You can be in charge of your medical records and grant access to any
          doctor of your choice in any part of the world for reference purposes
        </p>
        <Link
          href={"/already-have-account"}
          className="w-[11.875rem] py-[0.5rem] px-[1rem] rounded-[0.25rem] bg-primaryBlue text-white flex justify-center items-center font-[500] leading-6 tracking-[0.02rem "
        >
          Get started
        </Link>
      </div>
      <div>
        <div className="w-[28.625rem]  pt-[2rem] px-[4.0625rem] bg-[#DCE6FB] rounded-[0.75rem] ">
          <Image
            src="/images/HeroImage.png"
            alt="hero image"
            width={328}
            height={416}
            className=" w-[20.5rem] h-[26rem]"
          />
        </div>
        <div>
          <HeroImageText text="Decentralized Identity Management" />
          <HeroImageText text="Decentralized Identifier DID" />
          <HeroImageText text="Access to Medical Doctors Around the Globe" />
          <HeroImageText text="Decentralized Data Storage and Sharing" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
