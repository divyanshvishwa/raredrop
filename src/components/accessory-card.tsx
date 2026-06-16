"use client";

import Link from "next/link";
import Image from "next/image";
import { WishlistButton } from "./wishlist-button";

interface AccessoryCardProps {
  id: string;
  name: string;
  price: string;
  imageUrl: string;
  link: string;
}

export function AccessoryCard({ id, name, price, imageUrl, link }: AccessoryCardProps) {
  return (
    <Link href={link} className="card-3d group block transition-transform duration-300">
      <div className="space-y-4">
        <div className="card-3d-inner relative aspect-[3/4] overflow-hidden rounded-lg bg-card shadow-lg img-hover-zoom">
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute top-3 right-3 z-10">
            <WishlistButton
              productId={id}
              name={name}
              price={Number(price.replace(/[^0-9.]/g, ''))}
              imageUrl={imageUrl}
            />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">{name}</h3>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">{price}</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted">In Stock</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
