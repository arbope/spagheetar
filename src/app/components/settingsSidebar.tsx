"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Cog } from "lucide-react";
import { modes, notes } from "../constants";

interface SidebarProps {
	settingsSidebarOpen: boolean;
	setSettingsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
	strings: number;
	frets: number;
	mode: keyof typeof modes;
	root: string;
	setFrets: (value: number) => void;
	setStrings: (value: number) => void;
	setMode: React.Dispatch<React.SetStateAction<keyof typeof modes>>;
	setRoot: (value: string) => void;
}

export default function SettingsSidebar({
	strings,
	setStrings,
	frets,
	setFrets,
	mode,
	setMode,
	root,
	setRoot,
	settingsSidebarOpen,
	setSettingsSidebarOpen,
}: SidebarProps) {
	const sidebarRef = useRef<HTMLDivElement>(null);
	const settingsRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape" && settingsSidebarOpen) {
				setSettingsSidebarOpen(false);
			}
		}

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [settingsSidebarOpen, setSettingsSidebarOpen]);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			const target = event.target as Node;

			if (settingsRef.current?.contains(target)) return;

			if (sidebarRef.current && !sidebarRef.current.contains(target)) {
				setSettingsSidebarOpen(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [settingsSidebarOpen, setSettingsSidebarOpen]);

	return (
		<>
			<div
				ref={settingsRef}
				onClick={() => setSettingsSidebarOpen((prev) => !prev)}
				className="w-min h-min cursor-pointer transition-transform duration-1000 transform hover:rotate-[360deg] hover:text-gray-800 z-10"
			>
				<Cog size={36} />
			</div>

			<motion.div
				ref={sidebarRef}
				initial={{ x: 250 }}
				animate={{ x: settingsSidebarOpen ? 0 : 250 }}
				transition={{ type: "spring", stiffness: 300, damping: 30 }}
				className={`fixed top-0 right-0 h-full w-56 bg-red/80 backdrop-blur-md shadow-lg p-4 overflow-y-auto z-50 rounded-tl-lg rounded-bl-lg transition-opacity duration-300 ${settingsSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
			>
				<div className="flex flex-col justify-evenly h-full text-sm text-gray-900">
					<div className="text-center">
						<h2 className="text-lg font-semibold mb-2">Strings</h2>
						<input
							type="number"
							min={1}
							max={20}
							className="w-full px-3 py-1.5 rounded border border-black shadow-sm focus:outline-none focus:ring-1 focus:ring-black"
							value={strings}
							onChange={(e) => setStrings(Number(e.target.value))}
						/>
					</div>

					<div className="text-center">
						<h2 className="text-lg font-semibold mb-2">Root</h2>
						<select
							className="w-full px-3 py-1.5 rounded border border-black shadow-sm focus:outline-none focus:ring-1 focus:ring-black"
							value={root}
							onChange={(e) => setRoot(e.target.value)}
						>
							{notes
								.slice()
								.reverse()
								.map((note) => (
									<option key={note} value={note}>
										{note}
									</option>
								))}
						</select>
					</div>

					<div className="text-center">
						<h2 className="text-lg font-semibold mb-2">Frets</h2>
						<input
							type="number"
							min={3}
							max={50}
							className="w-full px-3 py-1.5 rounded border border-black shadow-sm focus:outline-none focus:ring-1 focus:ring-black"
							value={frets}
							onChange={(e) => setFrets(Number(e.target.value))}
						/>
					</div>

					<div className="text-center">
						<h2 className="text-lg font-semibold mb-2">Mode</h2>
						<select
							className="w-full px-3 py-1.5 rounded border border-black shadow-sm focus:outline-none focus:ring-1 focus:ring-black truncate"
							value={mode}
							onChange={(e) => setMode(e.target.value as keyof typeof modes)}
						>
							{Object.keys(modes).map((mode) => (
								<option key={mode} value={mode}>
									{mode}
								</option>
							))}
						</select>
					</div>
				</div>
			</motion.div>
		</>
	);
}
