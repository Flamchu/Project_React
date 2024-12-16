import { useEffect, useState } from "react";
import GameCanvas from "./components/GameCanvas";
import useGameState from "./state/useGameState";
import "./styles/App.scss";
import peceny from "./assets/pernik_peceny.jpg";
import vareny from "./assets/pernik-vareny.png";

const App = () => {
	const loadGameData = useGameState((state) => state.loadGameData);
	const [isGameLoaded, setIsGameLoaded] = useState(false);

	// Load game data from the JSON server when the app initializes
	useEffect(() => {
		loadGameData();
	}, [loadGameData]);

	// Function to start the game
	const startGame = () => {
		setIsGameLoaded(true);
	};

	// Render the game canvas when the game starts
	if (isGameLoaded) {
		return <GameCanvas />;
	}

	// Render the landing page
	return (
		<div className="landing-page">
			<h1>Vítejte ve Světě Perníku</h1>
			<p>Toto je tvá poslední šance odejít</p>
			<button onClick={startGame}>Jdu na to!</button>
			<img src={vareny} alt="Perník vařený" className="landing-page-img landing-page-img-1" />
			<img src={peceny} alt="Perník pečený" className="landing-page-img landing-page-img-2" />
		</div>
	);
};

export default App;
