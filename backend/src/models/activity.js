import mongoose from "mongoose";
import mongooseLeanDefaults from "mongoose-lean-defaults";

const { Schema } = mongoose;

// Activity log schema — used by M5 (Activity Log) and M16 (Audit Trail).
const activitySchema = new Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: "users" },
		action: { type: String, required: true },
		target: { type: String, default: "" },
		metadata: { type: Object, default: {} },
	},
	{ timestamps: true, toObject: { versionKey: false } },
);

activitySchema.index({ createdAt: -1 });
activitySchema.index({ user: 1, action: 1 });

activitySchema.plugin(mongooseLeanDefaults.default);

export default mongoose.model("activity", activitySchema);
