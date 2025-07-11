import type { APIRoute } from "astro";
import { db } from "@/lib/db";
import { products, productCategories, wholesalePriceTiers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const GET: APIRoute = async ({ params }) => {
  const { id } = params;
  
  if (!id) {
    return new Response(JSON.stringify({ error: 'Product ID is required' }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Fetch product with categories and wholesale pricing
    const productData = await db.query.products.findFirst({
      where: eq(products.id, id),
      with: {
        categories: true,
        wholesalePriceTiers: true
      }
    });

    if (!productData) {
      return new Response(JSON.stringify({ error: 'Product not found' }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate mock variants based on product data
    // In a real app, you would fetch actual variants from the database
    const colors = ["Blue", "Green", "Yellow", "Red", "Orange"];
    const sizes = ["0-3 months", "3-6 months", "6-9 months", "9-12 months", "1-2 years", "2-3 years"];
    const genders = ["Boy", "Girl", "Unisex"];
    
    const variants = [];
    for (const color of colors) {
      for (const size of sizes) {
        variants.push({
          color,
          size,
          gender: genders[Math.floor(Math.random() * genders.length)],
          price: productData.userPrice * (1 - productData.userDiscountPercentage / 100),
          originalPrice: productData.userPrice,
          stock: Math.floor(Math.random() * 20) + 1,
          images: productData.images
        });
      }
    }

    // Format the response
    const formattedProduct = {
      id: productData.id,
      name: productData.name,
      brand: "Little Loopies", // Mock brand
      description: productData.description,
      price: productData.userPrice * (1 - productData.userDiscountPercentage / 100),
      originalPrice: productData.userPrice,
      discount: productData.userDiscountPercentage,
      rating: 4.5, // Mock rating
      reviews: 124, // Mock review count
      images: productData.images,
      sizes,
      colors,
      genders,
      variants,
      inStock: productData.productQuantity > 0,
      categories: productData.categories.map(cat => cat.categoryId),
      features: [
        "100% organic cotton",
        "Breathable fabric",
        "Machine washable",
        "Sustainable production",
        "Gentle on sensitive skin",
        "High-quality materials"
      ]
    };

    return new Response(JSON.stringify(formattedProduct), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch product' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};