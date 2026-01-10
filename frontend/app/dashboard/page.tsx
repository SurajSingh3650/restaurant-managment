// AI assisted development
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAuthHeaders, getToken, removeToken } from "@/lib/auth-client";
import { Restaurant } from "@/types";

export default function DashboardPage() {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }
    fetchRestaurants();
  }, [router]);

  const fetchRestaurants = async () => {
    try {
      // First get current user
      const userResponse = await fetch("/api/auth/me", {
        headers: getAuthHeaders(),
      });

      if (userResponse.status === 401) {
        removeToken();
        router.push("/login");
        return;
      }

      const user = await userResponse.json();
      
      // Then get restaurants for this user
      const response = await fetch(`/api/restaurants?userId=${user.id}`, {
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        removeToken();
        router.push("/login");
        return;
      }

      const data = await response.json();
      setRestaurants(data);
    } catch (err) {
      setError("Failed to load restaurants");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    removeToken();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-orange-600">My Restaurants</h1>
          <div className="flex gap-4 items-center">
            <Link
              href="/dashboard/new"
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              + New Restaurant
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-gray-700 hover:text-orange-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {restaurants.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🍽️</div>
            <h2 className="text-2xl font-semibold mb-2 text-gray-900">
              No restaurants yet
            </h2>
            <p className="text-gray-600 mb-6">
              Create your first restaurant website to get started!
            </p>
            <Link
              href="/dashboard/new"
              className="inline-block px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
            >
              Create Restaurant
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {restaurant.coverImageUrl && (
                  <img
                    src={restaurant.coverImageUrl}
                    alt={restaurant.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    {restaurant.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {restaurant.description}
                  </p>
                  <div className="flex gap-2">
                    <Link
                      href={`/dashboard/edit/${restaurant.id}`}
                      className="flex-1 text-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/r/${restaurant.slug}`}
                      target="_blank"
                      className="flex-1 text-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      View Site
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

