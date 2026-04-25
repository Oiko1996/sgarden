import mongoose from "mongoose";
import mongooseLeanDefaults from "mongoose-lean-defaults";

const { Schema } = mongoose;

// Sales records — used by M9 (Sales Records CRUD).
const salesRecordSchema = new Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: "users", required: true },
		category: { type: String, required: true, trim: true, maxlength: 120 },
		month: { type: Number, required: true, min: 1, max: 12 },
		year: { type: Number, required: true, min: 1970, max: 9999 },
		value: { type: Number, required: true },
		unit: { type: String, default: "EUR", trim: true, maxlength: 20 },
		notes: { type: String, default: "", trim: true, maxlength: 1000 },
	},
	{ timestamps: true, toObject: { versionKey: false } },
);

salesRecordSchema.index({ user: 1, createdAt: -1 });
salesRecordSchema.index({ user: 1, year: 1, month: 1 });

salesRecordSchema.plugin(mongooseLeanDefaults.default);

export default mongoose.model("salesRecord", salesRecordSchema);
