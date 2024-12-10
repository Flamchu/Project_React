import { useEffect, useState } from "react";
import GameCanvas from "./components/GameCanvas";
import useGameState from "./state/useGameState";
import "./App.scss";
import peceny from "./assets/pernik_peceny.jpg";
import vareny from "./assets/pernik-vareny.png";

const App = () => {
	const loadGameData = useGameState((state) => state.loadGameData);
	const [isGameLoaded, setIsGameLoaded] = useState(false);

	useEffect(() => {
		loadGameData();
	}, [loadGameData]);

	const loadGameCanvas = () => {
		setIsGameLoaded(true); // switch to game canvas
	};

	if (isGameLoaded) {
		return <GameCanvas />; // render canvas on button click
	}

	// landing page
	return (
		<div className="landing-page">
			<h1>Vítejte ve Světě Perníku</h1>
			<p>Toto je tvá poslední šance odejít</p>
			<button onClick={loadGameCanvas}>Jdu na to!</button>
			<img src={vareny} alt="Perník vařený" className="landing-page-img landing-page-img-1" />
			<img src={peceny} alt="Perník pečený" className="landing-page-img landing-page-img-2" />
		</div>
	);
};

export default App;
