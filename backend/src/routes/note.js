import express from "express";

import { Note } from "../models/index.js";

const router = express.Router({ mergeParams: true });

router.get("/", async (_req, res) => {
	try {
		const userId = res.locals.user.id;
		const notes = await Note.find({ user: userId }).sort({ createdAt: -1 }).lean();
		return res.json({ success: true, notes });
	} catch {
		return res.status(500).json({ success: false, message: "Could not fetch notes." });
	}
});

router.post("/", async (req, res) => {
	try {
		const userId = res.locals.user.id;
		const { text } = req.body || {};

		if (typeof text !== "string" || text.trim().length === 0) {
			return res.status(400).json({ success: false, message: "Text is required." });
		}

		const note = await new Note({ user: userId, text: text.trim() }).save();
		return res.json({ success: true, note });
	} catch {
		return res.status(500).json({ success: false, message: "Could not create note." });
	}
});

router.delete("/:id", async (req, res) => {
	try {
		const userId = res.locals.user.id;
		const { id } = req.params;

		const note = await Note.findOneAndDelete({ _id: id, user: userId });
		if (!note) {
			return res.status(404).json({ success: false, message: "Note not found." });
		}

		return res.json({ success: true });
	} catch {
		return res.status(500).json({ success: false, message: "Could not delete note." });
	}
});

export default router;
