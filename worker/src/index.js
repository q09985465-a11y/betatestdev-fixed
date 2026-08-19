import { corsHeaders, json } from "./utils/cors";
import {authRoutes} from "./routes/auth";
import { productRoutes } from "./routes/products";
import { categoryRoutes } from "./routes/categories";
import { uploadRoutes } from "./routes/upload";
import { imageRoutes } from "./routes/images";

export default {
  async fetch(request, env, ctx) {
	  
	// Autenticación
    const auth = await authRoutes(request, env);
    if (auth) return auth;

    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (url.pathname === "/") {
      return json({ ok: true });
    }

    // Productos
    const products = await productRoutes(request, env);
    if (products) return products;

    // Categorías
    const categories = await categoryRoutes(request, env);
	if (categories) return categories;

    // Upload
    const upload = await uploadRoutes(request, env);
    if (upload) return upload;

    // Imágenes
    const image = await imageRoutes(request, env);
    if (image) return image;

    // Cualquier otra ruta: servir el frontend (React Router se encarga del resto)
    return env.ASSETS.fetch(request);
  }
}