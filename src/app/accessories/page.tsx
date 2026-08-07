import { AccessoryCard } from '@/components/accessory-card';
import { jewelryCollection } from '@/data/jewelry';

export default function AccessoriesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <p className="text-sm uppercase tracking-[0.15em] text-gray-500 mb-2">
          Collection — Fashion Accessories
        </p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
          Luxury Jewelry
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Elevate your style with our curated collection of premium jewelry and accessories,
          meticulously crafted to complement every look.
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {jewelryCollection.map((item) => (
          <AccessoryCard 
            key={item.id}
            id={item.id}
            name={item.name}
            price={item.price}
            imageUrl={item.imageUrl}
            link={`/product/${item.id}`}
          />
        ))}
      </div>
    </div>
  );
}
