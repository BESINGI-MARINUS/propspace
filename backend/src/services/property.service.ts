import * as propertyRepository from "../repositories/property.repository";
import { IProperty, PropertyFilters } from "../types";
import { badRequest, notFound } from "../utils/AppError";

const REQUIRED_FIELDS = ["title", "description", "price", "location", "propertyType", "listingType"] as const;

const validatePropertyData = (data: Record<string, any>): void => {
  for (const field of REQUIRED_FIELDS) {
    if (!data[field]) {
      throw badRequest(`${field} is required.`);
    }
  }

  if (typeof data.price !== "number" || data.price < 0) {
    throw badRequest("Price must be a non-negative number.");
  }

  if (!data.location?.city || !data.location?.country) {
    throw badRequest("Location must include both city and country.");
  }
};

export const getAllProperties = (filters: PropertyFilters): Promise<IProperty[]> => {
  return propertyRepository.getAllProperties(filters);
};

export const getPropertyById = async (id: string): Promise<IProperty> => {
  const property = await propertyRepository.getPropertyById(id);
  if (!property) {
    throw notFound("Property not found.");
  }
  return property;
};

export const getMyListings = (ownerId: string): Promise<IProperty[]> => {
  return propertyRepository.getPropertiesByOwner(ownerId);
};

export const createProperty = async (
  data: Record<string, any>,
  ownerId: string
): Promise<IProperty> => {
  const payload = { ...data, price: Number(data.price), owner: ownerId as unknown as IProperty["owner"] };
  validatePropertyData(payload);
  return propertyRepository.createProperty(payload);
};

export const updateProperty = async (
  propertyId: string,
  data: Record<string, any>
): Promise<IProperty> => {
  const updatableFields = ["title", "description", "price", "location", "propertyType", "listingType", "images"];
  const allowedUpdates: Record<string, any> = {};

  for (const field of updatableFields) {
    if (data[field] !== undefined) allowedUpdates[field] = data[field];
  }

  if (Object.keys(allowedUpdates).length === 0) {
    throw badRequest("No valid fields provided to update.");
  }

  if (allowedUpdates.price !== undefined) {
    allowedUpdates.price = Number(allowedUpdates.price);
  }

  const updated = await propertyRepository.updateProperty(propertyId, allowedUpdates);
  if (!updated) {
    throw notFound("Property not found.");
  }
  return updated;
};

export const deleteProperty = async (propertyId: string): Promise<{ message: string }> => {
  await propertyRepository.deleteProperty(propertyId);
  return { message: "Property deleted successfully." };
};
