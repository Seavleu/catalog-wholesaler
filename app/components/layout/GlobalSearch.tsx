"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { base44 } from '@/app/api/base44Client';
import { Input } from '@/components/ui/input';
import { Search, Package, X, Loader2 } from 'lucide-react';

type Product = {
  id: string;
  name?: string;
  brand?: string;
  category?: string;
  cover_image?: string;
  is_active?: boolean;
};

export default function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    base44.entities.Product.list().then(setProducts).catch(() => {});
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    const searchTerm = query.toLowerCase();
    const filtered = products
      .filter(p => p.is_active !== false)
      .filter(p => 
        p.name?.toLowerCase().includes(searchTerm) ||
        p.brand?.toLowerCase().includes(searchTerm) ||
        p.category?.toLowerCase().includes(searchTerm)
      )
      .slice(0, 8);

    setResults(filtered);
    setIsOpen(true);
    setIsLoading(false);
  }, [query, products]);

  const handleSelect = () => {
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative flex-1 max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="ស្វែងរកផលិតផល..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setIsOpen(true)}
          className="pl-10 pr-10 h-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:bg-gray-700 rounded-lg"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setIsOpen(false); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-600 rounded"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border overflow-hidden z-50 animate-fade-in">
          {isLoading ? (
            <div className="p-4 flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            </div>
          ) : results.length > 0 ? (
            <div className="max-h-96 overflow-y-auto">
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/product-detail?id=${product.id}`}
                  onClick={handleSelect}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b last:border-b-0"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {product.cover_image ? (
                      <img src={product.cover_image} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-5 h-5 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.brand} • {product.category}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500 text-sm">
              រកមិនឃើញផលិតផល
            </div>
          )}
        </div>
      )}
    </div>
  );
}