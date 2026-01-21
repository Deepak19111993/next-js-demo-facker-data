'use client';

import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');

        // Simulate network request
        await new Promise(resolve => setTimeout(resolve, 2000));

        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });

        // Reset success message after 5 seconds
        setTimeout(() => setStatus('idle'), 5000);
    };

    // Helper for transition classes
    const getTransitionClass = (delay: string = 'delay-0') => {
        return `transition-all duration-700 ease-out transform ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            } ${delay}`;
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className={`text-center mb-10 lg:mb-16 ${getTransitionClass('delay-0')}`}>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-4">
                        Get in Touch
                    </h1>
                    <p className={`max-w-2xl mx-auto text-xl text-gray-500 ${getTransitionClass('delay-100')}`}>
                        Have questions about our products or need assistance? We're here to help.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl shadow-xl overflow-hidden">
                    {/* Contact Info Section */}
                    <div className={`bg-black text-white p-6 lg:p-12 flex flex-col justify-between relative overflow-hidden ${getTransitionClass('delay-200')}`}>
                        {/* Decorative circles */}
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white/5 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-white/5 blur-3xl"></div>

                        <div>
                            <h3 className="text-2xl font-bold mb-8 relative z-10">Contact Information</h3>

                            <div className="space-y-8 relative z-10">
                                <div className="flex items-start space-x-6">
                                    <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                                        <Mail className="w-6 h-6 text-yellow-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400 uppercase tracking-widest font-semibold mb-1">Email</p>
                                        <p className="text-lg font-medium">support@example.com</p>
                                        <p className="text-gray-400 text-sm mt-1">Expected response: 24 hours</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-6">
                                    <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                                        <Phone className="w-6 h-6 text-green-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400 uppercase tracking-widest font-semibold mb-1">Phone</p>
                                        <p className="text-lg font-medium">+1 (555) 123-4567</p>
                                        <p className="text-gray-400 text-sm mt-1">Mon-Fri, 9am - 6pm EST</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-6">
                                    <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                                        <MapPin className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400 uppercase tracking-widest font-semibold mb-1">Headquarters</p>
                                        <p className="text-lg font-medium">123 Commerce St.</p>
                                        <p className="text-lg">New York, NY 10001</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 relative z-10">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 p-4 rounded-xl text-center">
                                    <span className="block text-3xl font-bold text-white mb-1">4.9</span>
                                    <span className="text-xs text-gray-400 uppercase tracking-wider">Trust Score</span>
                                </div>
                                <div className="bg-white/5 p-4 rounded-xl text-center">
                                    <span className="block text-3xl font-bold text-white mb-1">24/7</span>
                                    <span className="text-xs text-gray-400 uppercase tracking-wider">Support</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form Section */}
                    <div className={`px-4 lg:px-8 py-8 lg:py-12 ${getTransitionClass('delay-300')}`}>
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>

                        {status === 'success' ? (
                            <div className="h-full flex flex-col items-center justify-center text-center py-12 animate-in fade-in duration-500">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                    <CheckCircle className="w-10 h-10 text-green-600" />
                                </div>
                                <h4 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h4>
                                <p className="text-gray-600 max-w-sm">
                                    Thank you for reaching out. Our team will get back to you shortly.
                                </p>
                                <Button
                                    onClick={() => setStatus('idle')}
                                    className="mt-8 bg-black text-white hover:bg-gray-800 cursor-pointer"
                                >
                                    Send another message
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</label>
                                        <Input
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="John Doe"
                                            className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="john@example.com"
                                            className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label htmlFor="subject" className="text-sm font-medium text-gray-700">Subject</label>
                                    <Input
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        placeholder="How can we help?"
                                        className="w-full bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label htmlFor="message" className="text-sm font-medium text-gray-700">Message</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={6}
                                        placeholder="Tell us more about your inquiry..."
                                        className="flex w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus:bg-white transition-colors resize-none"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={status === 'submitting'}
                                    className="w-full bg-black hover:bg-gray-800 text-white py-6 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
                                >
                                    {status === 'submitting' ? (
                                        <span className="flex items-center gap-2">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Sending...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            Send Message
                                            <Send className="w-5 h-5" />
                                        </span>
                                    )}
                                </Button>

                                <p className="text-xs text-center text-gray-500 mt-4">
                                    By sending this message, you agree to our <a href="#" className="underline hover:text-gray-900">Privacy Policy</a> and <a href="#" className="underline hover:text-gray-900">Terms of Service</a>.
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}