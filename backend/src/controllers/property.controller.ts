import { Request } from "express";
import * as propertyService from "../services/property.service";
import { AuthRequest, OwnerRequest, PropertyFilters } from "../types";
import { asyncHandler } from "../utils/asyncHandler";

export const getAllProperties = asyncHandler<Request>(async (req, res) => {
  const filters: PropertyFilters = {
    city: req.query.city as string | undefined,
    minPrice: req.query.minPrice as string | undefined,
    maxPrice: req.query.maxPrice as string | undefined,
  };
  const properties = await propertyService.getAllProperties(filters);
  res.status(200).json({ count: properties.length, properties });
});

export const getMyListings = asyncHandler<AuthRequest>(async (req, res) => {
  const properties = await propertyService.getMyListings(
    req.user._id.toString(),
  );
  res.status(200).json({ count: properties.length, properties });
});

export const getPropertyById = asyncHandler<Request>(async (req, res) => {
  const property = await propertyService.getPropertyById(req.params.id);
  res.status(200).json({ property });
});

export const createProperty = asyncHandler<AuthRequest>(async (req, res) => {
  const property = await propertyService.createProperty(
    req.body,
    req.user._id.toString(),
  );
  res.status(201).json({ message: "Property listed successfully.", property });
});

export const updateProperty = asyncHandler<OwnerRequest>(async (req, res) => {
  const updated = await propertyService.updateProperty(
    req.property._id.toString(),
    req.body,
  );
  res.status(200).json({ message: "Property updated.", property: updated });
});

export const deleteProperty = asyncHandler<OwnerRequest>(async (req, res) => {
  const result = await propertyService.deleteProperty(
    req.property._id.toString(),
  );
  res.status(200).json(result);
});
