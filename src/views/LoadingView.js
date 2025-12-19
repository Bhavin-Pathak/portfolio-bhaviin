import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";

// Terminal text that will be displayed on loading with terminal effect 
const bootSequence = [
    "> Initializing Core Systems...",
    "> Establishing Secure Handshake...",
    "> Loading Bhavin's Neural Path...",
    "> Compiling Full-Stack Modules...",
    "> Fetching Portfolio Assets...",
    "> Rendering 3D Environment...",
    "> Access Granted. Welcome."
];

// Loading View Component
export default function LoadingView({ onComplete }) {
    // State
    const [lines, setLines] = useState([]);
    const [isExiting, setIsExiting] = useState(false);

    // useEffect to handle typing animation
    useEffect(() => {
        // Initialize variables
        let currentLineIndex = 0;
        let currentCharIndex = 0;
        let timeoutId;
        // Array to store timeout IDs
        const timeouts = [];
        // Initialize first line
        setLines([""]);
        // Type next character function
        const typeNextChar = () => {
            if (currentLineIndex >= bootSequence.length) {
                // All lines typed, trigger exit
                const exitId = setTimeout(() => {
                    setIsExiting(true);
                    const completeId = setTimeout(onComplete, 1000);
                    timeouts.push(completeId);
                }, 1000);
                // Add exit timeout to array
                timeouts.push(exitId);
                return;
            }
            // Get current line text
            const currentLineText = bootSequence[currentLineIndex];
            if (currentCharIndex < currentLineText.length) {
                // Type next character function
                setLines(prev => {
                    const newLines = [...prev];
                    // Ensure line exists
                    if (newLines[currentLineIndex] === undefined) newLines[currentLineIndex] = "";
                    // Update current line
                    newLines[currentLineIndex] = currentLineText.substring(0, currentCharIndex + 1);
                    // Return updated lines
                    return newLines;
                });
                // Increment character index
                currentCharIndex++;
                // Fixed 75ms typing speed as requested
                timeoutId = setTimeout(typeNextChar, 75);
            } else {
                // Line finished    
                currentLineIndex++;
                currentCharIndex = 0;
                // Prepare next line if available
                if (currentLineIndex < bootSequence.length) {
                    setLines(prev => [...prev, ""]);
                }
                // Pause between lines
                timeoutId = setTimeout(typeNextChar, 300);
            }
            // Add timeout to array
            timeouts.push(timeoutId);
        };
        // Start typing
        timeoutId = setTimeout(typeNextChar, 100);
        // Add timeout to array
        timeouts.push(timeoutId);
        // Cleanup timeouts on unmount
        return () => { timeouts.forEach(clearTimeout) };
    }, [onComplete]);

    return (
        <AnimatePresence>
            {!isExiting && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                    transition={{ duration: 0.8 }}
                    className="fixed inset-0 bg-[#0a0a0a] text-green-500 font-mono p-4 z-50 overflow-hidden flex items-center justify-center"
                >
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%] pointer-events-none z-10" />
                    <div className="w-full max-w-2xl relative z-20">
                        <div className="space-y-2">
                            {lines.map((line, idx) => (
                                <div key={idx} className="text-sm md:text-base opacity-90 break-all">
                                    <span className="text-blue-400 mr-2 font-bold select-none">root@bhavin:~#</span>
                                    <span className="text-green-400">{line}</span>
                                    {idx === lines.length - 1 && (
                                        <motion.span
                                            animate={{ opacity: [0, 1, 0] }}
                                            transition={{ duration: 0.8, repeat: Infinity }}
                                            className="inline-block text-green-400 font-bold ml-1"
                                        >
                                            |
                                        </motion.span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

LoadingView.propTypes = { onComplete: PropTypes.func.isRequired };
