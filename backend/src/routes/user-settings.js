import express from "express";

import { UserSettings } from "../models/index.js";

const router = express.Router({ mergeParams: true });

const ALLOWED_DASHBOARDS = new Set(["dashboard", "dashboard1", "dashboard2"]);
const ALLOWED_DATE_FORMATS = new Set(["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"]);
const PAGE_SIZE_MIN = 1;
const PAGE_SIZE_MAX = 1000;

const requireAuth = (_req, res, next) => {
	const user = res.locals.user;
	if (!user || !user._id) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	return next();
};

const sanitizePageSize = (raw) => {
	const parsed = Number.parseInt(raw, 10);
	if (!Number.isFinite(parsed)) return null;
	if (parsed < PAGE_SIZE_MIN) return PAGE_SIZE_MIN;
	if (parsed > PAGE_SIZE_MAX) return PAGE_SIZE_MAX;
	return parsed;
};

const sanitizePayload = (body) => {
	const update = {};
	if (body && typeof body === "object") {
		const pageSize = sanitizePageSize(body.pageSize);
		if (pageSize !== null) update.pageSize = pageSize;
		if (typeof body.defaultDashboard === "string" && ALLOWED_DASHBOARDS.has(body.defaultDashboard)) {
			update.defaultDashboard = body.defaultDashboard;
		}

		if (typeof body.dateFormat === "string" && ALLOWED_DATE_FORMATS.has(body.dateFormat)) {
			update.dateFormat = body.dateFormat;
		}

		if (typeof body.sidebarCollapsed === "boolean") {
			update.sidebarCollapsed = body.sidebarCollapsed;
		}
	}

	return update;
};

router.get("/me", requireAuth, async (_req, res) => {
	try {
		const userId = res.locals.user._id;
		const existing = await UserSettings.findOne({ user: userId }).lean();
		if (existing) {
			return res.json({ success: true, settings: existing });
		}

		const created = await UserSettings.create({ user: userId });
		return res.json({ success: true, settings: created.toObject() });
	} catch {
		return res.status(500).json({ message: "Something went wrong." });
	}
});

router.put("/me", requireAuth, async (req, res) => {
	try {
		const userId = res.locals.user._id;
		const update = sanitizePayload(req.body);

		const settings = await UserSettings.findOneAndUpdate(
			{ user: userId },
			{ $set: update },
			{ new: true, upsert: true, setDefaultsOnInsert: true },
		).lean();

		return res.json({ success: true, settings });
	} catch {
		return res.status(500).json({ message: "Something went wrong." });
	}
});

export default router;
