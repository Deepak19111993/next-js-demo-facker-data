
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Tag } from 'lucide-react';
import { ScrollAnimation } from '../ui/ScrollAnimation';

export function OfferSection() {
    return (
        <section className="py-12 lg:py-24 bg-blue-600 text-white relative overflow-hidden">
            {/* Decorative Circles */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3"></div>

            <div className="container mx-auto px-4 text-center relative z-10">
                <ScrollAnimation direction="up">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                        <Tag className="w-4 h-4" />
                        <span className="text-sm font-medium">Limited Time Offer</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold mb-6">Summer Sale is Live!</h2>
                    <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-2xl mx-auto">
                        Get up to <span className="font-bold text-white">50% OFF</span> on selected summer essentials.
                        Upgrade your wardrobe without breaking the bank.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" variant="secondary" className="rounded-full text-blue-600 font-bold text-base min-h-[50px] px-5! py-3! h-auto" asChild>
                            <Link href="/shop">
                                Shop the Sale <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                        </Button>
                    </div>
                    <p className="mt-6 text-sm text-blue-200">
                        *Terms and conditions apply. Offer valid till stocks last.
                    </p>
                </ScrollAnimation>
            </div>
        </section>
    );
}
