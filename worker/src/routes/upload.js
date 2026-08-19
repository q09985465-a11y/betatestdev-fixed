import { corsHeaders } from "../utils/cors";
import { uploadToR2 } from "../services/uploadService";

export async function uploadRoutes(request, env) {

  const url = new URL(request.url);

  if (url.pathname !== "/upload") {
    return null;
  }

  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  // =========================
  // ELIMINAR IMAGEN
  // =========================
  if (request.method === "DELETE") {

    try {

      const { filename } = await request.json();

      if (!filename) {
        return new Response(
          JSON.stringify({
            error: "Filename requerido",
          }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders,
            },
          }
        );
      }

      await env.betatestdev_images.delete(filename);

      return new Response(
        JSON.stringify({
          success: true,
        }),
        {
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );

    } catch (error) {

      console.error(error);

      return new Response(
        JSON.stringify({
          error: error.message,
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );

    }

  }

  // =========================
  // SUBIR IMÁGENES
  // =========================
  if (request.method !== "POST") {
    return null;
  }

  const formData = await request.formData();

  const files = formData.getAll("files");

  if (!files.length) {
    return new Response(
      JSON.stringify({
        error: "No files provided",
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
  ];

  const MAX_SIZE = 10 * 1024 * 1024;

  const uploaded = [];

  for (const file of files) {

    if (!allowedTypes.includes(file.type)) {
      console.warn(`Tipo no permitido: ${file.name}`);
      continue;
    }

    if (file.size > MAX_SIZE) {
      console.warn(`${file.name} excede el tamaño permitido`);
      continue;
    }

    const fileName = await uploadToR2(
      file,
      env.betatestdev_images
    );

    uploaded.push({
      filename: fileName,
      url: `/images/${fileName}`,
      contentType: file.type,
      size: file.size,
    });

  }

  if (!uploaded.length) {

    return new Response(
      JSON.stringify({
        error: "No se pudo subir ningún archivo válido.",
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );

  }

  return new Response(
    JSON.stringify({
      success: true,
      files: uploaded,
    }),
    {
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    }
  );

}