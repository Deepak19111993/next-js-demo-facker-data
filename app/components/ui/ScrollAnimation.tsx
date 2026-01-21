'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

interface ScrollAnimationProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

export const ScrollAnimation = ({
    children,
    className = "",
    delay = 0,
    direction = 'up'
}: ScrollAnimationProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (ref.current) observer.unobserve(ref.current);
                }
            },
            {
                threshold: 0,
                rootMargin: '100px', // Trigger earlier
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        // Safety fallback: ensure content becomes visible after a delay even if observer fails
        const timeout = setTimeout(() => {
            setIsVisible(true);
        }, 2000);

        return () => {
            if (ref.current) observer.unobserve(ref.current);
            clearTimeout(timeout);
        };
    }, []);

    const getTransform = () => {
        const distance = '50px';
        switch (direction) {
            case 'up': return `translateY(${distance})`;
            case 'down': return `translateY(-${distance})`;
            case 'left': return `translateX(${distance})`;
            case 'right': return `translateX(-${distance})`;
            case 'none': return 'scale(0.95)';
            default: return 'none';
        }
    };

    const baseStyle: React.CSSProperties = {
        opacity: isVisible ? 1 : 0,
        // When visible, unset transform so CSS classes (like translate-y-8) can work
        transform: isVisible ? undefined : getTransform(),
        transition: `opacity 0.8s ease-out ${delay}s, transform 0.8s ease-out ${delay}s`,
    };

    return (
        <div
            ref={ref}
            style={baseStyle}
            className={className}
        >
            {children}
        </div>
    );
};
