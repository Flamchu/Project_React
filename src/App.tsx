import { useEffect } from "react";
import GameCanvas from "./components/GameCanvas";
import useGameState from "./state/useGameState";

const App = () => {
	const loadGameData = useGameState((state) => state.loadGameData);

	useEffect(() => {
		loadGameData();
	}, [loadGameData]);

	return <GameCanvas />;
};

export default App;
