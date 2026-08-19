import { json } from "../utils/cors";

import {
  requireAuth
} from "../utils/authMiddleware";

import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../db/products";


export async function productRoutes(request, env) {

  try {

    const url = new URL(request.url);

    const path = url.pathname.replace(/\/$/, "");

    const method = request.method;


    // =========================
    // GET /products
    // =========================
    if (
      path === "/products" &&
      method === "GET"
    ) {

      const products = await getAllProducts(
        env.DB
      );

      return json(products);

    }



    // =========================
    // POST /products
    // =========================
    if (
      path === "/products" &&
      method === "POST"
    ) {
		
	const auth = await requireAuth(request, env);

    if (!auth.ok)
        return auth.response;

      const body = await request.json();


      if (!body.name) {

        return json(
          {
            error:"El nombre es obligatorio"
          },
          400
        );

      }


      const result = await createProduct(
        env.DB,
        body
      );


      return json({
        success:true,
        result
      });

    }



    // =========================
    // PUT /products/:id
    // =========================
    if (
      path.startsWith("/products/") &&
      method === "PUT"
    ) {
		
	const auth = await requireAuth(request, env);

    if (!auth.ok)
        return auth.response;

      const id = path.split("/")[2];

      const body = await request.json();


      const result = await updateProduct(
        env.DB,
        id,
        body
      );


      /*
        Eliminamos imágenes que fueron
        removidas de product_images
      */

      if (
        Array.isArray(result.imagesToDelete)
        &&
        result.imagesToDelete.length
      ) {

        for (
          const filename of result.imagesToDelete
        ) {

          await env.betatestdev_images.delete(
            filename
          );

        }

      }


      return json({

        success:true,

        imagesDeleted:
          result.imagesToDelete || []

      });

    }




    // =========================
    // DELETE /products/:id
    // =========================
    if (
      path.startsWith("/products/")
      &&
      method === "DELETE"
    ) {
		
	const auth = await requireAuth(request, env);

    if (!auth.ok)
        return auth.response;


      const id = path.split("/")[2];


      const deleted = await deleteProduct(
        env.DB,
        id
      );


      /*
        Eliminamos todas las imágenes
        asociadas al producto en R2
      */

      if (
        Array.isArray(deleted.images)
        &&
        deleted.images.length
      ) {

        for (
          const filename of deleted.images
        ) {

          await env.betatestdev_images.delete(
            filename
          );

        }

      }


      return json({

        success:true,

        imagesDeleted:
          deleted.images || []

      });

    }



    return null;


  } catch(error) {


    console.error(
      "Product route error:",
      error
    );


    return json(
      {
        error:"Error interno del servidor"
      },
      500
    );

  }

}