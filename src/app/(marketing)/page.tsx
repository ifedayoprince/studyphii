import Header from "@/components/landing-page/Header";
import Hero from "@/components/landing-page/Hero";
import ProblemsComponents from "@/components/landing-page/Problems";
import Pricing from "@/components/landing-page/Pricing";
import Testimonials11 from "@/components/landing-page/TestinomialGrid";
import FAQ from "@/components/landing-page/FAQ";
import CTA from "@/components/landing-page/CTA";
import Footer from "@/components/landing-page/Footer";

import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/server/auth";


export default async function Home() {
  const session = await getServerAuthSession();
  if(session)
    redirect("/session")
  else
  redirect("/auth")

  return (
    <main className="dark min-h-screen">
      <Header />
      <Hero />
      <ProblemsComponents />
      <Pricing />
      <Testimonials11 />
      <FAQ />
      <CTA />
      <Footer />
      {/* <FeaturedIn />
        <FeaturesListicle />
        <About />
         */}
    </main>
  );
}
