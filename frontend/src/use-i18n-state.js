import { create } from "zustand";
import { persist } from "zustand/middleware";

const SUPPORTED = ["en", "el"];

const useI18nState = create(persist(
	(setState) => ({
		lang: "en",
		setLang: (lang) => {
			const next = SUPPORTED.includes(lang) ? lang : "en";
			setState({ lang: next });
		},
	}),
	{
		name: "sgarden-i18n",
	},
));

export default useI18nState;
