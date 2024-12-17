import { useEffect, useState } from "react";
import useGameState from "../state/useGameState";
import "../styles/GameCanvas.scss";

const GameCanvas = () => {
	const playerPosition = useGameState((state) => state.playerPosition);
	const backgroundImage = useGameState((state) => state.backgroundImage);
	const areas = useGameState((state) => state.areas);
	const currentArea = useGameState((state) => state.currentArea);
	const movePlayer = useGameState((state) => state.movePlayer);
	const transitionArea = useGameState((state) => state.transitionArea);

	// State to handle player sprite
	const [spriteDirection, setSpriteDirection] = useState("down"); // Default direction

	// Get the transition points for the current area
	const transitionPoints = areas[currentArea]?.transitionPoints || [];

	// Handle keypress for movement
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			switch (event.key) {
				case "ArrowUp":
					movePlayer("up");
					setSpriteDirection("up");
					break;
				case "ArrowDown":
					movePlayer("down");
					setSpriteDirection("down");
					break;
				case "ArrowLeft":
					movePlayer("left");
					setSpriteDirection("left");
					break;
				case "ArrowRight":
					movePlayer("right");
					setSpriteDirection("right");
					break;
				default:
					break;
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [movePlayer]);

	// Trigger area transition when player reaches a transition point
	useEffect(() => {
		transitionArea();
	}, [playerPosition, transitionArea]);

	// Calculate position based on grid (e.g., 50px per grid unit)
	const gridSize = 50; // Size of one grid cell in pixels

	return (
		<div
			className="game-canvas"
			style={{
				backgroundImage: `url(${backgroundImage})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
			}}
		>
			{/* Render the player */}
			<div
				className={`player player-${spriteDirection}`} // Add class for sprite direction
				style={{
					left: `${playerPosition.x * gridSize}px`,
					top: `${playerPosition.y * gridSize}px`,
				}}
			/>

			{/* Render transition points */}
			{transitionPoints.map((point, index) => (
				<div
					key={index}
					className="transition-point"
					style={{
						left: `${point.x * gridSize}px`,
						top: `${point.y * gridSize}px`,
					}}
				/>
			))}

			{/* Render the area name */}
			<div className="area-name">{areas[currentArea]?.name}</div>
		</div>
	);
};

export default GameCanvas;
