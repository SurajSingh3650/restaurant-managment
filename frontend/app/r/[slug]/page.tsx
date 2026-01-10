// AI assisted development
import { notFound } from "next/navigation";
import { getRestaurantBySlug } from "@/lib/db";

export default async function RestaurantPage({
  params,
}: {
  params: { slug: string };
}) {
  const restaurant = await getRestaurantBySlug(params.slug);

  if (!restaurant) {
    notFound();
  }

  const groupedMenu = restaurant.menu.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, typeof restaurant.menu>
  );

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: restaurant.theme.secondaryColor || "#ffffff",
        color: restaurant.theme.primaryColor || "#000000",
      }}
    >
      {/* Header */}
      <header
        className="py-12 px-4 text-center"
        style={{
          backgroundColor: restaurant.theme.primaryColor || "#000000",
          color: restaurant.theme.secondaryColor || "#ffffff",
        }}
      >
        {restaurant.logoUrl && (
          <img
            src={restaurant.logoUrl}
            alt={restaurant.name}
            className="mx-auto mb-4 h-24 w-auto object-contain"
          />
        )}
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{restaurant.name}</h1>
        <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
          {restaurant.description}
        </p>
      </header>

      {/* Cover Image */}
      {restaurant.coverImageUrl && (
        <div className="w-full h-64 md:h-96 overflow-hidden">
          <img
            src={restaurant.coverImageUrl}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Contact Info */}
        <section className="mb-12 grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold mb-2 text-lg">📍 Address</h3>
            <p className="opacity-80">{restaurant.address}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-lg">📞 Phone</h3>
            <a
              href={`tel:${restaurant.phone}`}
              className="opacity-80 hover:opacity-100 transition-opacity"
            >
              {restaurant.phone}
            </a>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-lg">✉️ Email</h3>
            <a
              href={`mailto:${restaurant.email}`}
              className="opacity-80 hover:opacity-100 transition-opacity"
            >
              {restaurant.email}
            </a>
          </div>
        </section>

        {/* Menu */}
        {restaurant.menu.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Menu</h2>
            <div className="space-y-12">
              {Object.entries(groupedMenu).map(([category, items]) => (
                <div key={category}>
                  <h3 className="text-2xl font-semibold mb-6 pb-2 border-b-2">
                    {category}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-xl font-semibold">{item.name}</h4>
                          <span className="text-lg font-bold">
                            ${item.price.toFixed(2)}
                          </span>
                        </div>
                        {item.description && (
                          <p className="opacity-80 mt-2">{item.description}</p>
                        )}
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="mt-4 w-full h-48 object-cover rounded-lg"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {restaurant.menu.length === 0 && (
          <section className="text-center py-12">
            <p className="text-xl opacity-80">Menu coming soon!</p>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer
        className="py-8 px-4 text-center mt-12"
        style={{
          backgroundColor: restaurant.theme.primaryColor || "#000000",
          color: restaurant.theme.secondaryColor || "#ffffff",
        }}
      >
        <p className="opacity-80">
          © {new Date().getFullYear()} {restaurant.name}. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

