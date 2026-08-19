import { json } from "../utils/cors";

import {
requireAuth
}
from "../utils/authMiddleware";

import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../db/categories";

export async function categoryRoutes(request, env) {

  const url = new URL(request.url);

  const path = url.pathname.replace(/\/$/, "");

  const method = request.method;

  if (method === "GET") {

  if (path === "/categories") {

    const categories = await getAllCategories(env.DB);

    return json(categories);

  }

  if (path.startsWith("/categories/")) {

    const id = path.split("/")[2];

    const category = await getCategoryById(env.DB, id);

    if (!category) {

      return json(
        { error: "Categoría no encontrada" },
        404
      );

    }

    return json(category);

  }

}

  if (path === "/categories" && method === "POST") {
	  
	const auth = await requireAuth(request, env);

    if (!auth.ok)
        return auth.response;
	  

    const body = await request.json();

    const result = await createCategory(env.DB, body);

    return json(result);

  }

  if (path.startsWith("/categories/") && method === "PUT") {
	  
	const auth = await requireAuth(request, env);

    if (!auth.ok)
        return auth.response;

    const id = path.split("/")[2];

    const body = await request.json();

    await updateCategory(env.DB, id, body);

    return json({
      success: true,
    });

  }

  if (path.startsWith("/categories/") && method === "DELETE") {
	  
	const auth = await requireAuth(request, env);

    if (!auth.ok)
        return auth.response;

    const id = path.split("/")[2];

    await deleteCategory(env.DB, id);

    return json({
      success: true,
    });

  }

  return null;

}