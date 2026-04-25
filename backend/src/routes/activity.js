import express from "express";

import { Activity, User } from "../models/index.js";

const router = express.Router({ mergeParams: true });

const requireAdmin = (req, res, next) => {
	const user = res.locals.user;
	if (!user || user.role !== "admin") {
		return res.status(403).json({ message: "Forbidden" });
	}

	return next();
};

const parsePositiveInt = (raw, fallback) => {
	const parsed = Number.parseInt(raw, 10);
	if (Number.isFinite(parsed) && parsed > 0) return parsed;
	return fallback;
};

const ensureSeed = async (adminUserId) => {
	const total = await Activity.estimatedDocumentCount();
	if (total > 0) return;

	const seed = [
		{ user: adminUserId, action: "login", target: "session", metadata: { ip: "127.0.0.1" } },
		{ user: adminUserId, action: "view", target: "dashboard", metadata: {} },
		{ user: adminUserId, action: "update", target: "user-profile", metadata: { field: "email" } },
		{ user: adminUserId, action: "create", target: "report", metadata: { reportId: "seed-1" } },
		{ user: adminUserId, action: "delete", target: "session", metadata: {} },
	];

	await Activity.insertMany(seed);
};

router.get("/", requireAdmin, async (req, res) => {
	try {
		const { user: userFilter, action, dateFrom, dateTo } = req.query;
		const page = parsePositiveInt(req.query.page, 1);
		const pageSize = Math.min(parsePositiveInt(req.query.pageSize, 20), 100);

		const filter = {};
		if (userFilter) filter.user = userFilter;
		if (action) filter.action = { $regex: action, $options: "i" };
		if (dateFrom || dateTo) {
			filter.createdAt = {};
			if (dateFrom) {
				const fromDate = new Date(dateFrom);
				if (!Number.isNaN(fromDate.getTime())) filter.createdAt.$gte = fromDate;
			}

			if (dateTo) {
				const toDate = new Date(dateTo);
				if (!Number.isNaN(toDate.getTime())) filter.createdAt.$lte = toDate;
			}
		}

		await ensureSeed(res.locals.user._id);

		const [rows, total, users] = await Promise.all([
			Activity.find(filter)
				.populate("user", "username email role")
				.sort({ createdAt: -1 })
				.skip((page - 1) * pageSize)
				.limit(pageSize)
				.lean(),
			Activity.countDocuments(filter),
			User.find({}, "username email").lean(),
		]);

		return res.json({
			success: true,
			rows,
			total,
			page,
			pageSize,
			users,
		});
	} catch (error) {
		return res.status(500).json({ message: "Something went wrong." });
	}
});

export default router;
