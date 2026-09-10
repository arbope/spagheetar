"use client";

import React, { useEffect, useRef, useState } from "react";
import "@coderline/alphatab";

interface AlphaTabApi {
    playerReady: {
        on: (callback: () => void) => void;
    };
    playerStateChanged: {
        on: (callback: (e: PlayerStateEvent) => void) => void;
    };
    playPause: () => void;
    stop: () => void;
    destroy: () => void;
}

interface PlayerStateEvent {
    state: number;
}

interface WindowWithAlphaTab extends Window {
    alphaTab: {
        AlphaTabApi: new (container: HTMLElement, settings: unknown) => AlphaTabApi;
        synth: {
            PlayerState: {
                Playing: number;
            };
        };
    };
}

interface AlphaTabPlayerProps {
	fileUrl: string;
}

export default function AlphaTabPlayer({ fileUrl }: AlphaTabPlayerProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const apiRef = useRef<AlphaTabApi | null>(null);

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
		const win = window as unknown as WindowWithAlphaTab;
		const api = new win.alphaTab.AlphaTabApi(
			containerRef.current,
			settings,
		);
		apiRef.current = api;

		// Lifecycle event listeners
		api.playerReady.on(() => {
			setIsReady(true);
		});

		api.playerStateChanged.on((e: PlayerStateEvent) => {
			setIsPlaying(
				e.state === win.alphaTab.synth.PlayerState.Playing,
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