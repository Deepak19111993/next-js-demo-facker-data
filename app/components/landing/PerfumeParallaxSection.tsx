'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const perfumes = [
    {
        id: 1,
        name: 'Midnight Rose',
        description: 'A mysterious blend of velvet rose and midnight jasmine.',
        image: 'https://images.unsplash.com/photo-1557170334-a9632e77c6e4?q=80&w=800&auto=format&fit=crop', // Pink/Dark bottle
    },
    {
        id: 2,
        name: 'Ocean Mist',
        description: 'Fresh aquatic notes with a hint of sea salt.',
        image: 'https://images.unsplash.com/photo-1582211594533-268f4f1edcb9?q=80&w=800&auto=format&fit=crop',
    },
    {
        id: 3,
        name: 'Pure Elegance',
        description: 'A timeless scent with notes of white floral and musk.',
        image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop', // Gold/Elegant
    },
    {
        id: 4,
        name: 'Citrus Bloom',
        description: 'Energizing citrus with delicate floral undertones.',
        image: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?q=80&w=800&auto=format&fit=crop', // Bright/Floral
    },
    {
        id: 5,
        name: 'Velvet Oud',
        description: 'Rich oud wood with spicy saffron notes.',
        image: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?q=80&w=800&auto=format&fit=crop',
    },
];

export function PerfumeParallaxSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const [translateX, setTranslateX] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current || !trackRef.current) return;

            const container = containerRef.current;
            const track = trackRef.current;
            const { top } = container.getBoundingClientRect();
            const containerHeight = container.offsetHeight;
            const viewportHeight = window.innerHeight;

            // Calculate progress (0 to 1) based on vertical scroll
            const stickyOffset = 160;
            // Use only 60% of the container for the animation, leaving 40% as a static buffer at the end
            const scrollDistance = containerHeight * 0.6;
            const scrolled = stickyOffset - top;
            let progress = scrolled / scrollDistance;
            progress = Math.max(0, Math.min(1, progress));

            // Calculate horizontal translation
            // Max translation is total width of track minus width of viewport (plus some padding if desired)
            const trackWidth = track.scrollWidth;
            const maxTranslate = trackWidth * 1.155 - window.innerWidth;

            // Only translate if track is wider than viewport
            if (maxTranslate > 0) {
                setTranslateX(progress * maxTranslate);
            }
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleScroll);
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    }, []);

    return (
        <section ref={containerRef} className="relative h-[300vh] bg-neutral-900 text-white py-12 lg:py-24">
            <div className="sticky top-[160px] overflow-hidden flex items-center gap-10">

                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">The Essence Collection</h2>
                    <p className="text-gray-400">Scroll to explore</p>
                </div>

                <div
                    ref={trackRef}
                    className="flex gap-5 md:gap-16 px-4 md:px-10 w-max"
                    style={{ transform: `translateX(-${translateX}px)`, transition: 'transform 0.1s linear' }}
                >
                    {perfumes.map((perfume) => (
                        <div key={perfume.id} className="w-[80vw] md:w-[600px] h-[60vh] md:h-[70vh] relative flex-shrink-0 group rounded-3xl overflow-hidden border border-white/10">
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500 z-10" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                            <Image
                                src={perfume.image}
                                alt={perfume.name}
                                fill
                                className="object-cover rounded-3xl"
                                unoptimized
                            />
                            <div className="absolute bottom-8 left-8 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                <h3 className="text-3xl font-bold mb-2">{perfume.name}</h3>
                                <p className="text-lg text-gray-200 shadow-sm">{perfume.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
