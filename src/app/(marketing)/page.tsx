"use client";
import Header from "@/components/landing-page/Header";
import Hero from "@/components/landing-page/Hero";
import ProblemsComponents from "@/components/landing-page/Problems";
import Pricing from "@/components/landing-page/Pricing";
import Testimonials11 from "@/components/landing-page/TestinomialGrid";
import FAQ from "@/components/landing-page/FAQ";
import CTA from "@/components/landing-page/CTA";
import Footer from "@/components/landing-page/Footer";


export default function Home() {

  return (
    <main className="dark min-h-screen bg-background">
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
