"use client";

import React from "react";
import dynamic from "next/dynamic";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Dynamically import your existing AlphaTabPlayer component with SSR disabled
const DynamicAlphaTabPlayer = dynamic(() => import("./alphaTabPlayer"), {
    ssr: false,
    loading: () => (
        <div className="text-neutral-400 p-6 animate-pulse">
            Loading player engine...
        </div>
    ),
});

interface AlphaTabModalProps {
    isOpen: boolean;
    onClose: () => void;
    fileUrl?: string;
}

export default function AlphaTabModal({
    isOpen,
    onClose,
    fileUrl = "https://www.alphatab.net/files/canon.gp",
}: AlphaTabModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 md:p-8"
                >
                    <motion.div
                        initial={{ scale: 0.95, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: 20 }}
                        className="relative w-full max-w-5xl h-[85vh] bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl flex flex-col p-6 overflow-hidden"
                    >
                        {/* Header & Close Button */}
                        <div className="flex items-center justify-between pb-4 mb-2 border-b border-neutral-800">
                            <h2 className="text-xl font-bold text-white tracking-wide">
                                Interactive Tab Player
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-800 rounded-full transition-colors cursor-pointer"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Player Content Container */}
                        <div className="flex-1 overflow-hidden flex flex-col">
                            <DynamicAlphaTabPlayer fileUrl={fileUrl} />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
