<<<<<<< HEAD
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import "./index.css";
import App from "./App.tsx";
=======
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import App from './App.tsx'
>>>>>>> d9e5b5d (sex)

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ChakraProvider value={defaultSystem}>
			<App />
		</ChakraProvider>
	</StrictMode>
);
