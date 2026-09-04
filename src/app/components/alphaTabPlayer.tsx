"use client";

import React, { useEffect, useRef, useState } from "react";
import "@coderline/alphatab";

interface AlphaTabPlayerProps {
	fileUrl: string;
}

export default function AlphaTabPlayer({ fileUrl }: AlphaTabPlayerProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const apiRef = useRef<any>(null);

	const [isReady, setIsReady] = useState(false);
	const [isPlaying, setIsPlaying] = useState(false);

	useEffect(() => {
		if (!containerRef.current || typeof window === "undefined") return;

		const settings = {
			core: {
				file: fileUrl,
			},
			player: {
				enablePlayer: true,
				soundFont: "/soundfont/sonivox.sf2",
			},
		};

		// Initialize alphaTab instance
		const api = new (window as any).alphaTab.AlphaTabApi(
			containerRef.current,
			settings,
		);
		apiRef.current = api;

		// Lifecycle event listeners
		api.playerReady.on(() => {
			setIsReady(true);
		});

		api.playerStateChanged.on((e: any) => {
			setIsPlaying(
				e.state === (window as any).alphaTab.synth.PlayerState.Playing,
			);
		});

		// Cleanup on unmount
		return () => {
			api.destroy();
		};
	}, [fileUrl]);

	return (
		<div className="flex flex-col gap-4 w-full">
			{/* Player Controls Bar */}
			<div className="flex items-center gap-3">
				<button
					onClick={() => apiRef.current?.playPause()}
					disabled={!isReady}
					className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-md disabled:opacity-50 transition-colors cursor-pointer disabled:cursor-not-allowed"
				>
					{isPlaying ? "Pause" : "Play"}
				</button>
				<button
					onClick={() => apiRef.current?.stop()}
					disabled={!isReady}
					className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium rounded-md disabled:opacity-50 transition-colors cursor-pointer disabled:cursor-not-allowed"
				>
					Stop
				</button>
				{!isReady && (
					<span className="text-sm text-neutral-400 animate-pulse">
						Loading SoundFont & Parsing Tab...
					</span>
				)}
			</div>

			{/* alphaTab Rendering Target */}
			<div
				ref={containerRef}
				className="w-full h-[650px] bg-neutral-900 border border-neutral-800 rounded-xl overflow-y-auto p-4 text-neutral-100 shadow-inner"
			/>
		</div>
	);
}
