"use client"
import React from 'react';
import Label from './Label';
import { Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { Flash } from 'iconsax-react';
import { CheckCircledIcon } from '@radix-ui/react-icons';


const Pricing: React.FC = () => {
  const router = useRouter();

  const handleCheckout = async (type: "trial" | "lifetime" | "yearly") => {
    localStorage.setItem("selectedPlan", type);
    router.push("/auth");
  }

  return (
    <section className='bg-black' id="pricing">
      <div className='py-24 px-8 max-w-5xl mx-auto'>
        <div className='flex flex-col text-center w-full mb-20'>
          <Label text="Pricing" />
          <h2 className="font-extrabold text-3xl lg:text-5xl tracking-tight mt-3 mb-8 max-w-2xl mx-auto">Become an Academic Weapon ⚔️</h2>
          <p className='text-sm md:text-base flex justify-center items-center gap-2 '>
            <span>
              Pick a&nbsp;
              <span className="text-lime-500">plan</span>&nbsp;that suits you and get access to the full package.
            </span>
          </p>
        </div>

        <div className="flex w-full justify-center my-10">
          <div className={`relative w-full rounded-xl border max-w-xl`} id="bonus">
            <div className='relative flex flex-col gap-5 lg:gap-8 z-10 p-8 rounded-lg'>
              <div className='flex flex-col items-center gap-4'>
                <p className="text-md lg:text-xl text-center font-semibold bg-color3 px-5 py-1">72 Hours <strong>Unlimited Access</strong> to StudyPhii</p>
              </div>
              <div className="flex flex-col gap-2 mb-1 mt-2">
                <p className="text-3xl md:text-5xl text-center tracking-tight font-extrabold">TRY FOR $0.99</p>
                <p className="flex gap-2 items-center justify-center text-lg md:text-xl text-center tracking-tight">
                  <Flash variant='Bold' />
                  Offer valid until <strong>May 10th</strong>
                </p>
              </div>
              <div className='space-y-4 mt-3 md:mt-0 w-full flex flex-col items-center'>
                <div className="relative w-full group">
                  <div className="absolute -inset-3 blur-3xl bg-gradient-to-r from-color1 via-color2 to-color3 rounded-lg opacity-100 group-hover:opacity-100 transition duration-1000 group-hover:blur-xl group-hover:-inset-1 animate-gradient-xy"></div>
                  <Button
                    onClick={() => handleCheckout("trial")}
                    className="relative w-full py-7 bg-color2 items-center font-semibold">
                    Get Started
                  </Button>
                </div>
              </div>
              <div className="flex flex-col gap-3 mt-5">
                <ul className="list-none text-left text-white/90 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <li className="flex items-center gap-2">
                    <CheckCircledIcon className="text-green-500" />
                    <>Instant <strong>Practice Questions</strong></>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircledIcon className="text-green-500" />
                    <p>Answers & <strong>Explanations</strong></p>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircledIcon className="text-green-500" />
                    <><strong>Super-fast</strong> Support</>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircledIcon className="text-green-500" />
                    <><strong>Personal</strong> AI chat</>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircledIcon className="text-green-500" />
                    <>Learn <strong>Anything</strong></>
                  </li>
                </ul>
                <p className='text-xs flex items-center justify-center text-center gap-[6px] md:text-xs w-full text-gray-400 mt-5'>
                  Satisfaction Guaranteed
                  &nbsp;|&nbsp;
                  Cancel Anytime
                  &nbsp;|&nbsp;
                  Renews on the yearly plan
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center text-gray-400 text-sm mt-14 mb-20">
          ↓ Or commit to your learning immediately
        </div>
        <div className='relative flex flex-col lg:flex-row items-center lg:items-stretch gap-8'>
          <div className={`relative w-full rounded-xl border`}>
            <div className='relative flex flex-col gap-5 lg:gap-8 z-10  p-8 rounded-lg'>
              <div className='flex flex-col items-center gap-4'>
                <div><p className="text-lg lg:text-xl font-bold">Yearly</p></div>
              </div>
              <div className="flex gap-2 mb-2">
                <div className="flex flex-col justify-end mb-[4px] text-lg ">
                  <p className="relative opacity-80">
                    <span className="absolute bg-base-content h-[1.5px] inset-x-0 top-[48%]"></span>
                    <span className="text-base-content line-through">$39</span>
                  </p>
                </div>
                <p className="text-5xl tracking-tight font-extrabold">$29</p>
                <div className="flex flex-col justify-end mb-[4px]">
                  <p className="text-xs opacity-60 uppercase font-semibold">USD</p>
                </div>
              </div>
              <div className='space-y-2'>
                <Button
                  onClick={() => handleCheckout("yearly")}
                  className='w-full py-7 bg-color1'>
                  START LEARNING
                </Button>
              </div>
            </div>
          </div>
          <div className={`relative w-full rounded-xl border-2 border-color2`}>
            <div className="absolute -top-4 w-full flex justify-center">
              <div className='bg-color2 rounded-full px-6 py-1 text-sm'>Popular</div>
            </div>
            <div className='relative flex flex-col gap-5 lg:gap-8 z-10  p-8 rounded-lg'>
              <div className='flex flex-col items-center gap-4'>
                <div><p className="text-lg lg:text-xl font-bold  ">Lifetime</p></div>
              </div>
              <div className="flex gap-2 mb-2">
                <div className="flex flex-col justify-end mb-[4px] text-lg ">
                  <p className="relative opacity-80">
                    <span className="absolute bg-base-content h-[1.5px] inset-x-0 top-[48%]"></span>
                    <span className="text-base-content line-through">$129</span>
                  </p>
                </div>
                <p className="text-5xl tracking-tight font-extrabold">$98</p>
                <div className="flex flex-col justify-end mb-[4px]">
                  <p className="text-xs opacity-60 uppercase font-semibold">USD</p>
                </div>
              </div>
              <div className='space-y-2'>
                <Button
                  onClick={() => handleCheckout("lifetime")}
                  className='w-full py-7 bg-color2'>
                  GET STUDYPHII
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;