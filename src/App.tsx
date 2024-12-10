import { useEffect } from "react";
import GameCanvas from "./components/GameCanvas";
import useGameState from "./state/useGameState";
import './App.scss'
import peceny from "./assets/pernik_peceny.jpg"
import vareny from "./assets/pernik-vareny.png"


const App = () => {
	const loadGameData = useGameState((state) => state.loadGameData);

	useEffect(() => {
		loadGameData();
	}, [loadGameData]);
  return (
    <>
      <div className='landing-page'>
        <h1>Vítejte ve Světě Perníku</h1>
      <p>toto je tvá poslední šance odejít</p>
      <button>Jdu na to!</button>
      <img src={vareny} alt=""  className='landing-page-img landing-page-img-1'/>
      <img src={peceny} alt=""  className='landing-page-img landing-page-img-2'/>
      
      </div>
    </>
  )
}

	return <GameCanvas />;
};

export default App;
