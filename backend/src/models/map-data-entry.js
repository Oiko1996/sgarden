import mongoose from "mongoose";
import mongooseLeanDefaults from "mongoose-lean-defaults";

const { Schema } = mongoose;

// Map-based data entries — used by M14 (Map-Based Data Entry).
const mapDataEntrySchema = new Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: "users", required: true },
		regionName: { type: String, required: true, trim: true, maxlength: 120 },
		category: { type: String, required: true, trim: true, maxlength: 120 },
		revenue: { type: Number, required: true },
	},
	{ timestamps: true, toObject: { versionKey: false } },
);

mapDataEntrySchema.index({ user: 1, createdAt: -1 });
mapDataEntrySchema.index({ regionName: 1 });

mapDataEntrySchema.plugin(mongooseLeanDefaults.default);

export default mongoose.model("mapDataEntry", mapDataEntrySchema);
