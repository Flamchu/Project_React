import React from "react";

interface PlayerProps {
	position: { x: number; y: number };
}

const Player: React.FC<PlayerProps> = ({ position }) => {
	return (
		<div
			className="absolute bg-blue-500 w-5 h-5"
			style={{
				left: `${position.x * 10}%`,
				top: `${position.y * 10}%`,
			}}
		></div>
	);
};

export default Player;
