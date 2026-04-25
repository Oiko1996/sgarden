import express from "express";

import { AlertRule } from "../models/index.js";

const router = express.Router({ mergeParams: true });

const ALLOWED_OPERATORS = new Set([">", "<", ">=", "<="]);

const requireUser = (_req, res, next) => {
	const user = res.locals.user;
	if (!user || !user._id) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	return next();
};

const sanitizePayload = (body) => {
	const payload = {};
	if (typeof body.metric === "string") payload.metric = body.metric.trim();
	if (typeof body.operator === "string" && ALLOWED_OPERATORS.has(body.operator)) {
		payload.operator = body.operator;
	}

	if (body.threshold !== undefined && body.threshold !== null && body.threshold !== "") {
		const threshold = Number.parseFloat(body.threshold);
		if (Number.isFinite(threshold)) payload.threshold = threshold;
	}

	return payload;
};

router.use(requireUser);

router.get("/", async (_req, res) => {
	try {
		const userId = res.locals.user._id;
		const rows = await AlertRule.find({ user: userId })
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
		if (!payload.metric || !payload.operator || payload.threshold === undefined) {
			return res.status(400).json({ success: false, message: "Missing required fields" });
		}

		const created = await AlertRule.create({ user: userId, ...payload });
		return res.json({ success: true, rule: created.toObject() });
	} catch (error) {
		return res.status(500).json({ message: "Something went wrong." });
	}
});

router.put("/:id", async (req, res) => {
	try {
		const userId = res.locals.user._id;
		const { id } = req.params;
		const payload = sanitizePayload(req.body || {});
		const updated = await AlertRule.findOneAndUpdate(
			{ _id: id, user: userId },
			{ $set: payload },
			{ new: true },
		).lean();
		if (!updated) {
			return res.status(404).json({ success: false, message: "Rule not found" });
		}

		return res.json({ success: true, rule: updated });
	} catch (error) {
		return res.status(500).json({ message: "Something went wrong." });
	}
});

router.delete("/:id", async (req, res) => {
	try {
		const userId = res.locals.user._id;
		const { id } = req.params;
		const deleted = await AlertRule.findOneAndDelete({ _id: id, user: userId });
		if (!deleted) {
			return res.status(404).json({ success: false, message: "Rule not found" });
		}

		return res.json({ success: true });
	} catch (error) {
		return res.status(500).json({ message: "Something went wrong." });
	}
});

export default router;
