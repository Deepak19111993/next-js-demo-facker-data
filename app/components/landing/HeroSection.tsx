import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { ScrollAnimation } from '../ui/ScrollAnimation';

export function HeroSection() {
    return (
        <section className="relative bg-gray-50 z-0 overflow-x-clip">
            <div className="container mx-auto px-4 py-12 sm:py-24 lg:py-40 flex flex-col-reverse lg:flex-row items-center gap-12">
                <ScrollAnimation direction="right" className="flex-1 text-center lg:text-left z-10">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6 font-display">
                        Elevate Your Style with <span className="text-blue-600">Premium Essentials</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
                        Discover a curated collection of high-quality clothing and accessories designed for modern life. Comfort meets sophistication.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <Button size="lg" className="rounded-full text-base min-h-[50px] px-5! py-3! h-auto" asChild>
                            <Link href="/shop?category=men">
                                Shop Men <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                        </Button>
                        <Button variant="outline" size="lg" className="rounded-full text-base min-h-[50px] px-5! py-3! h-auto" asChild>
                            <Link href="/shop?category=women">
                                Shop Women
                            </Link>
                        </Button>
                    </div>
                </ScrollAnimation>
                <ScrollAnimation direction="left" className="flex-1 relative w-full max-w-lg lg:max-w-none">
                    <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                        <Image
                            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop"
                            alt="Fashion Model"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                    <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-yellow-400 rounded-full z-[-1] animate-float"></div>
                    <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-100 rounded-full z-[-1] animate-float-reverse"></div>
                </ScrollAnimation>
            </div>
        </section>
    );
}
