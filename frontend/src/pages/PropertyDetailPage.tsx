import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import type { Property } from "../types";
import { getPropertyApi, deletePropertyApi } from "../api/property.api";
import { useAuth } from "../context/auth";
import { Button } from "../components/ui/Button";
import { Spinner, ErrorMessage } from "../components/ui/Feedback";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80";

export const PropertyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [property, setProperty] = useState<Property | null>(null);
  const [error, setError] = useState("");
  const [activeImg, setActiveImg] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const loading = property === null && error === "";

  useEffect(() => {
    let cancelled = false;

    getPropertyApi(id!)
      .then((data) => {
        if (!cancelled) setProperty(data.property);
      })
      .catch(() => {
        if (!cancelled) setError("Property not found or unavailable.");
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const isOwner = isAuthenticated && user?._id === property?.owner?._id;

  const handleDelete = async () => {
    if (!window.confirm("Remove this listing permanently?")) return;
    setDeleting(true);
    try {
      await deletePropertyApi(id!);
      navigate("/dashboard");
    } catch {
      setError("Delete failed. Please try again.");
      setDeleting(false);
    }
  };

  if (loading)
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <Spinner />
      </div>
    );
  if (error || !property)
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <ErrorMessage message={error || "Not found."} />
      </div>
    );

  const images = property.images.length ? property.images : [PLACEHOLDER];

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <Link
        to="/"
        className="text-sm text-ink-muted hover:text-ink mb-6 inline-block"
      >
        ← Back to listings
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Gallery */}
        <div>
          <div className="rounded-card overflow-hidden bg-surface h-72 sm:h-96">
            <img
              src={images[activeImg]}
              alt={property.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = PLACEHOLDER;
              }}
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors
                    ${i === activeImg ? "border-primary" : "border-transparent"}`}
                >
                  <img
                    src={src}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = PLACEHOLDER;
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col gap-4">
          <div className="flex gap-2 flex-wrap">
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize
              ${property.listingType === "rent" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}
            >
              For {property.listingType}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-surface text-ink">
              {property.propertyType}
            </span>
          </div>

          <h1 className="font-display text-3xl text-ink">{property.title}</h1>

          <p className="text-ink-muted text-sm">
            📍 {property.location.city}, {property.location.country}
          </p>

          <p className="text-primary font-bold text-3xl">
            ${property.price.toLocaleString()}
            {property.listingType === "rent" && (
              <span className="text-ink-light font-normal text-base">/mo</span>
            )}
          </p>

          <p className="text-ink text-sm leading-relaxed">
            {property.description}
          </p>

          <p className="text-xs text-ink-muted">
            Listed by{" "}
            <span className="font-medium text-ink">
              {property.owner?.username}
            </span>
            {" · "}
            {new Date(property.createdAt).toLocaleDateString()}
          </p>

          {isOwner && (
            <div className="flex gap-3 pt-2">
              <Link to={`/listings/${property._id}/edit`} className="flex-1">
                <Button variant="secondary" className="w-full">
                  Edit listing
                </Button>
              </Link>
              <Button
                variant="danger"
                onClick={handleDelete}
                loading={deleting}
                className="flex-1"
              >
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
