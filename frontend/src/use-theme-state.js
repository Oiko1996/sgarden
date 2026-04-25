import { create } from "zustand";
import { persist } from "zustand/middleware";

const useThemeState = create(persist(
	(setState, getState) => ({
		mode: "light",
		setMode: (mode) => setState({ mode }),
		toggleMode: () => setState({ mode: getState().mode === "light" ? "dark" : "light" }),
	}),
	{
		name: "sgarden-theme",
	},
));

export default useThemeState;
