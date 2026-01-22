"use client";

import { useEffect, useState, useRef } from "react";

export function CustomCursor() {
    // Use refs for values needed in the animation loop to avoid effect re-runs
    const mousePosition = useRef({ x: 0, y: 0 });
    const trailingPosition = useRef({ x: 0, y: 0 });

    // State for rendering
    // We still need state to trigger re-renders for the visual updates
    const [renderPosition, setRenderPosition] = useState({ x: 0, y: 0 });
    const [renderTrailingPosition, setRenderTrailingPosition] = useState({ x: 0, y: 0 });

    const [cursorState, setCursorState] = useState<'default' | 'link' | 'button' | 'disabled'>('default');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            // Update ref immediately for the animation loop
            mousePosition.current = { x: e.clientX, y: e.clientY };

            // Update state for the main dot (react needs state to re-render)
            setRenderPosition({ x: e.clientX, y: e.clientY });

            if (!isVisible) setIsVisible(true);
        };

        let animationFrameId: number;

        const animateTrail = () => {
            const { x: currentX, y: currentY } = mousePosition.current;
            const { x: trailX, y: trailY } = trailingPosition.current;

            const dx = currentX - trailX;
            const dy = currentY - trailY;

            // Linear interpolation (lerp)
            const factor = 0.15;

            const newX = trailX + dx * factor;
            const newY = trailY + dy * factor;

            trailingPosition.current = { x: newX, y: newY };
            setRenderTrailingPosition({ x: newX, y: newY });

            animationFrameId = requestAnimationFrame(animateTrail);
        };

        window.addEventListener("mousemove", onMouseMove);
        animationFrameId = requestAnimationFrame(animateTrail);

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []); // Empty dependency array ensures this runs only once!

    useEffect(() => {
        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            const linkElement = target.closest('a');
            const noViewCursor = target.closest('[data-no-view-cursor="true"]');

            // Check for disabled state
            const closestButton = target.closest('button');
            const isDisabled =
                (target as HTMLButtonElement).disabled ||
                target.getAttribute('aria-disabled') === 'true' ||
                target.classList.contains('cursor-not-allowed') ||
                (closestButton && (closestButton as HTMLButtonElement).disabled) ||
                (closestButton && closestButton.getAttribute('aria-disabled') === 'true');

            const buttonElement =
                target.tagName.toLowerCase() === 'button' ||
                target.tagName.toLowerCase() === 'input' ||
                target.closest('button') ||
                target.getAttribute('role') === 'button';

            if (isDisabled) {
                setCursorState('disabled');
            } else if (noViewCursor) {
                setCursorState('default');
            } else if (linkElement) {
                setCursorState('link');
            } else if (buttonElement) {
                setCursorState('button');
            } else {
                setCursorState('default');
            }
        };

        const handleMouseOut = () => {
            setCursorState('default');
        };

        window.addEventListener("mouseover", handleMouseOver);
        window.addEventListener("mouseout", handleMouseOut);

        return () => {
            window.removeEventListener("mouseover", handleMouseOver);
            window.removeEventListener("mouseout", handleMouseOut);
        };
    }, []);

    if (!isVisible) return null;

    const isLink = cursorState === 'link';
    const isDisabled = cursorState === 'disabled';

    return (
        <>
            {/* Main Dot */}
            <div
                className={`fixed top-0 left-0 w-3 h-3 rounded-full pointer-events-none z-[9999] transition-transform duration-100 ease-out ${isLink ? "bg-white mix-blend-normal opacity-0" :
                        isDisabled ? "bg-red-500" :
                            "bg-white mix-blend-difference"
                    }`}
                style={{
                    transform: `translate(${renderPosition.x}px, ${renderPosition.y}px) translate(-50%, -50%) scale(${isLink ? 0 : 1})`,
                }}
            />

            {/* Trailing Ring */}
            <div
                className={`fixed top-0 left-0 rounded-full pointer-events-none z-[9998] transition-all duration-300 ease-out flex items-center justify-center`}
                style={{
                    transform: `translate(${renderTrailingPosition.x}px, ${renderTrailingPosition.y}px) translate(-50%, -50%)`,
                    width: isLink ? "80px" : "30px",
                    height: isLink ? "80px" : "30px",
                    backgroundColor: isLink ? "black" : "transparent",
                    border: isLink ? "none" : isDisabled ? "1.5px solid #ef4444" : "1.5px solid white",
                    mixBlendMode: isLink ? "normal" : "difference",
                    opacity: 1
                }}
            >
                {isLink && (
                    <span className="text-white text-xs font-medium tracking-wider uppercase animate-in fade-in zoom-in duration-200">
                        View
                    </span>
                )}
            </div>
        </>
    );
}
