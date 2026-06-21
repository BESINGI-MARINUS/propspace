import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { Property } from "../types";
import { getMyPropertiesApi, deletePropertyApi } from "../api/property.api";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { Spinner, EmptyState, ErrorMessage } from "../components/ui/Feedback";

const PLACEHOLDER = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80";

export const DashboardPage = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getMyPropertiesApi()
      .then((data) => { if (!cancelled) setProperties(data.properties); })
      .catch(() => { if (!cancelled) setError("Failed to load your listings."); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Remove this listing permanently?")) return;
    setDeletingId(id);
    try {
      await deletePropertyApi(id);
      setProperties((prev) => prev.filter((p) => p._id !== id));
    } catch {
      setError("Delete failed. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl text-ink">My listings</h1>
          <p className="text-ink-muted text-sm mt-1">
            Welcome back, <span className="font-medium text-ink">{user?.username}</span>
          </p>
        </div>
        <Link to="/listings/new">
          <Button>+ New listing</Button>
        </Link>
      </div>

      {error && <div className="mb-6"><ErrorMessage message={error} /></div>}

      {loading && <Spinner />}

      {!loading && properties.length === 0 && (
        <EmptyState
          title="No listings yet"
          description="Your properties will appear here once you list them."
          action={<Link to="/listings/new"><Button>List your first property</Button></Link>}
        />
      )}

      {!loading && properties.length > 0 && (
        <div className="flex flex-col gap-4">
          {properties.map((p) => (
            <div key={p._id}
              className="flex flex-col sm:flex-row gap-4 bg-surface-card border border-surface-border
                rounded-card p-4 hover:shadow-sm transition-shadow">
              {/* Thumbnail */}
              <div className="w-full sm:w-32 h-24 rounded-lg overflow-hidden shrink-0 bg-surface">
                <img
                  src={p.images[0] ?? PLACEHOLDER}
                  alt={p.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h2 className="font-display text-lg text-ink leading-snug truncate">{p.title}</h2>
                <p className="text-xs text-ink-muted mt-0.5">
                  📍 {p.location.city}, {p.location.country} · {p.propertyType}
                </p>
                <p className="text-primary font-bold mt-1">
                  ${p.price.toLocaleString()}
                  {p.listingType === "rent" && <span className="text-ink-light font-normal text-sm">/mo</span>}
                </p>
              </div>

              {/* Actions */}
              <div className="flex sm:flex-col gap-2 shrink-0">
                <Link to={`/listings/${p._id}`} className="flex-1 sm:flex-none">
                  <Button variant="secondary" size="sm" className="w-full">View</Button>
                </Link>
                <Link to={`/listings/${p._id}/edit`} className="flex-1 sm:flex-none">
                  <Button variant="secondary" size="sm" className="w-full">Edit</Button>
                </Link>
                <Button variant="danger" size="sm"
                  loading={deletingId === p._id}
                  onClick={() => handleDelete(p._id)}
                  className="flex-1 sm:flex-none">
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};
