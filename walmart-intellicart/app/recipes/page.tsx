"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { RecipeMatcher } from "@/components/recipe-matcher";
import { Header } from "@/components/header";

const mockInventory = [
  "tomatoes",
  "onions",
  "garlic",
  "olive oil",
  "salt",
  "pepper",
  "chicken breast",
  "rice",
  "pasta",
  "cheese",
  "eggs",
  "milk",
  "butter",
  "flour",
  "sugar",
];

export default function RecipesPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header title="Recipe Matcher" />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Smart Recipe Matching
              </h1>
              <p className="text-gray-600">
                Enter a YouTube recipe URL to see which ingredients you already have in your kitchen
              </p>
            </div>
            
            <RecipeMatcher inventory={mockInventory} />
            
            <div className="mt-8 p-6 bg-white rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">How it works</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <h3 className="font-medium mb-2">Paste Recipe URL</h3>
                  <p className="text-sm text-gray-600">
                    Copy and paste any YouTube recipe video URL
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  <h3 className="font-medium mb-2">AI Analysis</h3>
                  <p className="text-sm text-gray-600">
                    Our AI extracts ingredients from the recipe video
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">3</span>
                  </div>
                  <h3 className="font-medium mb-2">Smart Matching</h3>
                  <p className="text-sm text-gray-600">
                    Compare with your kitchen inventory to see what you need
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 