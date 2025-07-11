import type { APIRoute } from "astro";
import { db } from "@/lib/db";
import { products, store } from "@/lib/db/schema";
import { like, or } from "drizzle-orm";

export const GET: APIRoute = async ({ url }) => {
  const query = url.searchParams.get("q");
  
  if (!query) {
    return new Response(JSON.stringify([]), { status: 200 });
  }

  try {
    const searchTerm = `%${query}%`;

    // Search products
    const productResults = await db.query.products.findMany({
      where: or(
        like(products.name, searchTerm),
        like(products.description, searchTerm)
      ),
      limit: 5,
    });

    // Search stores
    const storeResults = await db.query.store.findMany({
      where: or(
        like(store.storeName, searchTerm),
        like(store.name, searchTerm)
      ),
      limit: 5,
    });

    // Format results
    const results = [
      ...productResults.map(product => ({
        id: product.id,
        type: 'product' as const,
        name: product.name,
        href: `/product/${product.id}`,
        image: product.images?.[0],
      })),
      ...storeResults.map(store => ({
        id: store.id,
        type: 'store' as const,
        name: store.storeName,
        href: `/dashboard/stores/${store.id}`,
      })),
    ];

    return new Response(JSON.stringify(results), { status: 200 });
  } catch (error) {
    console.error('Search error:', error);
    return new Response(JSON.stringify({ error: 'Search failed' }), { status: 500 });
  }
}; 