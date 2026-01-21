
import { Star } from 'lucide-react';
import Image from 'next/image';
import { ScrollAnimation } from '../ui/ScrollAnimation';

const testimonials = [
    {
        id: 1,
        name: 'Sarah Johnson',
        role: 'Fashion Enthusiast',
        content: "The quality of the clothing is absolutely outstanding. I've never felt fabrics this soft and durable. Highly recommended!",
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        rating: 5,
    },
    {
        id: 2,
        name: 'Michael Chen',
        role: 'Verified Buyer',
        content: "Fast shipping and excellent customer service. The fit is perfect, exactly as described in the sizing chart.",
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        rating: 5,
    },
    {
        id: 3,
        name: 'Emily Davis',
        role: 'Style Blogger',
        content: "I love the modern aesthetic of this brand. Everything matches so well, making it easy to build a capsule wardrobe.",
        avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
        rating: 4,
    },
];

export function TestimonialSection() {
    return (
        <section className="py-12 lg:py-24 bg-white">
            <div className="container mx-auto px-4">
                <ScrollAnimation direction="up" className="text-center md:mb-10 mb-5">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
                    <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
                </ScrollAnimation>

                <ScrollAnimation direction="up" delay={0.2}>
                    <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]">
                        <div className="flex animate-scroll gap-8 w-max px-4 py-8">
                            {[...testimonials, ...testimonials, ...testimonials].map((testimonial, index) => (
                                <div
                                    key={`${testimonial.id}-${index}`}
                                    className="w-[300px] md:w-[400px] flex-shrink-0 bg-gray-50 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-5 h-5 ${i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-12 h-12 rounded-full overflow-hidden">
                                            <Image src={testimonial.avatar} alt={testimonial.name} fill className="object-cover" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                                            <p className="text-sm text-gray-500">{testimonial.role}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </ScrollAnimation>
            </div>
        </section>
    );
}
