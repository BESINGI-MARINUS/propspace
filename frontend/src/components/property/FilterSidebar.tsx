import { useState } from "react";
import { type PropertyFilters } from "../../types";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

interface Props {
  onFilter: (filters: PropertyFilters) => void;
}

export const FilterSidebar = ({ onFilter }: Props) => {
  const [city, setCity] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleApply = () => {
    onFilter({
      city: city.trim() || undefined,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
    });
  };

  const handleReset = () => {
    setCity("");
    setMinPrice("");
    setMaxPrice("");
    onFilter({});
  };

  return (
    <aside className="bg-surface-card border border-surface-border rounded-card p-5 flex flex-col gap-4 h-fit">
      <h2 className="font-display text-lg text-ink">Filter listings</h2>

      <Input
        label="City"
        placeholder="e.g. Douala"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <div>
        <p className="text-sm font-medium text-ink mb-1">Price range</p>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-surface-border bg-white text-sm
              focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
          />
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-surface-border bg-white text-sm
              focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
          />
        </div>
      </div>

      <Button onClick={handleApply} className="w-full">
        Apply filters
      </Button>
      <Button onClick={handleReset} variant="secondary" className="w-full">
        Reset
      </Button>
    </aside>
  );
};
