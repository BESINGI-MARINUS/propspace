import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPropertyApi, updatePropertyApi } from "../api/property.api";
import type { Property, PropertyPayload } from "../types";
import { PropertyForm } from "../components/property/PropertyForm";
import { Spinner, ErrorMessage } from "../components/ui/Feedback";

export const EditListingPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  useEffect(() => {
    let cancelled = false;
    getPropertyApi(id!)
      .then((data) => { if (!cancelled) setProperty(data.property); })
      .catch(() => { if (!cancelled) setError("Failed to load listing."); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [id]);

  const handleSubmit = async (data: PropertyPayload) => {
    await updatePropertyApi(id!, data);
    navigate(`/listings/${id}`);
  };

  if (loading) return <div className="max-w-2xl mx-auto px-4 py-10"><Spinner /></div>;
  if (error || !property) return <div className="max-w-2xl mx-auto px-4 py-10"><ErrorMessage message={error || "Not found."} /></div>;

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-3xl text-ink mb-2">Edit listing</h1>
      <p className="text-ink-muted text-sm mb-8">Update the details for <span className="font-medium text-ink">{property.title}</span>.</p>
      <div className="bg-surface-card border border-surface-border rounded-card p-6 sm:p-8">
        <PropertyForm
          initialValues={property}
          onSubmit={handleSubmit}
          submitLabel="Save changes"
        />
      </div>
    </main>
  );
};
