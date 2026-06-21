import { Link } from "react-router-dom";
import type { Property } from "../../types";

interface Props {
  property: Property;
}

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80";

const badge = (type: string) =>
  type === "rent" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700";

export const PropertyCard = ({ property }: Props) => {
  const image = property.images[0] ?? PLACEHOLDER;
  const { title, price, listingType, propertyType, location, owner } = property;

  return (
    <Link
      to={`/listings/${property._id}`}
      className="group bg-surface-card rounded-card overflow-hidden border border-surface-border
        hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-surface">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = PLACEHOLDER;
          }}
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${badge(listingType)}`}
          >
            For {listingType}
          </span>
          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-white/90 text-ink">
            {propertyType}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-display text-lg text-ink leading-snug line-clamp-2 mb-1">
          {title}
        </h3>
        <p className="text-ink-muted text-xs mb-3">
          📍 {location.city}, {location.country}
        </p>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-primary font-bold text-lg">
            ${price.toLocaleString()}
            {listingType === "rent" && (
              <span className="text-ink-light font-normal text-sm">/mo</span>
            )}
          </span>
          <span className="text-xs text-ink-muted">
            by {owner?.username ?? "Unknown"}
          </span>
        </div>
      </div>
    </Link>
  );
};
