import { create } from "zustand";
import axios from "axios";

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
	completeTask: (taskId: number) => void;
	loadGameData: () => Promise<void>;
}

const useGameState = create<GameState>((set, get) => ({
	playerPosition: { x: 5, y: 5 },
	currentArea: "square",
	tasks: {},
	areas: {},
	movePlayer: async (direction) => {
		const { playerPosition } = get();
		const newPos = { ...playerPosition };

		if (direction === "up") newPos.y = Math.max(0, newPos.y - 1);
		if (direction === "down") newPos.y = Math.min(10, newPos.y + 1);
		if (direction === "left") newPos.x = Math.max(0, newPos.x - 1);
		if (direction === "right") newPos.x = Math.min(10, newPos.x + 1);

		set({ playerPosition: newPos });

		await axios.patch("/api/player", { position: newPos });
	},
	transitionArea: async () => {
		const { playerPosition, areas, currentArea } = get();
		const area = areas[currentArea];
		const transition = area.transitionPoints.find((tp) => tp.x === playerPosition.x && tp.y === playerPosition.y);

		if (transition) {
			set({ currentArea: transition.targetArea, playerPosition: { x: 5, y: 5 } });

			await axios.patch("/api/player", {
				currentArea: transition.targetArea,
				position: { x: 5, y: 5 },
			});
		}
	},
	completeTask: async (taskId) => {
		const { tasks, currentArea } = get();
		const updatedTasks = tasks[currentArea].map((task) => (task.id === taskId ? { ...task, completed: true } : task));

		set({ tasks: { ...tasks, [currentArea]: updatedTasks } });

		await axios.patch(`/api/tasks/${currentArea}`, updatedTasks);
	},
	loadGameData: async () => {
		const [areasRes, tasksRes, playerRes] = await Promise.all([axios.get("/api/areas"), axios.get("/api/tasks"), axios.get("/api/player")]);

		set({
			areas: areasRes.data.reduce((acc: Record<string, Area>, area: Area) => {
				acc[area.id] = area;
				return acc;
			}, {}),
			tasks: tasksRes.data,
			playerPosition: playerRes.data.position,
			currentArea: playerRes.data.currentArea,
		});
	},
}));

export default useGameState;
