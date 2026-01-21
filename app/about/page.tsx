'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ScrollAnimation } from '../components/ui/ScrollAnimation';
import { ArrowRight, Leaf, ShieldCheck, Globe, Users } from 'lucide-react';

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative h-auto md:h-[70vh] flex items-center overflow-hidden bg-slate-950 py-15!">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2000&auto=format&fit=crop"
                        alt="Fashion Workshop"
                        fill
                        className="object-cover opacity-40 grayscale"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
                </div>

                <div className="container relative z-10 mx-auto px-4 md:px-6">
                    <ScrollAnimation direction="up" className="max-w-3xl">
                        <span className="inline-block px-3 py-1 md:px-4 md:py-1 rounded-full bg-blue-600/20 text-blue-400 text-[10px] md:text-sm font-bold tracking-widest uppercase mb-4 md:mb-6 border border-blue-500/30">
                            Our Story
                        </span>
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 md:mb-8 leading-tight font-display">
                            Redefining Modern <span className="text-blue-500">Elegance</span> Since 2023.
                        </h1>
                        <p className="text-lg md:text-xl text-slate-300 mb-8 md:mb-10 leading-relaxed max-w-2xl">
                            We don't just sell clothes; we curate experiences. Our mission is to blend timeless craftsmanship with contemporary vision.
                        </p>
                        <Button size="lg" className="rounded-full px-8! py-6! md:py-7! text-base md:text-lg bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all duration-300 group w-full sm:w-auto" asChild>
                            <Link href="/shop" className="flex items-center justify-center gap-2">
                                Explore Collection <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                    </ScrollAnimation>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16 md:py-24 bg-white overflow-hidden">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-10 md:gap-16">
                        <div className="flex-1">
                            <ScrollAnimation direction="right">
                                <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 md:mb-8 font-display">Crafting with Purpose and <span className="italic text-blue-600">Integrity</span>.</h2>
                                <p className="text-base md:text-lg text-slate-600 mb-4 md:mb-6 leading-relaxed">
                                    Founded in the heart of the city, our brand emerged from a simple observation: modern fashion had lost its soul. Mass production had replaced personal touch, and fast trends had overshadowed enduring style.
                                </p>
                                <p className="text-base md:text-lg text-slate-600 mb-4 md:mb-6 leading-relaxed">
                                    Every piece in our collection is a testament to our commitment to excellence. We source only the finest sustainable materials, working with artisans who share our dedication to perfection.
                                </p>
                                <div className="grid grid-cols-2 gap-4 md:gap-8 mt-8 md:mt-12 py-6 md:py-8 border-t border-slate-100">
                                    <div>
                                        <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-1">98%</div>
                                        <div className="text-[10px] md:text-sm font-bold text-slate-400 uppercase tracking-wider">Sustainable Materials</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-1">50+</div>
                                        <div className="text-[10px] md:text-sm font-bold text-slate-400 uppercase tracking-wider">Expert Artisans</div>
                                    </div>
                                </div>
                            </ScrollAnimation>
                        </div>
                        <div className="flex-1 relative w-full">
                            <ScrollAnimation direction="left">
                                <div className="relative aspect-video sm:aspect-[4/5] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl">
                                    <Image
                                        src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1000&auto=format&fit=crop"
                                        alt="Fashion Detail"
                                        fill
                                        className="object-cover hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                                <div className="absolute -bottom-6 -left-6 md:-bottom-8 md:-left-8 p-6 md:p-8 bg-blue-600 rounded-2xl shadow-xl hidden sm:block animate-bounce-slow max-w-[250px] md:max-w-xs">
                                    <p className="text-white font-bold text-sm md:text-lg italic leading-tight">"Fashion is what you buy, style is what you do with it."</p>
                                </div>
                            </ScrollAnimation>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-16 md:py-24 bg-slate-50">
                <div className="container mx-auto px-4 text-center pb-10! md:pb-12!">
                    <ScrollAnimation direction="up">
                        <span className="text-blue-600 font-bold tracking-widest uppercase text-[10px] md:text-sm mb-3 md:mb-4 block">Our Foundation</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 md:mb-6">Values That Drive Us</h2>
                        <div className="w-16 md:w-24 h-1 md:h-1.5 bg-blue-600 mx-auto rounded-full"></div>
                    </ScrollAnimation>
                </div>

                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                        {[
                            {
                                icon: <Leaf className="w-6 h-6 md:w-8 md:h-8 transition-colors duration-300" />,
                                title: "Eco-Conscious",
                                description: "We prioritize the planet in everything we do, from plastic-free packaging to carbon-neutral shipping."
                            },
                            {
                                icon: <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 transition-colors duration-300" />,
                                title: "Quality First",
                                description: "We believe in 'buy less, buy better'. Our clothes are designed to last a lifetime, not just a season."
                            },
                            {
                                icon: <Globe className="w-6 h-6 md:w-8 md:h-8 transition-colors duration-300" />,
                                title: "Global Vision",
                                description: "Inspiring fashion lovers across the world with designs that transcend borders and cultures."
                            }
                        ].map((value, idx) => (
                            <ScrollAnimation key={idx} direction="up" delay={idx * 0.1}>
                                <div className="p-8 md:p-10 bg-white rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group h-full">
                                    <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-50 text-blue-600 rounded-xl md:rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                        {value.icon}
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 md:mb-4">{value.title}</h3>
                                    <p className="text-sm md:text-base text-slate-600 leading-relaxed opacity-80">
                                        {value.description}
                                    </p>
                                </div>
                            </ScrollAnimation>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team/Philosophy Section */}
            <section className="py-16 md:py-24 bg-white">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="bg-slate-950 rounded-[2rem] md:rounded-[3rem] px-4! md:px-20! py-10! md:py-20! relative overflow-hidden flex flex-col items-center text-center">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 blur-[100px] rounded-full" />

                        <ScrollAnimation direction="up" className="w-full">
                            <Users className="w-12 h-12 md:w-16 md:h-16 text-blue-500 mb-6 md:mb-8 mx-auto" strokeWidth={1} />
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 md:mb-8 max-w-3xl leading-tight font-display mx-auto">Join Our Community of Conscious Fashion Lovers</h2>
                            <p className="text-slate-400 text-base md:text-lg mb-8 md:mb-12 max-w-2xl px-4 mx-auto">
                                Become part of our journey as we continue to push the boundaries of what's possible in the world of modern e-commerce and sustainable style.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-sm mx-auto sm:max-w-none px-4">
                                <Button size="lg" className="rounded-full px-10 h-14 bg-white text-slate-950 hover:bg-blue-600 hover:text-white hover:scale-105 active:scale-95 transition-all duration-300 font-bold shadow-lg hover:shadow-blue-500/25 w-full sm:w-auto" asChild>
                                    <Link href="/shop" className="justify-center">Start Shopping</Link>
                                </Button>
                                <Button size="lg" variant="outline" className="rounded-full px-10 h-14 bg-white text-slate-950 hover:bg-blue-600 hover:text-white hover:scale-105 active:scale-95 transition-all duration-300 font-bold shadow-lg hover:shadow-blue-500/25 w-full sm:w-auto border-none" asChild>
                                    <Link href="/contact" className="justify-center">Get in Touch</Link>
                                </Button>
                            </div>
                        </ScrollAnimation>
                    </div>
                </div>
            </section>
        </main>
    );
}
