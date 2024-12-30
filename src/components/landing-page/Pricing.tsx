"use client"
import React from 'react';
import Label from './Label';
import { Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';


const Pricing: React.FC = () => {
    const router = useRouter();

    const handleCheckout = async (type: "lifetime" | "yearly") =>{
        sessionStorage.setItem("selectedPlan", type);
        router.push("/auth");
    }

    return (
        <section className='bg-black' id="pricing">
            <div className='py-24 px-8 max-w-5xl mx-auto'>
                <div className='flex flex-col text-center w-full mb-20'>
                    <Label text="Pricing" />
                    <h2 className="font-extrabold text-3xl lg:text-5xl tracking-tight mt-3 mb-8 max-w-2xl mx-auto">Start studying smarter</h2>
                    <p className='text-sm md:text-base flex justify-center items-center gap-2 '>
                        <span>
                            Pick a&nbsp;
                            <span className="text-lime-500">plan</span>&nbsp;that suits you and get access to the full package.
                        </span>
                    </p>
                </div>
                <div className='relative flex flex-col lg:flex-row items-center lg:items-stretch gap-8'>
                    <div className={`relative w-full rounded-xl border`}>
                        <div className='relative flex flex-col gap-5 lg:gap-8 z-10  p-8 rounded-lg'>
                            <div className='flex flex-col items-center gap-4'>
                                <div><p className="text-lg lg:text-xl font-bold  ">Yearly</p></div>
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

                {/* <div className='space-y-4 mx-auto max-w-md mt-24'>
                    <p className="md:text-lg leading-relaxed">{testimonial.text}</p>
                    <div className='flex items-center gap-2'>
                        <p>{testimonial.author}</p>
                        <span className="badge badge-accent badge-outline">{testimonial.badge}</span>

                    </div>
                </div> */}
            </div>

        </section>
    );
};

export default Pricing;