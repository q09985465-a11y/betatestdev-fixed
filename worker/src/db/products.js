export async function getAllProducts(DB) {
  const { results } = await DB.prepare(`
    SELECT
      products.*,
      categories.name AS category_name
    FROM products
    LEFT JOIN categories
      ON products.category_id = categories.id
    ORDER BY products.id DESC
  `).all();

  for (const product of results) {

    // Obtener imágenes
    const { results: images } = await DB.prepare(`
      SELECT filename
      FROM product_images
      WHERE product_id = ?
      ORDER BY position
    `)
      .bind(product.id)
      .all();

    product.images = images.map(img => img.filename);


    // Obtener etiquetas
    const { results: tags } = await DB.prepare(`
      SELECT tags.name
      FROM tags
      INNER JOIN product_tags
        ON tags.id = product_tags.tag_id
      WHERE product_tags.product_id = ?
      ORDER BY tags.name
    `)
      .bind(product.id)
      .all();

    product.tags = tags.map(tag => tag.name);


    // Convertir valores SQLite a boolean
    product.active = Boolean(product.active);
    product.featured = Boolean(product.featured);
  }

  return results;
}


export async function createProduct(DB, product) {

  const result = await DB.prepare(`
    INSERT INTO products
    (
      name,
      slug,
      description,
      price,
      category_id,
      stock,
      active,
      status,
      featured
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
    .bind(
      product.name,
      product.slug,
      product.description || null,
      product.price,
      product.category_id || null,
      product.stock ?? 0,
      product.active ? 1 : 0,
      product.status || "Disponible",
      product.featured ? 1 : 0
    )
    .run();

  const productId = result.meta.last_row_id;


  // Insertar imágenes
  if (Array.isArray(product.images)) {

    for (let i = 0; i < product.images.length; i++) {

      await DB.prepare(`
        INSERT INTO product_images
        (
          product_id,
          filename,
          position
        )
        VALUES (?, ?, ?)
      `)
        .bind(
          productId,
          product.images[i],
          i
        )
        .run();
    }
  }


  // Insertar etiquetas
  if (Array.isArray(product.tags)) {

    for (const tagName of product.tags) {

      if (!tagName || !tagName.trim()) {
        continue;
      }

      const normalizedTag = tagName.trim();

      // Crear etiqueta si no existe
      await DB.prepare(`
        INSERT OR IGNORE INTO tags (name)
        VALUES (?)
      `)
        .bind(normalizedTag)
        .run();


      // Obtener ID de la etiqueta
      const tag = await DB.prepare(`
        SELECT id
        FROM tags
        WHERE name = ?
      `)
        .bind(normalizedTag)
        .first();


      if (tag) {

        await DB.prepare(`
          INSERT OR IGNORE INTO product_tags
          (
            product_id,
            tag_id
          )
          VALUES (?, ?)
        `)
          .bind(
            productId,
            tag.id
          )
          .run();
      }
    }
  }


  return result;
}


export async function updateProduct(DB, id, product) {

  // Obtener imágenes actuales
  const { results } = await DB.prepare(`
    SELECT filename
    FROM product_images
    WHERE product_id = ?
    ORDER BY position
  `)
    .bind(id)
    .all();

  const oldImages = results.map(img => img.filename);


  // Actualizar información del producto
  await DB.prepare(`
    UPDATE products SET
      name = ?,
      slug = ?,
      description = ?,
      price = ?,
      category_id = ?,
      stock = ?,
      active = ?,
      status = ?,
      featured = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `)
    .bind(
      product.name,
      product.slug,
      product.description || null,
      product.price,
      product.category_id || null,
      product.stock ?? 0,
      product.active ? 1 : 0,
      product.status || "Disponible",
      product.featured ? 1 : 0,
      id
    )
    .run();


  /*
    Actualizar imágenes solamente
    si vienen en el request
  */

  let imagesToDelete = [];

  if (Array.isArray(product.images)) {

    const newImages = product.images;

    // Detectar imágenes eliminadas
    imagesToDelete = oldImages.filter(
      img => !newImages.includes(img)
    );


    // Eliminar relaciones actuales
    await DB.prepare(`
      DELETE FROM product_images
      WHERE product_id = ?
    `)
      .bind(id)
      .run();


    // Insertar imágenes nuevas
    for (let i = 0; i < newImages.length; i++) {

      await DB.prepare(`
        INSERT INTO product_images
        (
          product_id,
          filename,
          position
        )
        VALUES (?, ?, ?)
      `)
        .bind(
          id,
          newImages[i],
          i
        )
        .run();
    }
  }


  /*
    Actualizar etiquetas solamente
    si vienen en el request
  */

  if (Array.isArray(product.tags)) {

    // Eliminar relaciones actuales
    await DB.prepare(`
      DELETE FROM product_tags
      WHERE product_id = ?
    `)
      .bind(id)
      .run();


    // Insertar etiquetas nuevas
    for (const tagName of product.tags) {

      if (!tagName || !tagName.trim()) {
        continue;
      }

      const normalizedTag = tagName.trim();


      // Crear etiqueta si no existe
      await DB.prepare(`
        INSERT OR IGNORE INTO tags (name)
        VALUES (?)
      `)
        .bind(normalizedTag)
        .run();


      // Obtener ID
      const tag = await DB.prepare(`
        SELECT id
        FROM tags
        WHERE name = ?
      `)
        .bind(normalizedTag)
        .first();


      if (tag) {

        await DB.prepare(`
          INSERT OR IGNORE INTO product_tags
          (
            product_id,
            tag_id
          )
          VALUES (?, ?)
        `)
          .bind(
            id,
            tag.id
          )
          .run();
      }
    }
  }


  return {
    success: true,
    imagesToDelete
  };
}


export async function deleteProduct(DB, id) {

  // Obtener imágenes antes de eliminar
  const { results: images } = await DB.prepare(`
    SELECT filename
    FROM product_images
    WHERE product_id = ?
  `)
    .bind(id)
    .all();


  // Eliminar relaciones de etiquetas
  await DB.prepare(`
    DELETE FROM product_tags
    WHERE product_id = ?
  `)
    .bind(id)
    .run();


  // Eliminar imágenes
  await DB.prepare(`
    DELETE FROM product_images
    WHERE product_id = ?
  `)
    .bind(id)
    .run();


  // Eliminar producto
  const result = await DB.prepare(`
    DELETE FROM products
    WHERE id = ?
  `)
    .bind(id)
    .run();


  return {
    result,
    images: images.map(img => img.filename)
  };
}