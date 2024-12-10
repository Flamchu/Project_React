import { useEffect } from "react";
import GameCanvas from "./components/GameCanvas";
import useGameState from "./state/useGameState";
import "./App.scss";

function App() {
	const loadGameData = useGameState((state) => state.loadGameData);

	useEffect(() => {
		loadGameData();
	}, [loadGameData]);

	return <GameCanvas />;
}

export default App;
