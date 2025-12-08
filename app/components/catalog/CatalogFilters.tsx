import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X } from "lucide-react";

const CATEGORIES = ["All", "សម្លៀកបំពាក់កីឡាបុរស", "សម្លៀកបំពាក់កីឡានារី", "អាវបាល់ទាត់", "អាវបាល់បោះ", "កាបូបស្ពាយ", "កាបូប"];

type CatalogFiltersProps = {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedBrand: string;
  setSelectedBrand: (value: string) => void;
  brands: string[];
  onClear: () => void;
};

export default function CatalogFilters({ 
  searchQuery, 
  setSearchQuery, 
  selectedCategory, 
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  brands,
  onClear
}: CatalogFiltersProps) {
  const hasFilters = searchQuery || selectedCategory !== "All" || selectedBrand !== "All";

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search products, brands, or style codes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 bg-white border-gray-200 focus:border-gray-900 focus:ring-gray-900"
          />
        </div>

        {/* Category Filter */}
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-44 h-11 bg-white border-gray-200">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Brand Filter */}
        <Select value={selectedBrand} onValueChange={setSelectedBrand}>
          <SelectTrigger className="w-full sm:w-44 h-11 bg-white border-gray-200">
            <SelectValue placeholder="Brand" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Brands</SelectItem>
            {brands.map(brand => (
              <SelectItem key={brand} value={brand}>{brand}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button 
            variant="outline" 
            onClick={onClear}
            className="h-11 gap-2 border-gray-200 hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}