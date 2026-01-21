
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ScrollAnimation } from '../ui/ScrollAnimation';

export function AboutSection() {
    return (
        <section className="py-12 lg:py-24 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                    <div className="flex-1 relative order-2 lg:order-1 w-full">
                        <div className="grid grid-cols-2 gap-4">
                            <ScrollAnimation direction="up" delay={0.2} className="space-y-4 translate-y-4 lg:translate-y-8">
                                <div className="relative h-48 lg:h-64 w-full rounded-2xl overflow-hidden shadow-lg">
                                    <Image src="https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1000&auto=format&fit=crop" alt="Men's Fashion 1" fill className="object-cover" />
                                </div>
                                <div className="relative h-32 lg:h-48 w-full rounded-2xl overflow-hidden shadow-lg">
                                    <Image src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1000&auto=format&fit=crop" alt="Men's Fashion 2" fill className="object-cover" />
                                </div>
                            </ScrollAnimation>
                            <ScrollAnimation direction="down" delay={0.4} className="space-y-4">
                                <div className="relative h-32 lg:h-48 w-full rounded-2xl overflow-hidden shadow-lg">
                                    <Image src="https://images.unsplash.com/photo-1504593811423-6dd665756598?q=80&w=1000&auto=format&fit=crop" alt="Men's Fashion 3" fill className="object-cover" />
                                </div>
                                <div className="relative h-48 lg:h-64 w-full rounded-2xl overflow-hidden shadow-lg">
                                    <Image src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop" alt="Men's Fashion 4" fill className="object-cover" />
                                </div>
                            </ScrollAnimation>
                        </div>
                    </div>

                    <ScrollAnimation direction="left" className="flex-1 order-1 lg:order-2">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-display">Redefining Modern Fashion</h2>
                        <div className="w-20 h-1 bg-blue-600 mb-6 lg:mb-8 rounded-full"></div>
                        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                            Founded in 2023, we set out with a simple mission: to create clothing that inspires confidence and embraces comfort. We believe that fashion shouldn't come at the cost of the planet or your comfort.
                        </p>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            Our materials are ethically sourced, and our designs are timeless. Whether you're dressing for a boardroom meeting or a casual weekend getaway, we have pieces that fit your lifestyle seamlessly.
                        </p>

                        <div className="grid grid-cols-2 gap-8 mb-8">
                            <div>
                                <h4 className="text-4xl font-bold text-gray-900 mb-2">10k+</h4>
                                <p className="text-gray-500">Happy Customers</p>
                            </div>
                            <div>
                                <h4 className="text-4xl font-bold text-gray-900 mb-2">100%</h4>
                                <p className="text-gray-500">Quality Guarantee</p>
                            </div>
                        </div>

                        <Button size="lg" variant="outline" className="rounded-full text-base min-h-[50px]" asChild>
                            <Link href="/about">
                                Read Our Story
                            </Link>
                        </Button>
                    </ScrollAnimation>
                </div>
            </div>
        </section>
    );
}
