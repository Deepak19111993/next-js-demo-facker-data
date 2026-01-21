
import { HeroSection } from "./components/landing/HeroSection";
import { TestimonialSection } from "./components/landing/TestimonialSection";
import { AboutSection } from "./components/landing/AboutSection";
import { OfferSection } from "./components/landing/OfferSection";
import { PerfumeParallaxSection } from "./components/landing/PerfumeParallaxSection";

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <AboutSection />
      <TestimonialSection />
      <PerfumeParallaxSection />
      <OfferSection />
    </div>
  );
}