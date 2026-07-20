import { Hero } from "./components/hero";
import { FeatureCards } from "./components/feature-cards";
import { HowItWorks } from "./components/how-it-works";
import { Pricing } from "./components/pricing";
import { Faq } from "./components/faq";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <FeatureCards />
      <HowItWorks />
      <Pricing />
      <Faq />
    </>
  );
}
