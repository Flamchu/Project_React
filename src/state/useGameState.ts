import { create } from "zustand";

interface Position {
	x: number;
	y: number;
}

interface Area {
	id: string;
	name: string;
	transitionPoints: { x: number; y: number; targetArea: string }[];
}

interface Task {
	id: number;
	description: string;
	completed: boolean;
}

interface GameState {
	playerPosition: Position;
	currentArea: string;
	tasks: Record<string, Task[]>;
	areas: Record<string, Area>;
	movePlayer: (direction: "up" | "down" | "left" | "right") => void;
	transitionArea: () => void;
	completeTask: (area: string, taskId: number) => void;
}

const useGameState = create<GameState>((set, get) => ({
	playerPosition: { x: 5, y: 5 },
	currentArea: "square",
	tasks: {
		square: [{ id: 1, description: "Talk to the NPC", completed: false }],
		park: [{ id: 2, description: "Collect the flower", completed: false }],
	},
	areas: {
		square: {
			id: "square",
			name: "Main Square",
			transitionPoints: [{ x: 10, y: 5, targetArea: "park" }],
		},
		park: {
			id: "park",
			name: "Park",
			transitionPoints: [{ x: 0, y: 5, targetArea: "square" }],
		},
	},
	movePlayer: (direction) => {
		const { playerPosition, areas, currentArea } = get();
		const area = areas[currentArea];
		const newPos = { ...playerPosition };
		if (direction === "up") newPos.y = Math.max(0, newPos.y - 1);
		if (direction === "down") newPos.y = Math.min(10, newPos.y + 1);
		if (direction === "left") newPos.x = Math.max(0, newPos.x - 1);
		if (direction === "right") newPos.x = Math.min(10, newPos.x + 1);
		set({ playerPosition: newPos });
	},
	transitionArea: () => {
		const { playerPosition, areas, currentArea } = get();
		const area = areas[currentArea];
		const transition = area.transitionPoints.find((tp) => tp.x === playerPosition.x && tp.y === playerPosition.y);
		if (transition) {
			set({ currentArea: transition.targetArea, playerPosition: { x: 5, y: 5 } });
		}
	},
	completeTask: (area, taskId) => {
		const { tasks } = get();
		const updatedTasks = tasks[area].map((task) => (task.id === taskId ? { ...task, completed: true } : task));
		set({ tasks: { ...tasks, [area]: updatedTasks } });
	},
}));
export default useGameState;
