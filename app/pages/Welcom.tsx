"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  ArrowRight,
  Package,
  Star,
  TrendingUp,
  Phone,
  MapPin,
  Facebook,
  ExternalLink,
} from "lucide-react";
import { app, ProductEntity } from "@/app/api/appClient";

export default function Welcom() {
  const [featuredProducts, setFeaturedProducts] = useState<ProductEntity[]>([]);
  const [loading, setLoading] = useState(true);

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
    <div className="min-h-screen bg-white">
      {/* Hero Section - Compact */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="space-y-6">
          <div className="space-y-4">
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed">
              រុករកផលិតផលកីឡាដែលមានគុណភាពខ្ពស់ពីម៉ាកល្បីៗ
            </p>
            
            {/* Instructions */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                របៀបប្រើប្រាស់
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-gray-700">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-semibold mt-0.5">
                    1
                  </div>
                  <p>
                    <strong className="text-gray-900">រុករកផលិតផល:</strong> ចុចលើប៊ូតុង "មើលផលិតផល" ឬប្រើប្រាស់ម៉ឺនុយខាងលើដើម្បីរុករកកាតាឡុកផលិតផលទាំងអស់
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-semibold mt-0.5">
                    2
                  </div>
                  <p>
                    <strong className="text-gray-900">ចម្រៀង/តម្រង:</strong> ប្រើប្រាស់ប្រអប់ស្វែងរកឬតម្រងតាមម៉ាក និងប្រភេទដើម្បីស្វែងរកផលិតផលដែលអ្នកចង់បាន
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-semibold mt-0.5">
                    3
                  </div>
                  <p>
                    <strong className="text-gray-900">មើលព័ត៌មានលម្អិត:</strong> ចុចលើផលិតផលណាមួយដើម្បីមើលរូបភាព ទំហំ និងព័ត៌មានលម្អិតផ្សេងៗ
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-semibold mt-0.5">
                    4
                  </div>
                  <p>
                    <strong className="text-gray-900">ទំនាក់ទំនង:</strong> សម្រាប់ការបញ្ជាទិញ ឬសំណួរ សូមទំនាក់ទំនងតាមទូរស័ព្ទ ឬ Facebook ដែលមាននៅខាងក្រោម
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Link href="/catalog" className="block w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto h-14 px-8 sm:px-10 text-base rounded-md bg-black hover:bg-gray-800 text-white font-medium"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                មើលផលិតផល
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="border-t border-gray-200"></div>
      </div>

      {/* Features - Compact Grid */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid md:grid-cols-3 gap-8 md:gap-10">
          <FeatureItem
            icon={<Package className="w-6 h-6" />}
            title="កាតាឡុកផលិតផល"
            description="រុករកផលិតផលទាំងអស់ជាមួយនឹងរូបភាពច្បាស់"
          />
          <FeatureItem
            icon={<Star className="w-6 h-6" />}
            title="ម៉ាកល្បីៗ"
            description="Nike, Adidas, Under Armour និងច្រើនទៀត"
          />
          <FeatureItem
            icon={<TrendingUp className="w-6 h-6" />}
            title="គុណភាពខ្ពស់"
            description="ផលិតផលដែលមានគុណភាពខ្ពស់ និងតម្លៃសមរម្យ"
          />
        </div>
      </section>

      {/* Featured Products - Compact Grid */}
      {!loading && featuredProducts.length > 0 && (
        <>
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="border-t border-gray-200"></div>
          </div>

          <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-1">
                ផលិតផលពេញនិយម
              </h2>
              <div className="w-16 h-0.5 bg-gray-900"></div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5 mb-8">
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/product-detail?id=${product.id}`}
                  className="group"
                >
                  <div className="space-y-2">
                    <div className="aspect-square bg-gray-50 overflow-hidden rounded-md">
                      {product.cover_image ? (
                        <img
                          src={product.cover_image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:opacity-80 transition-opacity duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-10 h-10 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs sm:text-sm text-gray-500 font-medium">
                        {product.brand}
                      </p>
                      <h3 className="text-sm sm:text-base text-gray-900 line-clamp-2 font-medium leading-snug">
                        {product.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center">
              <Link href="/catalog" className="inline-block w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto h-12 px-6 sm:px-8 text-base gap-2 border-2 border-gray-300 hover:border-gray-900 font-medium"
                >
                  មើលផលិតផលទាំងអស់
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </section>
        </>
      )}

      {/* Contact Section - Compact */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="border-t border-gray-200"></div>
      </div>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-1">
            ទំនាក់ទំនង
          </h2>
          <div className="w-16 h-0.5 bg-gray-900"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-10">
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

type FeatureItemProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

function FeatureItem({ icon, title, description }: FeatureItemProps) {
  return (
    <div className="space-y-3">
      <div className="text-gray-900">{icon}</div>
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{title}</h3>
      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{description}</p>
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
    <div className="space-y-4">
      <div className="text-gray-900">{icon}</div>
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{title}</h3>
      <div className="space-y-3">
        {items.map((item, index) => (
          <a
            key={index}
            href={item.link}
            target={item.external ? "_blank" : undefined}
            rel={item.external ? "noopener noreferrer" : undefined}
            className="block text-base text-gray-600 hover:text-gray-900 transition-colors group font-medium"
          >
            {item.text}
            {item.external && (
              <ExternalLink className="w-4 h-4 inline-block ml-2 opacity-70 group-hover:opacity-100 transition-opacity" />
            )}
          </a>
        ))}
      </div>
    </div>
  );
}

