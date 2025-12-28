// BE/src/models/Banner.js
import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        image: {
            type: String, // URL từ Cloudinary
            required: true,
        },
        slug: { type: String, unique: true },
        publicId: {
            type: String, // public_id của Cloudinary để xóa sau nếu cần
        },
        description: {
            type: String,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        order: {
            type: Number,
            default: 0, // để sắp xếp thứ tự hiển thị
        },
        likes: { type: Number, default: 0 },
        comments: [
            {
                userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                username: String,
                avatar: String,
                content: String,
                createdAt: { type: Date, default: Date.now },
            },
        ],
    }, { timestamps: true });

const Banner = mongoose.model("Banner", bannerSchema);

export default Banner;