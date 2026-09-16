/*
 * Star Rating Component — Google-style reviews
 * Used by Comercio and Servicos pages for interactive star ratings
 */
import { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  size?: number;
  onRate?: (rating: number) => void;
  interactive?: boolean;
  color?: string;
}

export default function StarRating({ rating, size = 16, onRate, interactive = false, color = "oklch(0.78 0.13 85)" }: StarRatingProps) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          className={interactive ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => interactive && onRate?.(star)}
          aria-label={`${star} estrela${star > 1 ? "s" : ""}`}
        >
          <Star
            className="w-[16px] h-[16px]"
            style={{ width: size, height: size }}
            fill={star <= (hover || rating) ? color : "transparent"}
            color={star <= (hover || rating) ? color : "oklch(0.65 0.02 80)"}
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  );
}
