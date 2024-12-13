import React, { useRef, useEffect, useState } from "react";
import useGameState from "../state/useGameState";
import Player from "./Player";

const GameCanvas = () => {
	const { currentArea, playerPosition, areas, movePlayer, transitionArea, tasks } = useGameState();
	const canvasRef = useRef<HTMLDivElement>(null);

	const backgroundImage = "url('../../fotky-pro-Erika/hlavak.png')";
	const jelen = "url('../../fotky-pro-Erika/jelen.png')";

	const [isModalOpen, setIsModalOpen] = useState(true);
	
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
			style={{
				backgroundImage: backgroundImage,
				backgroundSize: "cover",
				backgroundPosition: "center",
			  }}
		>
			<h1 className="absolute top-0 left-0 p-4">{area?.name || "Loading..."}</h1>
			<div className="relative w-full h-full">

			<div
				style={{
					position: "absolute",
					top: "70%",
					left: "55%",
					transform: "translateX(-50%)", 
					width: "150px",
					height: "150px",
					backgroundImage: jelen, 
					backgroundSize: "contain",
					backgroundRepeat: "no-repeat",
				}}
			></div>

		{isModalOpen && (
          <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-gray-500 bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-xl font-bold">Jelen</h2>
              <p>Úžasný jelen se ti ukázal!</p>
              <button
                className="mt-4 p-2 bg-blue-500 text-white rounded"
                onClick={() => setIsModalOpen(false)} // Close the modal
              >
                Zavřít
              </button>
            </div>
          </div>
        )}

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