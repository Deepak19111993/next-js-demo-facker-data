"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const BANNER_DATA = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop",
        alt: "Fashion Collection",
        link: "/shop?category=fashion"
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2001&auto=format&fit=crop",
        alt: "Electronics Sale",
        link: "/shop?category=electronics"
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2032&auto=format&fit=crop",
        alt: "Home Decor",
        link: "/shop?category=home"
    },
    {
        id: 4,
        image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop",
        alt: "Gaming Gear",
        link: "/shop?category=gaming"
    }
];

export function HomeBanner() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % BANNER_DATA.length);
    }, []);

    const prevSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev - 1 + BANNER_DATA.length) % BANNER_DATA.length);
    }, []);

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 5000);

        return () => clearInterval(timer);
    }, [nextSlide]);

    return (
        <div className="relative w-full z-0 bg-gray-200">
            {/* Aspect Ratio Container: Mobile 16:9, Desktop 21:9 or taller depending on design preference.
          Amazon uses a very wide banner. Let's aim for a responsive height.
      */}
            <div className="relative w-full h-[240px] sm:h-[320px] md:h-[400px] lg:h-[500px] xl:h-[600px]">
                {BANNER_DATA.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                            }`}
                    >
                        <Image
                            src={slide.image}
                            alt={slide.alt}
                            fill
                            className="object-cover object-top"
                            priority={index === 0}
                        />
                        {/* Gradient Overlay for bottom blending */}
                        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none" />
                    </div>
                ))}

                {/* Navigation Arrows */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 h-[40px] w-[40px] rounded-full bg-white hover:bg-white/90 text-black shadow-md opacity-70 hover:opacity-100 transition-all hidden sm:flex items-center justify-center"
                    onClick={prevSlide}
                >
                    <ChevronLeft className="h-6 w-6" />
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 h-[40px] w-[40px] rounded-full bg-white hover:bg-white/90 text-black shadow-md opacity-70 hover:opacity-100 transition-all hidden sm:flex items-center justify-center"
                    onClick={nextSlide}
                >
                    <ChevronRight className="h-6 w-6" />
                </Button>

                {/* Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
                    {BANNER_DATA.map((_, index) => (
                        <button
                            key={index}
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === currentSlide ? "bg-white w-6" : "bg-white/50 hover:bg-white/80"
                                }`}
                            onClick={() => goToSlide(index)}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
