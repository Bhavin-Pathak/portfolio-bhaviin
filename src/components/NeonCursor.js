'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';

const NeonCursor = () => {
    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);
    const [isPointer, setIsPointer] = useState(false);
    const [clicks, setClicks] = useState([]);

    // Theme Colors
    const primary = "#2563EB";
    const primaryDark = "#6366f1";

    // Multiple trailing layers with different spring configs for a "liquid tail" effect
    const trail1Config = { damping: 20, stiffness: 200 };
    const trail2Config = { damping: 25, stiffness: 120 };
    const trail3Config = { damping: 30, stiffness: 60 };

    const spring1X = useSpring(mouseX, trail1Config);
    const spring1Y = useSpring(mouseY, trail1Config);

    const spring2X = useSpring(mouseX, trail2Config);
    const spring2Y = useSpring(mouseY, trail2Config);

    const spring3X = useSpring(mouseX, trail3Config);
    const spring3Y = useSpring(mouseY, trail3Config);

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
            // Check if hovering over interactive elements
            const target = e.target;
            const isClickable = target.closest('button, a, [role="button"], input, textarea');
            setIsPointer(!!isClickable);
        };

        const handleClick = (e) => {
            const id = Date.now();
            setClicks(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);
            setTimeout(() => {
                setClicks(prev => prev.filter(click => click.id !== id));
            }, 800);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleClick);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleClick);
        };
    }, [mouseX, mouseY]);

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
            {/* Click Ripples */}
            <AnimatePresence>
                {clicks.map(click => (
                    <motion.div
                        key={click.id}
                        initial={{ opacity: 0.8, scale: 0 }}
                        animate={{ opacity: 0, scale: 3 }}
                        exit={{ opacity: 0 }}
                        style={{
                            left: click.x,
                            top: click.y,
                            translateX: '-50%',
                            translateY: '-50%',
                            borderColor: primary,
                        }}
                        className="absolute w-12 h-12 border-2 rounded-full z-0"
                    />
                ))}
            </AnimatePresence>
            {/* Trailing Layer 3 (Deepest Glow) */}
            <motion.div
                style={{
                    x: spring3X,
                    y: spring3Y,
                    translateX: '-50%',
                    translateY: '-50%',
                    background: `radial-gradient(circle, ${primaryDark}20 0%, transparent 70%)`,
                }}
                className="absolute w-24 h-24 rounded-full blur-[15px]"
            />
            {/* Trailing Layer 2 (Middle Trail) */}
            <motion.div
                style={{
                    x: spring2X,
                    y: spring2Y,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                animate={{
                    scale: isPointer ? 1.5 : 1,
                    opacity: isPointer ? 0.6 : 0.4,
                }}
                className="absolute w-10 h-10 border border-indigo-500/30 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.2)]"
            />
            {/* Trailing Layer 1 (Close Trail) */}
            <motion.div
                style={{
                    x: spring1X,
                    y: spring1Y,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                animate={{
                    scale: isPointer ? 1.2 : 1,
                }}
                className="absolute w-6 h-6 border-2 border-blue-600/40 rounded-full blur-[0.5px] shadow-[0_0_10px_rgba(37,99,235,0.3)]"
            />
            {/* Main Precision Dot */}
            <motion.div
                style={{
                    x: mouseX,
                    y: mouseY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                animate={{
                    scale: isPointer ? 0.5 : 1,
                }}
                className="absolute w-2 h-2 bg-blue-600 rounded-full shadow-[0_0_10px_#2563EB,0_0_20px_#2563EB]"
            />
            {/* Dynamic Hover Ring */}
            <motion.div
                style={{
                    x: mouseX,
                    y: mouseY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                animate={{
                    scale: isPointer ? 2.5 : 0,
                    opacity: isPointer ? 1 : 0,
                    borderColor: primaryDark,
                }}
                className="absolute w-6 h-6 border rounded-full blur-[1px] shadow-[0_0_15px_rgba(99,102,241,0.5)]"
            />
        </div>
    );
};

export default NeonCursor;
