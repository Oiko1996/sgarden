import useI18nState from "../use-i18n-state.js";

const dictionaries = {
	en: {
		"home": "Home",
		"profile": "Profile",
		"settings": "Settings",
		"logout": "Logout",
		"dashboard": "Dashboard",
		"analytics": "Analytics",
		"notes": "Notes",
		"compare": "Compare",
		"language": "Language",
	},
	el: {
		"home": "Αρχική",
		"profile": "Προφίλ",
		"settings": "Ρυθμίσεις",
		"logout": "Αποσύνδεση",
		"dashboard": "Πίνακας",
		"analytics": "Αναλυτικά",
		"notes": "Σημειώσεις",
		"compare": "Σύγκριση",
		"language": "Γλώσσα",
	},
};

export const t = (key) => {
	const { lang } = useI18nState.getState();
	const dict = dictionaries[lang] || dictionaries.en;
	if (Object.prototype.hasOwnProperty.call(dict, key)) {
		return dict[key];
	}

	return dictionaries.en[key] || key;
};

export const useTranslation = () => {
	const lang = useI18nState((state) => state.lang);
	const translate = (key) => {
		const dict = dictionaries[lang] || dictionaries.en;
		if (Object.prototype.hasOwnProperty.call(dict, key)) {
			return dict[key];
		}

		return dictionaries.en[key] || key;
	};

	return { t: translate, lang };
};

export default t;
