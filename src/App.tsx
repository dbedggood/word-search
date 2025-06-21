import { generate } from "random-words";
import { createSignal } from "solid-js";

const WORD_COUNT = 5;
const GRID_SIZE = 10;

function getRandomInt(max: number) {
	return Math.floor(Math.random() * max);
}

function createEmptyGrid(size: number) {
	return Array.from({ length: size }, () =>
		Array.from({ length: size }, () => ""),
	);
}

const [allowBackwards, setAllowBackwards] = createSignal(false);

function getDirections() {
	const base = [
		[0, 1], // right
		[1, 0], // down
		[1, 1], // diagonal down-right
		[-1, 1], // diagonal up-right
	];
	if (allowBackwards()) {
		return base.concat(base.map(([dr, dc]) => [-dr, -dc]));
	}
	return base;
}

function placeWords(grid: string[][], words: string[]) {
	const directions = getDirections();
	for (const word of words) {
		let placed = false;
		for (let attempts = 0; attempts < 100 && !placed; attempts++) {
			const dir = directions[getRandomInt(directions.length)];
			const row = getRandomInt(GRID_SIZE);
			const col = getRandomInt(GRID_SIZE);
			let fits = true;
			for (let i = 0; i < word.length; i++) {
				const r = row + dir[0] * i;
				const c = col + dir[1] * i;
				if (
					r < 0 ||
					r >= GRID_SIZE ||
					c < 0 ||
					c >= GRID_SIZE ||
					(grid[r][c] && grid[r][c] !== word[i])
				) {
					fits = false;
					break;
				}
			}
			if (fits) {
				for (let i = 0; i < word.length; i++) {
					const r = row + dir[0] * i;
					const c = col + dir[1] * i;
					grid[r][c] = word[i];
				}
				placed = true;
			}
		}
	}
}

function fillGridRandom(grid: string[][]) {
	const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	for (let r = 0; r < GRID_SIZE; r++) {
		for (let c = 0; c < GRID_SIZE; c++) {
			if (!grid[r][c]) {
				grid[r][c] = letters[getRandomInt(letters.length)];
			}
		}
	}
}

function generateRandomWords(): string[] {
	return (generate(WORD_COUNT) as string[]).map((word) => word.toUpperCase());
}

function App() {
	const [hiddenWords, setHiddenWords] = createSignal<string[]>(
		generateRandomWords(),
	);
	const [selected, setSelected] = createSignal<[number, number][]>([]);
	const [found, setFound] = createSignal<string[]>([]);
	const [grid, setGrid] = createSignal<string[][]>(getDefaultGrid());

	function getDefaultGrid() {
		const g = createEmptyGrid(GRID_SIZE);
		placeWords(g, hiddenWords());
		fillGridRandom(g);
		return g;
	}

	function handleCellClick(row: number, col: number) {
		const sel: [number, number][] = [...selected(), [row, col]];
		setSelected(sel);
		const word = sel.map(([r, c]) => grid()[r][c]).join("");
		const reversed = word.split("").reverse().join("");
		const matched = hiddenWords().find((w) => w === word || w === reversed);
		if (matched && !found().includes(matched)) {
			setFound([...found(), matched]);
			setSelected([]);
		} else if (word.length > Math.max(...hiddenWords().map((w) => w.length))) {
			setSelected([]);
		}
	}

	function isSelected(row: number, col: number) {
		return selected().some(([r, c]) => r === row && c === col);
	}

	function isFoundCell(row: number, col: number) {
		for (const word of found()) {
			for (let r = 0; r < GRID_SIZE; r++) {
				for (let c = 0; c < GRID_SIZE; c++) {
					for (const [dr, dc] of [
						[0, 1],
						[1, 0],
						[1, 1],
						[-1, 1],
					]) {
						let match = true;
						for (let i = 0; i < word.length; i++) {
							const rr = r + dr * i;
							const cc = c + dc * i;
							if (
								rr < 0 ||
								rr >= GRID_SIZE ||
								cc < 0 ||
								cc >= GRID_SIZE ||
								grid()[rr][cc] !== word[i]
							) {
								match = false;
								break;
							}
						}
						if (match) {
							for (let i = 0; i < word.length; i++) {
								const rr = r + dr * i;
								const cc = c + dc * i;
								if (rr === row && cc === col) return true;
							}
						}
						// check reversed
						match = true;
						for (let i = 0; i < word.length; i++) {
							const rr = r + dr * i;
							const cc = c + dc * i;
							if (
								rr < 0 ||
								rr >= GRID_SIZE ||
								cc < 0 ||
								cc >= GRID_SIZE ||
								grid()[rr][cc] !== word[word.length - 1 - i]
							) {
								match = false;
								break;
							}
						}
						if (match) {
							for (let i = 0; i < word.length; i++) {
								const rr = r + dr * i;
								const cc = c + dc * i;
								if (rr === row && cc === col) return true;
							}
						}
					}
				}
			}
		}
		return false;
	}

	function resetGame() {
		setHiddenWords(generateRandomWords());
		setGrid(getDefaultGrid());
		setSelected([]);
		setFound([]);
	}

	return (
		<div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
			<h1 class="text-3xl font-bold mb-4">Word Search Game</h1>
			<div class="mb-2">
				<label class="flex items-center gap-2">
					<input
						type="checkbox"
						checked={allowBackwards()}
						onInput={(e) => {
							setAllowBackwards(e.currentTarget.checked);
							resetGame();
						}}
					/>
					Allow Backwards Words
				</label>
			</div>
			<div class="mb-4">
				Words to find:
				<ul class="flex gap-4 mt-2">
					{hiddenWords().map((word) => (
						<li
							class={
								found().includes(word) ? "line-through text-green-600" : ""
							}
						>
							{word}
						</li>
					))}
				</ul>
			</div>
			<div
				class="grid"
				style={`grid-template-columns: repeat(${GRID_SIZE}, 2rem);`}
			>
				{grid().map((row, r) =>
					row.map((cell, c) => (
						<button
							type="button"
							class={`w-8 h-8 border border-gray-400 flex items-center justify-center font-mono text-lg
                                ${isSelected(r, c) ? "bg-yellow-300" : ""}
                                ${isFoundCell(r, c) ? "bg-green-300" : ""}
                            `}
							onClick={() => handleCellClick(r, c)}
						>
							{cell}
						</button>
					)),
				)}
			</div>
			<div class="mt-6">
				<button type="button" class="btn" onClick={resetGame}>
					Restart Game
				</button>
			</div>
			{found().length === hiddenWords().length && (
				<div class="mt-4 text-xl text-green-700 font-bold">
					You found all the words!
				</div>
			)}
		</div>
	);
}

export default App;
