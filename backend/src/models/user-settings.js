import mongoose from "mongoose";
import mongooseLeanDefaults from "mongoose-lean-defaults";

const { Schema } = mongoose;

// Per-user UI preferences saved by M17.
const userSettingsSchema = new Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: "users", required: true, unique: true, index: true },
		pageSize: { type: Number, default: 10, min: 1, max: 1000 },
		defaultDashboard: { type: String, enum: ["dashboard", "dashboard1", "dashboard2"], default: "dashboard" },
		dateFormat: { type: String, default: "DD/MM/YYYY" },
		sidebarCollapsed: { type: Boolean, default: false },
	},
	{ timestamps: true, toObject: { versionKey: false } },
);

userSettingsSchema.plugin(mongooseLeanDefaults.default);

export default mongoose.model("user-settings", userSettingsSchema);
