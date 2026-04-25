import express from "express";

import { SalesRecord } from "../models/index.js";

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
	if (typeof body.category === "string") payload.category = body.category.trim();
	if (body.month !== undefined && body.month !== null && body.month !== "") {
		const month = Number.parseInt(body.month, 10);
		if (Number.isFinite(month)) payload.month = month;
	}

	if (body.year !== undefined && body.year !== null && body.year !== "") {
		const year = Number.parseInt(body.year, 10);
		if (Number.isFinite(year)) payload.year = year;
	}

	if (body.value !== undefined && body.value !== null && body.value !== "") {
		const value = Number.parseFloat(body.value);
		if (Number.isFinite(value)) payload.value = value;
	}

	if (typeof body.unit === "string") payload.unit = body.unit.trim();
	if (typeof body.notes === "string") payload.notes = body.notes.trim();
	return payload;
};

router.use(requireUser);

router.get("/", async (_req, res) => {
	try {
		const userId = res.locals.user._id;
		const rows = await SalesRecord.find({ user: userId })
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
		if (!payload.category || !payload.month || !payload.year || payload.value === undefined) {
			return res.status(400).json({ success: false, message: "Missing required fields" });
		}

		const created = await SalesRecord.create({ user: userId, ...payload });
		return res.json({ success: true, record: created.toObject() });
	} catch (error) {
		return res.status(500).json({ message: "Something went wrong." });
	}
});

router.put("/:id", async (req, res) => {
	try {
		const userId = res.locals.user._id;
		const { id } = req.params;
		const payload = sanitizePayload(req.body || {});
		const updated = await SalesRecord.findOneAndUpdate(
			{ _id: id, user: userId },
			{ $set: payload },
			{ new: true },
		).lean();
		if (!updated) {
			return res.status(404).json({ success: false, message: "Record not found" });
		}

		return res.json({ success: true, record: updated });
	} catch (error) {
		return res.status(500).json({ message: "Something went wrong." });
	}
});

router.delete("/:id", async (req, res) => {
	try {
		const userId = res.locals.user._id;
		const { id } = req.params;
		const deleted = await SalesRecord.findOneAndDelete({ _id: id, user: userId });
		if (!deleted) {
			return res.status(404).json({ success: false, message: "Record not found" });
		}

		return res.json({ success: true });
	} catch (error) {
		return res.status(500).json({ message: "Something went wrong." });
	}
});

export default router;
