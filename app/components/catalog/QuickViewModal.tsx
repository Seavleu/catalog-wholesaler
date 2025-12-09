import React from 'react';
import Link from 'next/link';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, X, ChevronLeft, ChevronRight, ArrowRight, Layers, Camera, Send, MessageCircle } from 'lucide-react';

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
  if (!product) return null;

  const catalogCount = product.catalog_images?.length || 0;
  const variantCount = product.variants?.length || 0;

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
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

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

              {catalogCount > 0 && (
                <div className="mt-5">
                  <p className="text-sm font-medium text-muted-foreground mb-2">រូបភាពមើលមុន</p>
                  <div className="flex gap-2 flex-wrap">
                    {product.catalog_images?.slice(0, 5).map((img, i) => (
                      <div key={i} className="w-14 h-14 rounded-lg overflow-hidden border-2 border-border hover:border-primary transition-colors">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                    {catalogCount > 5 && (
                      <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center text-sm font-semibold text-muted-foreground border-2 border-border">
                        +{catalogCount - 5}
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