import { createSignal } from "solid-js";

function App() {
	const [count, setCount] = createSignal(0);

	return (
		<>
			<div class="flex flex-col items-center justify-center min-h-screen">
				<h1 class="text-3xl font-bold underline mb-8"> Hello world! </h1>
				<button
					type="button"
					onClick={() => setCount((count) => count + 1)}
					class="btn mb-8"
				>
					count is {count()}
				</button>
				<button type="button" onClick={() => setCount(0)} class="btn mb-8">
					Reset
				</button>
			</div>
		</>
	);
}

export default App;
