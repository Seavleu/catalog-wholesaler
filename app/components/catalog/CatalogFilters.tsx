import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X } from "lucide-react";

const CATEGORIES = ["All", "សម្លៀកបំពាក់កីឡាបុរស", "សម្លៀកបំពាក់កីឡាស្ត្រី", "អាវបាល់ទាត់", "អាវបាល់បោះ", "កាបូបស្ពាយ", "កាបូប", "សម្លៀកបំពាក់ម៉ូតូ", "សំលៀកបំពាក់ហែលទឹកស្ត្រី", "ស្រោមជើង", "ខោក្នុងបុរស"];

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
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
          <Input
            placeholder="ស្វែងរកផលិតផល, ម៉ាក, ឬប្រភេទ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 sm:pl-10 h-11 sm:h-12 text-sm sm:text-base"
          />
        </div>

        {/* Category Filter */}
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-44 h-11 sm:h-12 text-sm sm:text-base">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map(cat => (
              <SelectItem key={cat} value={cat} className="text-sm sm:text-base">
                {cat === "All" ? "មើលទាំងអស់" : cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Brand Filter */}
        <Select value={selectedBrand} onValueChange={setSelectedBrand}>
          <SelectTrigger className="w-full sm:w-44 h-11 sm:h-12 text-sm sm:text-base">
            <SelectValue placeholder="Brand" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All" className="text-sm sm:text-base">ម៉ាកទាំងអស់</SelectItem>
            {brands.map(brand => (
              <SelectItem key={brand} value={brand} className="text-sm sm:text-base">{brand}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button 
            variant="outline" 
            onClick={onClear}
            className="h-11 sm:h-12 gap-2 text-sm sm:text-base w-full sm:w-auto"
          >
            <X className="w-4 h-4" />
            <span className="whitespace-nowrap">លុបតម្រង</span>
          </Button>
        )}
      </div>
    </div>
  );
}