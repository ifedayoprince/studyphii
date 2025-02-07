"use client"
import { toast } from "@/hooks/use-toast";
import { api } from "@/trpc/react";
import { Button, Card } from "@nextui-org/react"
import { TRPCClientErrorLike } from "@trpc/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";


interface PricingOption {
  name: string;
  price: string;
  plan: "yearly" | "lifetime" | "trial";
  originalPrice: string;
  description: string;
  features: string[];
  popular?: boolean;
}

const pricingOptions: PricingOption[] = [
  {
    name: "Yearly Plan",
    plan: "yearly",
    price: "$29/year",
    originalPrice: "$39/year",
    description: "Perfect for students who want to begin their academic comeback",
    popular: false,
    features: [
      "Unlimited AI-generated questions",
      "Interactive learning sessions",
      "Personalized feedback"
    ],
  },
  {
    name: "Lifetime Access",
    plan: "lifetime",
    price: "$98",
    originalPrice: "$129",
    description: "Best value for long-term academic weapons",
    popular: true,
    features: [
      "All Yearly Plan benefits",
      "One-time payment",
      "Forever access"
    ],
  },
];

export const PricingSlide = ({ modal }: { modal?: boolean }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const activePlan = session?.user?.plan?.type == "LIFETIME"
  ? "lifetime"
  : session?.user?.plan?.type == "SUBSCRIPTION" && session?.user?.plan.hasTakenTrial
    ? "yearly"
    : "trial";

  const [isLoading, setIsLoading] = useState(false);
  const createCheckout = api.paymentManagement.createCheckout.useMutation({
    onSuccess: (data) => {
      setIsLoading(false);
      router.replace(data?.link || "");
    },
    onError: (error) => {
      setIsLoading(false);
      toast({
        title: error.message,
      });
    }
  });
  const checkout = (plan: "yearly" | "lifetime" | "trial") => {
    setIsLoading(true);
    createCheckout.mutate({
      userId: session?.user.id ?? "",
      plan
    });
  }


  return <div className={`space-y-6 p-8 ${!modal ? "w-screen max-w-4xl" : ""}`}>
    <div className="text-center space-y-2 mb-8">
      <h3 className="text-2xl font-semibold">Choose Your Plan</h3>
      <p className="text-sm text-gray-400">
        🎉 New Year Sale - Prices increase in <span className="text-primary font-semibold">3 weeks</span>
      </p>
    </div>
    <Card
      // onClick={() => setSelectedPlan(option.name)}
      className={`relative p-6 transition-all border border-gray-400 ${!modal ? "border-opacity-40" : ""} ${session?.user?.plan?.hasTakenTrial ? "hidden" : ""}`}>
      <div className={`space-y-4 h-full flex flex-col md:flex-row gap-3 md:gap-0 justify-between items-center`}>
        <div className="flex flex-col gap-1 w-max">
          <p className="text-2xl font-bold text-primary w-max">Try for $0.99</p>
          <p className="text-xs text-gray-400">72 hours of unlimited access</p>
        </div>
        <div className="flex flex-col items-center gap-1 w-full md:w-max">
          <Button
            color="primary"
            className="w-full"
            isLoading={isLoading}
            onClick={() => checkout("trial")}
            variant={"bordered"}>
            Start Trial
          </Button>
          {/* <p className="text-xs text-gray-400 px-3">Renews on the yearly plan</p> */}
        </div>
      </div>
    </Card>
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {pricingOptions.map((option) => (
        <Card
          key={option.name}
          className={`relative p-6 transition-all ${!modal ? "border-opacity-40" : ""} ${option.popular
            ? "border-[3px] border-transparent bg-clip-padding p-0"
            : "border border-gray-400"
            } ${activePlan == option.plan ? "opacity-50" : ""}`}

          style={option.popular ? {
            backgroundImage: 'linear-gradient(white, white), linear-gradient(45deg, #6366f1 16%, #a855f7 50%, #ec4899 84%)',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
          } : undefined}
        >
          <div className={`space-y-4 h-full ${option.popular ? "p-6 bg-content1" : ""}`}>
            {option.popular && (
              <span className="absolute top-3 right-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm">
                Most Popular
              </span>
            )}
            <h4 className="text-xl font-semibold">{option.name}</h4>
            <div>
              <p className="text-2xl font-bold text-primary">{option.price}</p>
              <p className="text-sm text-gray-400 line-through">{option.originalPrice}</p>
            </div>
            <p className="text-gray-400">{option.description}</p>
            <ul className="space-y-2">
              {option.features.map((feature) => (
                <li key={feature} className="flex items-center">
                  <span className="mr-2">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              color="primary"
              className="w-full"
              isLoading={isLoading}
              variant={option.popular ? "shadow" : "bordered"}
              onClick={() => checkout(option.plan)}>
              Get StudyPhii
            </Button>
          </div>
        </Card>
      ))}
    </div>
  </div>
}