import express from "express";

import { attachUser } from "../utils/index.js";

import publicRoutes from "./public.js";
import userSystemRoutes from "./user-system.js";
import userRoutes from "./user.js";
import dataRoutes from "./data.js";
import activityRoutes from "./activity.js";
import noteRoutes from "./note.js";
import salesRecordRoutes from "./sales-record.js";
import alertRuleRoutes from "./alert-rule.js";
import mapDataEntryRoutes from "./map-data-entry.js";
import reportRoutes from "./report.js";
import userSettingsRoutes from "./user-settings.js";

const router = express.Router({ mergeParams: true });

// Handlers for public routes
router.use("/", publicRoutes);

// Handlers for user routes
router.use("/", userSystemRoutes);

// Authorization middleware
router.use(attachUser);

// Handlers for user routes
router.use("/user/", userRoutes);

router.use("/data/", dataRoutes);

router.use("/activity/", activityRoutes);

router.use("/notes/", noteRoutes);

router.use("/sales-data/", salesRecordRoutes);

router.use("/alerts/", alertRuleRoutes);

router.use("/map-data/", mapDataEntryRoutes);

router.use("/reports/", reportRoutes);

router.use("/user-settings/", userSettingsRoutes);

router.get("/test/", (req, res) => {
	const { user } = res.locals;
	console.log(user);
	return res.json({ success: true });
});

export default router;
