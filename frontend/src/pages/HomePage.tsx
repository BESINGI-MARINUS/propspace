import { useState, useEffect } from "react";
import type { Property, PropertyFilters } from "../types";
import { getPropertiesApi } from "../api/property.api";
import { PropertyCard } from "../components/property/PropertyCard";
import { FilterSidebar } from "../components/property/FilterSidebar";
import { Spinner, EmptyState, ErrorMessage } from "../components/ui/Feedback";

type Status = "idle" | "loading" | "success" | "error";

export const HomePage = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [status, setStatus]         = useState<Status>("idle");
  const [error, setError]           = useState("");
  const [filters, setFilters]       = useState<PropertyFilters>({});

  useEffect(() => {
    let cancelled = false;

    const fetch = async () => {
      setStatus("loading");
      try {
        const data = await getPropertiesApi(filters);
        if (!cancelled) { setProperties(data.properties); setStatus("success"); }
      } catch {
        if (!cancelled) { setError("Failed to load listings. Please try again."); setStatus("error"); }
      }
    };

    fetch();
    return () => { cancelled = true; };   // cleanup on unmount / filter change
  }, [filters]);

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Hero */}
      <div className="mb-10">
        <h1 className="font-display text-4xl sm:text-5xl text-ink mb-3">
          Find your next <span className="text-accent">home</span>
        </h1>
        <p className="text-ink-muted text-lg">
          Browse verified properties for rent and sale across Cameroon.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-64 shrink-0">
          <FilterSidebar onFilter={setFilters} />
        </div>

        {/* Feed */}
        <div className="flex-1">
          {status === "loading" && <Spinner />}
          {status === "error"   && <ErrorMessage message={error} />}
          {status === "success" && properties.length === 0 && (
            <EmptyState
              title="No listings match your search"
              description="Try adjusting your filters or check back later."
            />
          )}
          {status === "success" && properties.length > 0 && (
            <>
              <p className="text-sm text-ink-muted mb-4">{properties.length} listing{properties.length !== 1 ? "s" : ""} found</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {properties.map((p) => (
                  <PropertyCard key={p._id} property={p} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
};
