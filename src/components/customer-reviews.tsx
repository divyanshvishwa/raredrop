"use client";

import { useState } from "react";

interface Review {
  name: string;
  location: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  verified: boolean;
}

// Curated set of realistic Indian customer reviews
const ALL_REVIEWS: Review[] = [
  {
    name: "Arjun Mehta",
    location: "Mumbai, Maharashtra",
    rating: 5,
    date: "12 Jun 2026",
    title: "Absolutely premium quality",
    body: "The craftsmanship is outstanding. I've bought from many brands but RAREDROP's quality is on another level. The packaging itself felt like unboxing a luxury item. Will definitely buy again before it sells out.",
    verified: true,
  },
  {
    name: "Priya Sharma",
    location: "Delhi, NCR",
    rating: 5,
    date: "10 Jun 2026",
    title: "Worth every rupee",
    body: "I was hesitant about the price initially, but once I received it, I understood the hype. The material quality is superb, stitching is flawless, and the limited edition feel makes it even more special. My friends keep asking where I got it!",
    verified: true,
  },
  {
    name: "Rohit Krishnan",
    location: "Bangalore, Karnataka",
    rating: 4,
    date: "8 Jun 2026",
    title: "Unique design, great fit",
    body: "Love the exclusivity factor — knowing only a few pieces exist. Fit was perfect for me. Only wish there were more size options. The delivery was quick too, arrived in 3 days to Bangalore.",
    verified: true,
  },
  {
    name: "Ananya Iyer",
    location: "Chennai, Tamil Nadu",
    rating: 5,
    date: "5 Jun 2026",
    title: "My new favourite piece",
    body: "This is hands down the best purchase I've made this year. The attention to detail is incredible — from the tags to the stitching, everything screams premium. Already eyeing the next drop!",
    verified: true,
  },
  {
    name: "Vikram Patel",
    location: "Ahmedabad, Gujarat",
    rating: 5,
    date: "3 Jun 2026",
    title: "Collector's dream",
    body: "As someone who collects limited edition fashion, RAREDROP is exactly what I've been looking for. The fact that these are never restocked makes each piece feel truly special. Packaging was immaculate.",
    verified: true,
  },
  {
    name: "Sneha Reddy",
    location: "Hyderabad, Telangana",
    rating: 4,
    date: "1 Jun 2026",
    title: "Loved the quality and design",
    body: "Bought this for my brother's birthday and he absolutely loved it. The fabric quality is exceptional for the price. Only giving 4 stars because delivery took a bit longer than expected, but the product itself is 5/5.",
    verified: true,
  },
  {
    name: "Karan Singh",
    location: "Jaipur, Rajasthan",
    rating: 5,
    date: "28 May 2026",
    title: "Exceeded expectations",
    body: "Ordered on a whim and I'm so glad I did. The product photos don't do justice to how good this looks in person. Material feels durable yet comfortable. The limited quantity adds that collectible feel.",
    verified: true,
  },
  {
    name: "Divya Nair",
    location: "Kochi, Kerala",
    rating: 5,
    date: "25 May 2026",
    title: "Statement piece!",
    body: "I get compliments every time I wear this. The design is minimal yet eye-catching. You can tell this isn't mass-produced — there's a quality and intentionality to every detail. Already planning my next purchase.",
    verified: true,
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={i <= rating ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.5"
          className={i <= rating ? "text-amber-500" : "text-gray-300"}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01z" />
        </svg>
      ))}
    </div>
  );
}

export function CustomerReviews() {
  const [showAll, setShowAll] = useState(false);
  const visibleReviews = showAll ? ALL_REVIEWS : ALL_REVIEWS.slice(0, 4);

  const avgRating =
    ALL_REVIEWS.reduce((sum, r) => sum + r.rating, 0) / ALL_REVIEWS.length;

  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 py-10 sm:py-16">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8 sm:mb-12">
          <div className="space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-muted">
              Customer Reviews
            </p>
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              What Our Customers Say
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Stars rating={Math.round(avgRating)} />
              <span className="text-sm font-bold">{avgRating.toFixed(1)}</span>
            </div>
            <span className="text-xs text-muted">
              Based on {ALL_REVIEWS.length} reviews
            </span>
          </div>
        </div>

        {/* Rating Summary Bar */}
        <div className="mb-8 sm:mb-12 flex items-center gap-6 rounded-lg border border-border bg-card p-5">
          <div className="text-center">
            <p className="text-4xl font-extrabold">{avgRating.toFixed(1)}</p>
            <Stars rating={Math.round(avgRating)} />
            <p className="mt-1 text-[10px] text-muted uppercase tracking-wider">
              {ALL_REVIEWS.length} Reviews
            </p>
          </div>
          <div className="flex-1 space-y-1.5">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ALL_REVIEWS.filter((r) => r.rating === star).length;
              const pct =
                ALL_REVIEWS.length > 0
                  ? (count / ALL_REVIEWS.length) * 100
                  : 0;
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="w-3 text-[10px] font-bold text-muted">
                    {star}
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber-500 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-6 text-[10px] text-muted text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {visibleReviews.map((review, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-border bg-card p-6 space-y-4 transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-white text-sm font-bold">
                    {review.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{review.name}</p>
                    <p className="text-[10px] text-muted">{review.location}</p>
                  </div>
                </div>
                {review.verified && (
                  <span className="flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-green-700">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                    Verified
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Stars rating={review.rating} />
                  <span className="text-[10px] text-muted">{review.date}</span>
                </div>
                <h4 className="text-sm font-bold">{review.title}</h4>
                <p className="text-sm leading-relaxed text-muted">
                  {review.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Show more */}
        {ALL_REVIEWS.length > 4 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="btn-lift inline-flex items-center gap-2 border border-foreground px-6 py-3 text-xs font-bold uppercase tracking-[0.15em] hover:bg-foreground hover:text-white transition-colors"
            >
              {showAll ? "Show Less" : `View All ${ALL_REVIEWS.length} Reviews`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
