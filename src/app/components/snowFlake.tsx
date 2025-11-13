import React, { useEffect, useState } from "react";
import { Snowflake } from "lucide-react";

interface Flake {
	id: number;
	left: number;
	delay: number;
	duration: number;
	size: number;
	drift: number;
}
interface SnowFlakeProps {
	enabled: boolean;
}
const SnowFlake: React.FC<SnowFlakeProps> = ({ enabled }) => {
	const [flakes, setFlakes] = useState<Flake[]>([]);

	useEffect(() => {
		if (!enabled) return;
		const interval = setInterval(() => {
			const id = Date.now();

			const newFlake: Flake = {
				id,
				left: Math.random() * window.innerWidth,
				delay: Math.random() * 2,
				duration: 5 + Math.random() * 4,
				size: 16 + Math.random() * 24,
				drift: (Math.random() - 0.5) * 200,
			};

			setFlakes((prev) => [...prev, newFlake]);

			setTimeout(
				() => {
					setFlakes((prev) => prev.filter((f) => f.id !== id));
				},
				(newFlake.duration + newFlake.delay) * 1000,
			);
		}, 350);

		return () => clearInterval(interval);
	}, [enabled]);

	return (
		<div className="pointer-events-none fixed -top-10 left-0 w-full h-[110vh] overflow-hidden z-[9999]">
			{flakes.map((flake) => (
				<Snowflake
					key={flake.id}
					className="absolute text-white opacity-80"
					style={{
						left: flake.left,
						width: flake.size,
						height: flake.size,
						transform: `translateX(${flake.drift}px)`,
						animation: `
      spin 4s linear infinite,
      fall ${flake.duration}s linear ${flake.delay}s forwards
    `,
					}}
				/>
			))}
		</div>
	);
};

export default SnowFlake;
