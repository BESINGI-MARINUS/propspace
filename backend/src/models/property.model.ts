import mongoose, { Schema } from "mongoose";
import { IProperty } from "../types";

const propertySchema = new Schema<IProperty>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [20, "Description must be at least 20 characters"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    location: {
      city: {
        type: String,
        required: [true, "City is required"],
        trim: true,
      },
      country: {
        type: String,
        required: [true, "Country is required"],
        trim: true,
      },
    },
    propertyType: {
      type: String,
      required: [true, "Property type is required"],
      enum: {
        values: ["Apartment", "House", "Studio"],
        message: "Property type must be Apartment, House, or Studio",
      },
    },
    images: {
      type: [String],
      default: [],
    },
    listingType: {
      type: String,
      required: [true, "Listing type is required"],
      enum: {
        values: ["rent", "sale"],
        message: "Listing type must be rent or sale",
      },
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Indexes to speed up the public search/filter and "my listings" queries
propertySchema.index({ "location.city": 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ owner: 1 });

export default mongoose.model<IProperty>("Property", propertySchema);
