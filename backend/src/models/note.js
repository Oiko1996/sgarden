import mongoose from "mongoose";
import mongooseLeanDefaults from "mongoose-lean-defaults";

const { Schema } = mongoose;

const noteSchema = new Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: "users", required: true, index: true },
		text: { type: String, required: true, trim: true, maxlength: 2000 },
	},
	{ timestamps: true, toObject: { versionKey: false } },
);

noteSchema.plugin(mongooseLeanDefaults.default);

export default mongoose.model("notes", noteSchema);
