import { useState, type FormEvent } from "react";
import type { PropertyPayload, PropertyType, ListingType } from "../../types";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";
import { ErrorMessage } from "../ui/Feedback";

interface Props {
  initialValues?: Partial<PropertyPayload>;
  onSubmit: (data: PropertyPayload) => Promise<void>;
  submitLabel?: string;
}

const propertyTypeOptions = [
  { value: "Apartment", label: "Apartment" },
  { value: "House", label: "House" },
  { value: "Studio", label: "Studio" },
];

const listingTypeOptions = [
  { value: "rent", label: "For Rent" },
  { value: "sale", label: "For Sale" },
];

export const PropertyForm = ({
  initialValues = {},
  onSubmit,
  submitLabel = "Save listing",
}: Props) => {
  const [title, setTitle] = useState(initialValues.title ?? "");
  const [description, setDescription] = useState(
    initialValues.description ?? "",
  );
  const [price, setPrice] = useState(String(initialValues.price ?? ""));
  const [city, setCity] = useState(initialValues.location?.city ?? "");
  const [country, setCountry] = useState(initialValues.location?.country ?? "");
  const [propertyType, setPropertyType] = useState<PropertyType>(
    initialValues.propertyType ?? "Apartment",
  );
  const [listingType, setListingType] = useState<ListingType>(
    initialValues.listingType ?? "rent",
  );
  const [images, setImages] = useState(initialValues.images?.join(", ") ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validate = (): string => {
    if (!title.trim()) return "Title is required.";
    if (title.length < 5) return "Title must be at least 5 characters.";
    if (!description.trim()) return "Description is required.";
    if (description.length < 20)
      return "Description must be at least 20 characters.";
    if (!price || Number(price) < 0) return "Price must be a positive number.";
    if (!city.trim()) return "City is required.";
    if (!country.trim()) return "Country is required.";
    return "";
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        price: Number(price),
        location: { city: city.trim(), country: country.trim() },
        propertyType,
        listingType,
        images: images
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });
    } catch (err: any) {
      setError(
        err.response?.data?.message ??
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && <ErrorMessage message={error} />}

      <Input
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g. Modern 2-bed apartment in Bonanjo"
      />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-ink">Description</label>
        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the property — features, nearby amenities, access..."
          className="w-full px-4 py-2.5 rounded-lg border border-surface-border bg-white text-sm text-ink
            placeholder:text-ink-light focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary resize-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Price (USD)"
          type="number"
          min={0}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="e.g. 500"
        />
        <Select
          label="Listing type"
          value={listingType}
          onChange={(e) => setListingType(e.target.value as ListingType)}
          options={listingTypeOptions}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="e.g. Yaounde"
        />
        <Input
          label="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder="e.g. Cameroon"
        />
      </div>

      <Select
        label="Property type"
        value={propertyType}
        onChange={(e) => setPropertyType(e.target.value as PropertyType)}
        options={propertyTypeOptions}
      />

      <Input
        label="Image URLs (comma-separated)"
        value={images}
        onChange={(e) => setImages(e.target.value)}
        placeholder="https://example.com/photo1.jpg, https://..."
      />

      <Button type="submit" loading={loading} size="lg" className="w-full mt-2">
        {submitLabel}
      </Button>
    </form>
  );
};
