import express from "express";
import mongoose from "mongoose";

import { Report } from "../models/index.js";

const router = express.Router({ mergeParams: true });

const ALLOWED_CHART_TYPES = new Set(["bar", "line", "pie"]);

const requireAuth = (_req, res, next) => {
	const user = res.locals.user;
	if (!user || !user._id) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	return next();
};

const sanitizeConfig = (raw) => {
	if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
	return raw;
};

router.get("/", requireAuth, async (_req, res) => {
	try {
		const userId = res.locals.user._id;
		const rows = await Report.find({ user: userId })
			.sort({ createdAt: -1 })
			.lean();

		return res.json({ success: true, rows });
	} catch {
		return res.status(500).json({ message: "Something went wrong." });
	}
});

router.post("/", requireAuth, async (req, res) => {
	try {
		const userId = res.locals.user._id;
		const { title, chartType, config } = req.body || {};

		const trimmedTitle = typeof title === "string" ? title.trim() : "";
		if (!trimmedTitle) {
			return res.status(400).json({ message: "Title is required." });
		}

		const safeChartType = ALLOWED_CHART_TYPES.has(chartType) ? chartType : "bar";

		const created = await Report.create({
			user: userId,
			title: trimmedTitle.slice(0, 200),
			chartType: safeChartType,
			config: sanitizeConfig(config),
		});

		return res.status(201).json({ success: true, report: created.toObject() });
	} catch {
		return res.status(500).json({ message: "Something went wrong." });
	}
});

router.delete("/:id", requireAuth, async (req, res) => {
	try {
		const userId = res.locals.user._id;
		const { id } = req.params;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: "Invalid id." });
		}

		const result = await Report.findOneAndDelete({ _id: id, user: userId }).lean();
		if (!result) {
			return res.status(404).json({ message: "Report not found." });
		}

		return res.json({ success: true });
	} catch {
		return res.status(500).json({ message: "Something went wrong." });
	}
});

export default router;
