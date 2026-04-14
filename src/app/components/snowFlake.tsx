import React, { useEffect, useState } from "react";

interface Flake {
	id: number;
	left: number;
	delay: number;
	duration: number;
	size: number;
	drift: number;
}

interface ShurikenRainProps {
	enabled: boolean;
}

const ShurikenRain: React.FC<ShurikenRainProps> = ({ enabled }) => {
	const [flakes, setFlakes] = useState<Flake[]>([]);

	useEffect(() => {
		if (!enabled) return;

		const interval = setInterval(() => {
			const id = Date.now() + Math.random(); // Added random to ensure unique IDs

			const newFlake: Flake = {
				id,
				left: Math.random() * window.innerWidth,
				delay: Math.random() * 2,
				duration: 3 + Math.random() * 3, // Slightly faster for shurikens
				size: 14 + Math.random() * 4, // Keeps it within your 12-18px range
				drift: (Math.random() - 0.5) * 300,
			};

			setFlakes((prev) => [...prev, newFlake]);

			setTimeout(
				() => {
					setFlakes((prev) => prev.filter((f) => f.id !== id));
				},
				(newFlake.duration + newFlake.delay) * 1000,
			);
		}, 250); // Faster interval for a more intense effect

		return () => clearInterval(interval);
	}, [enabled]);

	return (
		<div className="pointer-events-none fixed -top-10 left-0 w-full h-[110vh] overflow-hidden z-[9999]">
			{flakes.map((flake) => (
				<div
					key={flake.id}
					className="absolute"
					style={{
						left: flake.left,
						// This div only handles falling and the sideways drift
						animation: `fall ${flake.duration}s linear ${flake.delay}s forwards`,
					}}
				>
					<img
						src="/shuriken.png"
						alt="tetas gordas"
						className="opacity-90"
						style={{
							width: `${flake.size*3}px`,
							height: `${flake.size*3}px`,
							objectFit: "contain",
							// This image only handles the spinning
							// It also applies the horizontal drift here 
							transform: `translateX(${flake.drift}px)`,
							animation: `spin 0.6s linear infinite`,
						}}
					/>
				</div>
			))}
		</div>
	);
};

export default ShurikenRain;
