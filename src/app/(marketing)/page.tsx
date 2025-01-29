import Header from "@/components/landing-page/Header";
import Hero from "@/components/landing-page/Hero";
import ProblemsComponents from "@/components/landing-page/Problems";
import Pricing from "@/components/landing-page/Pricing";
import ArticleReference from "@/components/landing-page/TestinomialGrid";
import FAQ from "@/components/landing-page/FAQ";
import CTA from "@/components/landing-page/CTA";
import Footer from "@/components/landing-page/Footer";
import FeaturedIn from "@/components/landing-page/FeaturedIn";

export default async function Home() {
  return (
    <main className="dark min-h-screen max-w-screen overflow-x-hidden">
      <Header />
      <Hero />
      <FeaturedIn />
      <ProblemsComponents />
      <ArticleReference />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
