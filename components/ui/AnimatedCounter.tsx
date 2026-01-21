"use client";

import { useEffect, useState, useRef } from "react";

export function AnimatedCounter({ count, className }: { count: number, className?: string }) {
    const [displayCount, setDisplayCount] = useState(count);
    const [prevCount, setPrevCount] = useState<number | null>(null);
    const [direction, setDirection] = useState<'up' | 'down' | null>(null);
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (count !== displayCount) {
            setPrevCount(displayCount);
            setDisplayCount(count);
            setDirection(count > displayCount ? 'up' : 'down');
        }
    }, [count, displayCount]);

    if (!direction || prevCount === null) {
        return <span className={className}>{count}</span>;
    }

    return (
        <div className={`relative inline-block overflow-hidden h-[1.2em] align-top ${className}`}>
            {/* The Previous Number - Sliding Out */}
            <span
                key={`${prevCount}-exit`}
                className={`absolute left-0 w-full text-center transition-transform duration-300 ease-in-out ${direction === 'up' ? '-translate-y-full' : 'translate-y-full'
                    }`}
            >
                {prevCount}
            </span>

            {/* The New Number - Sliding In */}
            <span
                key={`${displayCount}-enter`}
                className={`block w-full text-center animate-in transition-transform duration-300 ease-in-out`}
                style={{
                    transform: 'translateY(0)',
                    animation: direction === 'up' ? 'slideInFromBottom 0.3s' : 'slideInFromTop 0.3s'
                }}
            >
                {displayCount}
            </span>
            <style jsx>{`
            @keyframes slideInFromBottom {
                from { transform: translateY(100%); }
                to { transform: translateY(0); }
            }
            @keyframes slideInFromTop {
                from { transform: translateY(-100%); }
                to { transform: translateY(0); }
            }
        `}</style>
        </div>
    );
}
