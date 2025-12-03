import React from 'react';
import Link from 'next/link';
import { Package } from 'lucide-react';

type Product = {
  id: string;
  name?: string;
  brand?: string;
  category?: string;
  cover_image?: string;
  is_active?: boolean;
};

type RelatedProductsProps = {
  products: Product[];
  title: string;
  currentProductId?: string;
};

export default function RelatedProducts({ products, title, currentProductId }: RelatedProductsProps) {
  const displayProducts = products
    .filter(p => p.id !== currentProductId && p.is_active !== false)
    .slice(0, 6);

  if (displayProducts.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <span className="text-base text-gray-500">{displayProducts.length} ផលិតផល</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 stagger-children">
        {displayProducts.map(product => (
          <Link 
            key={product.id} 
            href={`/product-detail?id=${product.id}`}
            className="group"
          >
            <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden mb-2 border card-hover">
              {product.cover_image ? (
                <img 
                  src={product.cover_image} 
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-full object-cover img-zoom"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-8 h-8 text-gray-300" />
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 font-medium">{product.brand}</p>
            <p className="text-sm font-medium text-gray-900 truncate group-hover:text-gray-600 transition-colors">{product.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}