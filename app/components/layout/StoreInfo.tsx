"use client";

import React from "react";
import { Phone, MapPin, Facebook, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StoreInfo() {
  const phoneNumbers = [
    { number: "012 862 336", link: "tel:+85512862336" },
    { number: "017 624 725", link: "tel:+85517624725" },
    { number: "095 617 711", link: "tel:+85595617711" },
  ];

  const locationUrl = "https://share.google/Qtrhc9lwxV7FQXCS1";
  const facebookUrl = "https://www.facebook.com/meymey1789/";

  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Phone Numbers */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Phone className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">ទូរស័ព្ទទំនាក់ទំនង</h3>
            </div>
            <div className="space-y-2">
              {phoneNumbers.map((phone, index) => (
                <a
                  key={index}
                  href={phone.link}
                  className="block text-gray-700 hover:text-green-600 transition-colors font-medium"
                >
                  {phone.number}
                </a>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">ទីតាំង</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              មើលទីតាំងហាងរបស់យើងនៅលើ Google Maps
            </p>
            <a
              href={locationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              <span>មើលទីតាំង</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Facebook */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Facebook className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Facebook</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              ទាក់ទងយើងតាមរយៈ Facebook
            </p>
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
            >
              <Facebook className="w-4 h-4" />
              <span>ទៅកាន់ Facebook</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

