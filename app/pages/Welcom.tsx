"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  ArrowRight,
  Package,
  Phone,
  MapPin,
  Facebook,
  ExternalLink,
  Info,
} from "lucide-react";
import { app, ProductEntity } from "@/app/api/appClient";

export default function Welcom() {
  const router = useRouter();
  const [featuredProducts, setFeaturedProducts] = useState<ProductEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(false);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const products = await app.entities.Product.list();
        const active = products
          .filter((p) => p.is_active !== false)
          .slice(0, 6);
        setFeaturedProducts(active);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Compact */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="space-y-6">
          <div className="space-y-4">
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              រុករកផលិតផលកីឡាដែលមានគុណភាពខ្ពស់ពីម៉ាកល្បីៗ
            </p>
            
            {/* Instructions */}
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                របៀបប្រើប្រាស់
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-muted-foreground">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold mt-0.5">
                    1
                  </div>
                  <p>
                    <strong className="text-foreground">ចូលគណនី:</strong> អ្នកត្រូវតែចូលគណនីជាមុនដើម្បីមើលកាតាឡុកផលិតផល។ ប្រសិនបើអ្នកមិនទាន់មានគណនី សូមទំនាក់ទំនង MeyMey Sport។
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold mt-0.5">
                    2
                  </div>
                  <p>
                    <strong className="text-foreground">រុករកផលិតផល:</strong> ចុចលើប៊ូតុង "មើលផលិតផល" ឬប្រើប្រាស់ម៉ឺនុយខាងលើដើម្បីរុករកកាតាឡុកផលិតផលទាំងអស់
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold mt-0.5">
                    3
                  </div>
                  <p>
                    <strong className="text-foreground">ស្វែងរក:</strong> ប្រើប្រាស់ប្រអប់ស្វែងរកតាមម៉ាក និងប្រភេទដើម្បីស្វែងរកផលិតផលដែលអ្នកចង់បាន
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold mt-0.5">
                    4
                  </div>
                  <p>
                    <strong className="text-foreground">មើលព័ត៌មានលម្អិត:</strong> ចុចលើផលិតផលណាមួយដើម្បីមើលរូបភាព ទំហំ និងព័ត៌មានលម្អិតផ្សេងៗ
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold mt-0.5">
                    5
                  </div>
                  <p>
                    <strong className="text-foreground">ទំនាក់ទំនង:</strong> សម្រាប់ការបញ្ជាទិញ ឬសំណួរ សូមទំនាក់ទំនងតាមទូរស័ព្ទ ឬ Facebook ដែលមាននៅខាងក្រោម
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 space-y-4">
            {/* Login Requirement Notice */}
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 sm:p-5">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-full flex items-center justify-center">
                  <Info className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold text-foreground text-sm sm:text-base">
                    ចំណាំ: កាតាឡុកត្រូវការចូលគណនី
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    ដើម្បីមើលកាតាឡុកផលិតផល អ្នកត្រូវតែចូលគណនីជាមុន។ ប្រសិនបើអ្នកមិនទាន់មានគណនី សូមទំនាក់ទំនង <strong className="text-foreground">MeyMey Sport</strong> ដើម្បីបង្កើតគណនី។
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                    <a
                      href="tel:+85512862336"
                      className="inline-flex items-center gap-2 text-sm sm:text-base text-primary hover:text-primary/80 font-medium transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      <span>ទូរស័ព្ទ: 012 862 336</span>
                    </a>
                    <span className="hidden sm:inline text-muted-foreground">•</span>
                    <a
                      href="https://www.facebook.com/meymey1789/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm sm:text-base text-primary hover:text-primary/80 font-medium transition-colors"
                    >
                      <Facebook className="w-4 h-4" />
                      <span>Facebook</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <Button
              size="lg"
              onClick={async () => {
                setCheckingAuth(true);
                try {
                  const user = await app.auth.me();
                  if (user) {
                    router.push("/catalog");
                  } else {
                    router.push("/login");
                  }
                } catch (err) {
                  router.push("/login");
                } finally {
                  setCheckingAuth(false);
                }
              }}
              disabled={checkingAuth}
              className="w-full sm:w-auto h-14 px-8 sm:px-10 text-base rounded-md font-medium disabled:opacity-50"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              {checkingAuth ? "កំពុងពិនិត្យ..." : "មើលផលិតផល"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products - Compact Grid */}
      {!loading && featuredProducts.length > 0 && (
        <>
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="border-t border-border"></div>
          </div>

          <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-1">
                ផលិតផលពេញនិយម
              </h2>
              <div className="w-16 h-0.5 bg-primary"></div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5 mb-8">
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/product-detail?id=${product.id}`}
                  className="group"
                >
                  <div className="space-y-2">
                    <div className="aspect-square bg-muted overflow-hidden rounded-md">
                      {product.cover_image ? (
                        <img
                          src={product.cover_image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:opacity-80 transition-opacity duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-10 h-10 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                        {product.brand}
                      </p>
                      <h3 className="text-sm sm:text-base text-foreground line-clamp-2 font-medium leading-snug">
                        {product.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center">
              <Button
                variant="outline"
                onClick={async () => {
                  setCheckingAuth(true);
                  try {
                    const user = await app.auth.me();
                    if (user) {
                      router.push("/catalog");
                    } else {
                      router.push("/login");
                    }
                  } catch (err) {
                    router.push("/login");
                  } finally {
                    setCheckingAuth(false);
                  }
                }}
                disabled={checkingAuth}
                className="w-full sm:w-auto h-12 px-6 sm:px-8 text-base gap-2 font-medium disabled:opacity-50"
              >
                {checkingAuth ? "កំពុងពិនិត្យ..." : "មើលផលិតផលទាំងអស់"}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </section>
        </>
      )}

      {/* Contact Section - Compact */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="border-t border-border"></div>
      </div>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-foreground mb-1">
            ទំនាក់ទំនង
          </h2>
          <div className="w-12 sm:w-16 h-0.5 bg-primary"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
          <ContactItem
            icon={<Phone className="w-6 h-6" />}
            title="ទូរស័ព្ទទំនាក់ទំនង"
            items={[
              { text: "012 862 336", link: "tel:+85512862336" },
              { text: "017 624 725", link: "tel:+85517624725" },
              { text: "095 617 711", link: "tel:+85595617711" },
            ]}
          />
          <ContactItem
            icon={<MapPin className="w-6 h-6" />}
            title="ទីតាំង"
            items={[
              {
                text: "មើលទីតាំងនៅលើ Google Maps",
                link: "https://share.google/Qtrhc9lwxV7FQXCS1",
                external: true,
              },
            ]}
          />
          <ContactItem
            icon={<Facebook className="w-6 h-6" />}
            title="Facebook"
            items={[
              {
                text: "ទៅកាន់ Facebook",
                link: "https://www.facebook.com/meymey1789/",
                external: true,
              },
            ]}
          />
        </div>
      </section>
    </div>
  );
}

type ContactItemProps = {
  icon: React.ReactNode;
  title: string;
  items: Array<{ text: string; link: string; external?: boolean }>;
};

function ContactItem({ icon, title, items }: ContactItemProps) {
  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="text-foreground">{icon}</div>
      <h3 className="text-base sm:text-lg md:text-xl font-semibold text-foreground">{title}</h3>
      <div className="space-y-2 sm:space-y-3">
        {items.map((item, index) => (
          <a
            key={index}
            href={item.link}
            target={item.external ? "_blank" : undefined}
            rel={item.external ? "noopener noreferrer" : undefined}
            className="block text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors group font-medium"
          >
            {item.text}
            {item.external && (
              <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 inline-block ml-2 opacity-70 group-hover:opacity-100 transition-opacity" />
            )}
          </a>
        ))}
      </div>
    </div>
  );
}

