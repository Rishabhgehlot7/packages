export type ProductMedia = {
  type: 'image' | 'video';
  url: string;
  alt?: string;
  imageHint?: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  image: string; // Keep main image for card views
  imageHint?: string;
  media: ProductMedia[];
  category: string;
  highlights?: string[];
  specifications?: Record<string, string>;
};

export type CartItem = {
  id: string;
  quantity: number;
  name: string;
  price: number;
  image: string;
  size?: string;
};

export type WishlistItem = Product;

export type UserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  shippingAddress?: string;
  billingAddress?: string;
};

export type Review = {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  title: string;
  comment: string;
};

export type Category = {
  id: string;
  name: string;
  href: string;
  image: string;
  imageHint?: string;
  subcategories?: {
    id: string;
    name: string;
    href: string;
  }[];
};
