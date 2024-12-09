import React, { useRef, useEffect } from "react";
import useGameState from "../state/useGameState";
import Player from "./Player";

const GameCanvas = () => {
	const { currentArea, playerPosition, areas, movePlayer, transitionArea, tasks } = useGameState();
	const canvasRef = useRef<HTMLDivElement>(null);

	// focus the canvas when it renders
	useEffect(() => {
		if (canvasRef.current) {
			canvasRef.current.focus();
		}
	}, []);

	// handle movement
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "ArrowUp") movePlayer("up");
		if (e.key === "ArrowDown") movePlayer("down");
		if (e.key === "ArrowLeft") movePlayer("left");
		if (e.key === "ArrowRight") movePlayer("right");
		transitionArea();
	};

	// define area
	const area = areas[currentArea];
	const currentTasks = tasks[currentArea] || [];

	return (
		<div
			ref={canvasRef}
			tabIndex={0} // makes div focusable
			onKeyDown={handleKeyDown}
			className="w-screen h-screen outline-none relative bg-gray-200"
		>
			<h1 className="absolute top-0 left-0 p-4">{area?.name || "Loading..."}</h1>
			<div className="relative w-full h-full">
				<Player position={playerPosition} />
				{currentTasks.map((task) =>
					!task.completed ? (
						<div
							key={task.id}
							className="absolute bg-green-500 text-white text-xs p-1 rounded"
							style={{
								top: `${task.id * 20}px`,
								left: "50%",
							}}
						>
							{task.description}
						</div>
					) : null
				)}
			</div>
		</div>
	);
};

export default GameCanvas;
