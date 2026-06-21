import Property from "../models/property.model";
import { IProperty, PropertyFilters } from "../types";

export const getAllProperties = async (filters: PropertyFilters): Promise<IProperty[]> => {
  const query: Record<string, any> = {};

  if (filters.city) {
    query["location.city"] = { $regex: filters.city, $options: "i" };
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    query.price = {};
    if (filters.minPrice !== undefined) query.price.$gte = Number(filters.minPrice);
    if (filters.maxPrice !== undefined) query.price.$lte = Number(filters.maxPrice);
  }

  return Property.find(query)
    .populate("owner", "username avatar")
    .sort({ createdAt: -1 });
};

export const getPropertyById = async (id: string): Promise<IProperty | null> => {
  return Property.findById(id).populate("owner", "username avatar email");
};

export const getPropertiesByOwner = async (ownerId: string): Promise<IProperty[]> => {
  return Property.find({ owner: ownerId }).sort({ createdAt: -1 });
};

export const createProperty = async (data: Partial<IProperty>): Promise<IProperty> => {
  const property = new Property(data);
  return property.save();
};

export const updateProperty = async (
  id: string,
  updates: Partial<IProperty>
): Promise<IProperty | null> => {
  return Property.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true });
};

export const deleteProperty = async (id: string): Promise<void> => {
  await Property.findByIdAndDelete(id);
};
