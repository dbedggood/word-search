import { createSignal } from "solid-js";
import viteLogo from "/vite.svg";
import solidLogo from "./assets/solid.svg";
import "./App.css";

function App() {
	const [count, setCount] = createSignal(0);

	return (
		<>
			<h1 class="text-3xl font-bold underline"> Hello world! </h1>
			<div class="flex justify-center gap-4">
				<a href="https://vite.dev" target="_blank" rel="noopener">
					<img src={viteLogo} class="logo" alt="Vite logo" />
				</a>
				<a href="https://solidjs.com" target="_blank" rel="noopener">
					<img src={solidLogo} class="logo solid" alt="Solid logo" />
				</a>
			</div>
			<h1>Vite + Solid</h1>
			<div class="card">
				<button type="button" onClick={() => setCount((count) => count + 1)}>
					count is {count()}
				</button>
				<p>
					Edit <code>src/App.tsx</code> and save to test HMR
				</p>
			</div>
			<p class="read-the-docs">
				Click on the Vite and Solid logos to learn more
			</p>
		</>
	);
}

export default App;
