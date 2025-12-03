"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Package, ShoppingBag, Settings, ArrowRight } from "lucide-react";

export default function Welcom() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium">
            <Package className="w-4 h-4" />
            MeyMey Sport Catalog
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 tracking-tight">
            ស្វាគមន៍មកកាន់{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              MeyMey Sport
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            រុករកផលិតផលកីឡាដែលមានគុណភាពខ្ពស់ពីម៉ាកល្បីៗដូចជា Nike, Adidas,
            Under Armour និងច្រើនទៀត។
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/catalog">
              <Button
                size="lg"
                className="h-14 px-8 text-lg gap-2 bg-gray-900 hover:bg-gray-800"
              >
                <ShoppingBag className="w-5 h-5" />
                មើលផលិតផល
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>

            <Link href="/admin">
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-lg gap-2 border-gray-300"
              >
                <Settings className="w-5 h-5" />
                គ្រប់គ្រង
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Package className="w-8 h-8" />}
            title="កាតាឡុកផលិតផល"
            description="រុករកផលិតផលទាំងអស់ជាមួយនឹងរូបភាពច្បាស់ និងព័ត៌មានលម្អិត"
          />
          <FeatureCard
            icon={<ShoppingBag className="w-8 h-8" />}
            title="ម៉ាកល្បីៗ"
            description="Nike, Adidas, Under Armour, Lululemon និងច្រើនទៀត"
          />
          <FeatureCard
            icon={<Settings className="w-8 h-8" />}
            title="ការគ្រប់គ្រងងាយស្រួល"
            description="បន្ថែម កែសម្រួល និងលុបផលិតផលបានយ៉ាងងាយស្រួល"
          />
        </div>
      </div>
    </div>
  );
}

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-gray-700 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

