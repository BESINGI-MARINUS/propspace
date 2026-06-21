import { useNavigate } from "react-router-dom";
import { createPropertyApi } from "../api/property.api";
import type { PropertyPayload } from "../types";
import { PropertyForm } from "../components/property/PropertyForm";

export const CreateListingPage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (data: PropertyPayload) => {
    const result = await createPropertyApi(data);
    navigate(`/listings/${result.property._id}`);
  };

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-3xl text-ink mb-2">List a property</h1>
      <p className="text-ink-muted text-sm mb-8">Fill in the details below to publish your listing.</p>
      <div className="bg-surface-card border border-surface-border rounded-card p-6 sm:p-8">
        <PropertyForm onSubmit={handleSubmit} submitLabel="Publish listing" />
      </div>
    </main>
  );
};
