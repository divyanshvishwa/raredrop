export interface Jewelry {
  id: string;
  name: string;
  price: string;
  imageUrl: string;
  description: string;
  category: string;
  gender: string;
  type: string;
}

export const jewelryCollection: Jewelry[] = [
  {
    id: 'gold-chain-01',
    name: '24K Gold Plated Serpentine Chain',
    price: '₹450',
    imageUrl: '/products/accessories/gold-chain-01.jpeg',
    description: 'Premium 24K gold plated chain with serpentine clasp. Hypoallergenic and tarnish-resistant.',
    category: 'Necklace',
    gender: 'Unisex',
    type: 'Chain'
  },
  {
    id: 'diamond-ring-01',
    name: 'Diamond-Cut Sterling Silver Ring',
    price: '₹380',
    imageUrl: '/products/accessories/diamond-ring-01.jpeg',
    description: 'Handcrafted sterling silver ring featuring brilliant diamond-cut finish. Size adjustable.',
    category: 'Ring',
    gender: 'Female',
    type: 'Diamond'
  },
  {
    id: 'pearl-necklace-01',
    name: 'Freshwater Pearl Drop Necklace',
    price: '₹490',
    imageUrl: '/products/accessories/pearl-necklace-01.jpeg',
    description: 'Elegant necklace with lustrous freshwater pearls, perfect for any occasion.',
    category: 'Necklace',
    gender: 'Female',
    type: 'Pearl'
  },
  {
    id: 'silver-bracelet-01',
    name: 'Minimalist Sterling Silver Cuff',
    price: '₹280',
    imageUrl: '/products/accessories/silver-bracelet-01.jpeg',
    description: 'Sleek and modern sterling silver cuff bracelet, ideal for stacking or solo wear.',
    category: 'Bracelet',
    gender: 'Unisex',
    type: 'Cuff'
  },
  {
    id: 'gemstone-earrings-01',
    name: 'Emerald Cut Gemstone Earrings',
    price: '₹420',
    imageUrl: '/products/accessories/gemstone-earrings-01.jpeg',
    description: 'Dazzling emerald cut gemstone earrings set in a delicate silver frame.',
    category: 'Earrings',
    gender: 'Female',
    type: 'Gemstone'
  },
  {
    id: 'rosegold-chain-01',
    name: 'Rose Gold Delicate Chain',
    price: '₹350',
    imageUrl: '/products/accessories/rosegold-chain-01.jpeg',
    description: 'A subtle and elegant rose gold chain, perfect for layering or as a standalone piece.',
    category: 'Necklace',
    gender: 'Female',
    type: 'Chain'
  },
  {
    id: 'statement-ring-01',
    name: 'Geometric Statement Ring',
    price: '₹210',
    imageUrl: '/products/accessories/statement-ring-01.jpeg',
    description: 'Bold geometric design ring, a true statement piece for the modern individual.',
    category: 'Ring',
    gender: 'Unisex',
    type: 'Statement'
  },
  {
    id: 'charm-bracelet-01',
    name: 'Personalized Charm Bracelet',
    price: '₹310',
    imageUrl: '/products/accessories/charm-bracelet-01.jpeg',
    description: 'Customizable charm bracelet with intricate detailing, tell your unique story.',
    category: 'Bracelet',
    gender: 'Female',
    type: 'Charm'
  },
  {
    id: 'crystal-pendant-01',
    name: 'Clear Crystal Pendant Necklace',
    price: '₹260',
    imageUrl: '/products/accessories/crystal-pendant-01.jpeg',
    description: 'Sparkling clear crystal pendant on a fine silver chain, radiating elegance.',
    category: 'Necklace',
    gender: 'Female',
    type: 'Pendant'
  },
];