import { create } from "zustand";
import { persist } from "zustand/middleware";

const useBookmarksState = create(persist(
	(setState, getState) => ({
		bookmarks: [],
		toggle: (key) => {
			const { bookmarks } = getState();
			const next = bookmarks.includes(key)
				? bookmarks.filter((b) => b !== key)
				: [...bookmarks, key];
			setState({ bookmarks: next });
		},
		isBookmarked: (key) => getState().bookmarks.includes(key),
	}),
	{
		name: "sgarden-bookmarks",
	},
));

export default useBookmarksState;
