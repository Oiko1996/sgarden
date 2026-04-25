import express from "express";

import { MapDataEntry } from "../models/index.js";

const router = express.Router({ mergeParams: true });

const requireUser = (_req, res, next) => {
	const user = res.locals.user;
	if (!user || !user._id) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	return next();
};

const sanitizePayload = (body) => {
	const payload = {};
	if (typeof body.regionName === "string") payload.regionName = body.regionName.trim();
	if (typeof body.category === "string") payload.category = body.category.trim();
	if (body.revenue !== undefined && body.revenue !== null && body.revenue !== "") {
		const revenue = Number.parseFloat(body.revenue);
		if (Number.isFinite(revenue)) payload.revenue = revenue;
	}

	return payload;
};

router.use(requireUser);

router.get("/", async (_req, res) => {
	try {
		const userId = res.locals.user._id;
		const rows = await MapDataEntry.find({ user: userId })
			.sort({ createdAt: -1 })
			.limit(500)
			.lean();
		return res.json({ success: true, rows });
	} catch (error) {
		return res.status(500).json({ message: "Something went wrong." });
	}
});

router.post("/", async (req, res) => {
	try {
		const userId = res.locals.user._id;
		const payload = sanitizePayload(req.body || {});
		if (!payload.regionName || !payload.category || payload.revenue === undefined) {
			return res.status(400).json({ success: false, message: "Missing required fields" });
		}

		const created = await MapDataEntry.create({ user: userId, ...payload });
		return res.json({ success: true, entry: created.toObject() });
	} catch (error) {
		return res.status(500).json({ message: "Something went wrong." });
	}
});

export default router;
