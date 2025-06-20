import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
	base: "/word-search/",
	plugins: [solid(), tailwindcss()],
});
