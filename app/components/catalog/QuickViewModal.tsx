import React, { useState } from 'react';
import Link from 'next/link';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Package, ChevronLeft, ChevronRight, ArrowRight, Layers, Camera, Send, MessageCircle, Download, CheckSquare, Square } from 'lucide-react';

type Product = {
  id: string;
  name?: string;
  brand?: string;
  category?: string;
  cover_image?: string;
  catalog_images?: string[];
  notes?: string;
  variants?: unknown[];
};

type QuickViewModalProps = {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
};

export default function QuickViewModal({ 
  product, 
  open, 
  onClose, 
  onPrevious, 
  onNext,
  hasPrevious,
  hasNext 
}: QuickViewModalProps) {
  const [selectedImages, setSelectedImages] = useState<Set<number>>(new Set());
  const [showSelection, setShowSelection] = useState(false);

  if (!product) return null;

  const catalogCount = product.catalog_images?.length || 0;
  const variantCount = product.variants?.length || 0;

  const allImages = [
    product.cover_image,
    ...(product.catalog_images || []),
  ].filter(Boolean) as string[];

  const toggleImageSelection = (index: number) => {
    setSelectedImages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const selectAllImages = () => {
    setSelectedImages(new Set(allImages.map((_, i) => i)));
  };

  const clearSelection = () => {
    setSelectedImages(new Set());
    setShowSelection(false);
  };

  const downloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Failed to download image:", err);
    }
  };

  const downloadSelectedImages = async () => {
    if (selectedImages.size === 0) return;
    
    const selectedArray = Array.from(selectedImages).sort((a, b) => a - b);
    
    for (let i = 0; i < selectedArray.length; i++) {
      const index = selectedArray[i];
      const imageUrl = allImages[index];
      const urlParts = imageUrl.split("/");
      const originalFilename = urlParts[urlParts.length - 1] || `image-${index + 1}`;
      const filename = `${product.name?.replace(/[^a-zA-Z0-9]/g, "_") || "product"}_${index + 1}_${originalFilename}`;
      
      if (i > 0) {
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
      
      await downloadImage(imageUrl, filename);
    }
    
    clearSelection();
  };

  const downloadAllImages = async () => {
    for (let i = 0; i < allImages.length; i++) {
      const imageUrl = allImages[i];
      const urlParts = imageUrl.split("/");
      const originalFilename = urlParts[urlParts.length - 1] || `image-${i + 1}`;
      const filename = `${product.name?.replace(/[^a-zA-Z0-9]/g, "_") || "product"}_${i + 1}_${originalFilename}`;
      
      if (i > 0) {
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
      
      await downloadImage(imageUrl, filename);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-[95vw] sm:w-full p-0 overflow-hidden rounded-xl sm:rounded-2xl border-0 shadow-2xl mx-2 sm:mx-0">
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="relative w-full md:w-1/2 aspect-square bg-muted">
            {product.cover_image ? (
              <img 
                src={product.cover_image} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-16 h-16 text-muted-foreground" />
              </div>
            )}
            
            {(catalogCount > 0 || product.cover_image) && (
              <Badge className="absolute bottom-4 left-4 bg-primary/80 text-primary-foreground backdrop-blur-sm text-sm py-1.5 px-3">
                {(() => {
                  let count = product.cover_image ? 1 : 0;
                  if (product.catalog_images?.length) {
                    product.catalog_images.forEach(img => {
                      if (img !== product.cover_image) count++;
                    });
                  }
                  return count;
                })()} រូបភាព
              </Badge>
            )}

            {/* Navigation Arrows */}
            {hasPrevious && (
              <button
                onClick={(e) => { e.stopPropagation(); onPrevious(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 bg-background/95 rounded-full shadow-lg hover:bg-background hover:scale-105 transition-all"
              >
                <ChevronLeft className="w-5 h-5 text-foreground" />
              </button>
            )}
            {hasNext && (
              <button
                onClick={(e) => { e.stopPropagation(); onNext(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-background/95 rounded-full shadow-lg hover:bg-background hover:scale-105 transition-all"
              >
                <ChevronRight className="w-5 h-5 text-foreground" />
              </button>
            )}
          </div>

          {/* Details Section */}
          <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col bg-card">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">{product.brand}</p>
              <h2 className="text-2xl font-bold text-foreground mt-1 leading-tight">{product.name}</h2>
              
              <div className="flex items-center gap-2 mt-4">
                <Badge variant="secondary" className="font-medium">
                  {product.category}
                </Badge>
                {variantCount > 0 && (
                  <Badge variant="outline" className="gap-1">
                    <Layers className="w-3 h-3" />
                    {variantCount} variants
                  </Badge>
                )}
              </div>

              {product.notes && (
                <p className="text-sm text-muted-foreground mt-5 p-3 bg-muted rounded-xl border border-border">{product.notes}</p>
              )}

              {/* Image Gallery with Download */}
              {allImages.length > 0 && (
                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-muted-foreground">រូបភាព</p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={showSelection ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setShowSelection(!showSelection);
                          if (!showSelection) {
                            selectAllImages();
                          } else {
                            clearSelection();
                          }
                        }}
                        className="gap-1.5 h-8 text-xs"
                      >
                        {showSelection ? (
                          <>
                            <CheckSquare className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">បិទ</span>
                          </>
                        ) : (
                          <>
                            <Square className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">ជ្រើស</span>
                          </>
                        )}
                      </Button>
                      {showSelection && selectedImages.size > 0 ? (
                        <Button
                          size="sm"
                          onClick={downloadSelectedImages}
                          className="gap-1.5 h-8 text-xs"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">ទាញយក</span>
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={downloadAllImages}
                          className="gap-1.5 h-8 text-xs"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">ទាំងអស់</span>
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {allImages.slice(0, 8).map((img, i) => (
                      <div key={i} className="relative">
                        {showSelection && (
                          <div className="absolute top-1 right-1 z-10">
                            <Checkbox
                              checked={selectedImages.has(i)}
                              onCheckedChange={() => toggleImageSelection(i)}
                              className="bg-background border-2 w-4 h-4"
                            />
                          </div>
                        )}
                        <div className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-colors ${
                          showSelection && selectedImages.has(i)
                            ? "border-primary ring-2 ring-primary"
                            : "border-border hover:border-primary"
                        }`}>
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </div>
                      </div>
                    ))}
                    {allImages.length > 8 && (
                      <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground border-2 border-border">
                        +{allImages.length - 8}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Telegram Instructions */}
            <div className="mt-5 bg-primary/10 border border-primary/20 rounded-lg p-3">
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Camera className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-2">
                    ថតរូបផលិតផលនេះ និងផ្ញើមកកាន់ Telegram
                  </p>
                  <a
                    href="https://t.me/your_telegram_username"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md font-medium text-xs transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Telegram</span>
                    <Send className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            <Link href={`/product-detail?id=${product.id}`} className="block mt-4">
              <Button className="w-full h-12 text-base font-semibold gap-2">
                មើលព័ត៌មានលម្អិត
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}