import type { APIRoute } from "astro";
import { uploadProductFiles } from "@/lib/aws/ProductFileUploader";

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const productName = formData.get('productName') as string;

    if (!files?.length) {
      return new Response(JSON.stringify({ 
        error: 'No files provided' 
      }), { 
        status: 400 
      });
    }

    const results = await uploadProductFiles(productName, files);
    
    return new Response(JSON.stringify({ 
      success: true, 
      urls: results.map(r => r.url) 
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    return new Response(JSON.stringify({ 
      error: 'Upload failed' 
    }), { 
      status: 500 
    });
  }
}