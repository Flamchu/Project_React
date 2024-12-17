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
	backgroundImage: string;
	movePlayer: (direction: "up" | "down" | "left" | "right") => void;
	transitionArea: () => void;
	completeTask: (taskId: number) => void;
	loadGameData: () => Promise<void>;
}

const useGameState = create<GameState>((set, get) => ({
	playerPosition: { x: 5, y: 5 },
	currentArea: "delta-skola",
	tasks: {},
	areas: {},
	backgroundImage: new URL("../assets/areas/delta-skola.png", import.meta.url).href, // Use dynamic import for default image
	movePlayer: (direction) => {
		const { playerPosition } = get();
		const step = 1; // Movement in pixels
		const newPos = { ...playerPosition };

		if (direction === "up") newPos.y = Math.max(0, newPos.y - step);
		if (direction === "down") newPos.y = Math.min(window.innerHeight - 50, newPos.y + step); // Stay within screen height
		if (direction === "left") newPos.x = Math.max(0, newPos.x - step);
		if (direction === "right") newPos.x = Math.min(window.innerWidth - 50, newPos.x + step); // Stay within screen width

		set({ playerPosition: newPos });
	},
	transitionArea: async () => {
		const { playerPosition, areas, currentArea } = get();
		const area = areas[currentArea];

		if (!area) return; // If area data is not loaded, return early

		// Check if player is at a transition point
		const transition = area.transitionPoints.find((tp) => tp.x === playerPosition.x && tp.y === playerPosition.y);

		if (transition) {
			const newArea = transition.targetArea;

			set({
				currentArea: newArea,
				playerPosition: { x: 5, y: 5 }, // Reset player position to default for the new area
				backgroundImage: new URL(`../assets/areas/${newArea}.png`, import.meta.url).href, // Update background for new area
			});

			await axios.patch("/api/player", { currentArea: newArea });
		}
	},

	completeTask: async (taskId) => {
		const { tasks, currentArea } = get();
		const updatedTasks = tasks[currentArea]?.map((task) => (task.id === taskId ? { ...task, completed: true } : task));

		set({
			tasks: {
				...tasks,
				[currentArea]: updatedTasks || [],
			},
		});

		await axios.patch(`/api/tasks/${currentArea}`, {
			completedTasks: updatedTasks?.filter((task) => task.completed) || [],
		});
	},
	loadGameData: async () => {
		const [areasRes, tasksRes, playerRes] = await Promise.all([axios.get("/api/areas"), axios.get("/api/tasks"), axios.get("/api/player")]);

		const currentArea = playerRes.data?.currentArea || "delta-skola";

		set({
			areas: areasRes.data.reduce((acc: Record<string, Area>, area: Area) => {
				acc[area.id] = area;
				return acc;
			}, {}),
			tasks: tasksRes.data,
			playerPosition: { x: 5, y: 5 },
			currentArea: currentArea,
			backgroundImage: new URL(`../assets/areas/${currentArea}.png`, import.meta.url).href, // Set initial background
		});
	},
}));

export default useGameState;
