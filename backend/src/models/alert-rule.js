import mongoose from "mongoose";
import mongooseLeanDefaults from "mongoose-lean-defaults";

const { Schema } = mongoose;

// Threshold alert rules — used by M10 (Threshold Alerts System).
const alertRuleSchema = new Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: "users", required: true },
		metric: { type: String, required: true, trim: true, maxlength: 120 },
		operator: { type: String, required: true, enum: [">", "<", ">=", "<="] },
		threshold: { type: Number, required: true },
		lastTriggeredAt: { type: Date, default: null },
	},
	{ timestamps: true, toObject: { versionKey: false } },
);

alertRuleSchema.index({ user: 1, createdAt: -1 });

alertRuleSchema.plugin(mongooseLeanDefaults.default);

export default mongoose.model("alertRule", alertRuleSchema);
