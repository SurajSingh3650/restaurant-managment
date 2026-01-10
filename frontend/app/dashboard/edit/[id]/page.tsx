// AI assisted development
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getAuthHeaders, getToken } from "@/lib/auth-client";
import Link from "next/link";
import { Restaurant, MenuItem } from "@/types";

export default function EditRestaurantPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"details" | "menu">("details");

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }
    fetchRestaurant();
  }, [id, router]);

  const fetchRestaurant = async () => {
    try {
      const response = await fetch(`/api/restaurants/${id}`, {
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok) {
        setError("Restaurant not found");
        return;
      }

      const data = await response.json();
      setRestaurant(data);
    } catch (err) {
      setError("Failed to load restaurant");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!restaurant) return;

    setSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/restaurants/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(restaurant),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Failed to update restaurant");
        return;
      }

      const updated = await response.json();
      setRestaurant(updated);
      alert("Restaurant updated successfully!");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const addMenuItem = () => {
    if (!restaurant) return;
    const newItem: MenuItem = {
      id: crypto.randomUUID(),
      name: "",
      description: "",
      price: 0,
      category: "Main",
      imageUrl: "",
    };
    setRestaurant({
      ...restaurant,
      menu: [...restaurant.menu, newItem],
    });
  };

  const updateMenuItem = (itemId: string, updates: Partial<MenuItem>) => {
    if (!restaurant) return;
    setRestaurant({
      ...restaurant,
      menu: restaurant.menu.map((item) =>
        item.id === itemId ? { ...item, ...updates } : item
      ),
    });
  };

  const removeMenuItem = (itemId: string) => {
    if (!restaurant) return;
    setRestaurant({
      ...restaurant,
      menu: restaurant.menu.filter((item) => item.id !== itemId),
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">Restaurant not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold text-orange-600">
            ← Back to Dashboard
          </Link>
          <Link
            href={`/r/${restaurant.slug}`}
            target="_blank"
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            View Website
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Edit Restaurant</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b flex">
            <button
              onClick={() => setActiveTab("details")}
              className={`px-6 py-3 font-semibold ${
                activeTab === "details"
                  ? "border-b-2 border-orange-600 text-orange-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab("menu")}
              className={`px-6 py-3 font-semibold ${
                activeTab === "menu"
                  ? "border-b-2 border-orange-600 text-orange-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Menu
            </button>
          </div>

          <div className="p-6">
            {activeTab === "details" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Restaurant Name
                  </label>
                  <input
                    type="text"
                    value={restaurant.name}
                    onChange={(e) =>
                      setRestaurant({ ...restaurant, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={restaurant.description}
                    onChange={(e) =>
                      setRestaurant({ ...restaurant, description: e.target.value })
                    }
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      value={restaurant.address}
                      onChange={(e) =>
                        setRestaurant({ ...restaurant, address: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={restaurant.phone}
                      onChange={(e) =>
                        setRestaurant({ ...restaurant, phone: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={restaurant.email}
                      onChange={(e) =>
                        setRestaurant({ ...restaurant, email: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      value={restaurant.website || ""}
                      onChange={(e) =>
                        setRestaurant({ ...restaurant, website: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "menu" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">Menu Items</h3>
                  <button
                    onClick={addMenuItem}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    + Add Item
                  </button>
                </div>

                {restaurant.menu.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-lg p-4 space-y-4"
                  >
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Item Name
                        </label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) =>
                            updateMenuItem(item.id, { name: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                          placeholder="Pizza Margherita"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category
                        </label>
                        <input
                          type="text"
                          value={item.category}
                          onChange={(e) =>
                            updateMenuItem(item.id, { category: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                          placeholder="Main Course"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={item.description}
                        onChange={(e) =>
                          updateMenuItem(item.id, { description: e.target.value })
                        }
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        placeholder="Delicious description..."
                      />
                    </div>

                    <div className="flex gap-4 items-end">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price ($)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={item.price}
                          onChange={(e) =>
                            updateMenuItem(item.id, {
                              price: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                      <button
                        onClick={() => removeMenuItem(item.id)}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

                {restaurant.menu.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No menu items yet. Click "Add Item" to get started.
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 pt-6 border-t">
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

