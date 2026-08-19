import { corsHeaders } from "../utils/cors";

export async function imageRoutes(request, env) {
  const url = new URL(request.url);

  if (!url.pathname.startsWith("/images/")) {
    return null;
  }

  const filename = decodeURIComponent(
    url.pathname.replace("/images/", "")
  );
  
  
  if (!filename) {
    return new Response("Nombre de imagen inválido", {
      status:400,
      headers:corsHeaders
    });
  }

  const object = await env.betatestdev_images.get(filename);

  if (!object) {
    return new Response("Imagen no encontrada", {
      status: 404,
      headers: corsHeaders,
    });
  }

  const headers = new Headers(corsHeaders);

  headers.set(
    "Content-Type",
    object.httpMetadata?.contentType || "application/octet-stream"
  );

  headers.set(
    "Cache-Control",
    "public, max-age=31536000, immutable"
  );

  return new Response(object.body, {
    headers,
  });
}