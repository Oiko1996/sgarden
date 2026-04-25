import mongoose from "mongoose";
import mongooseLeanDefaults from "mongoose-lean-defaults";

const { Schema } = mongoose;

// Report definitions saved by users via the M15 Report Builder wizard.
const reportSchema = new Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: "users", required: true },
		title: { type: String, required: true, trim: true, maxlength: 200 },
		chartType: { type: String, required: true, enum: ["bar", "line", "pie"], default: "bar" },
		config: { type: Schema.Types.Mixed, default: {} },
	},
	{ timestamps: true, toObject: { versionKey: false } },
);

reportSchema.index({ user: 1, createdAt: -1 });

reportSchema.plugin(mongooseLeanDefaults.default);

export default mongoose.model("report", reportSchema);
