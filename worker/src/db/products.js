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
    const { results: images } = await DB.prepare(`
      SELECT filename
      FROM product_images
      WHERE product_id = ?
      ORDER BY position
    `)
      .bind(product.id)
      .all();

    product.images = images.map(img => img.filename);
  }

  return results;
}

export async function createProduct(DB, product) {

  const result = await DB.prepare(`
    INSERT INTO products
    (
      name,
      description,
      price,
      category_id,
      stock,
      active
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `)
    .bind(
      product.name,
      product.description,
      product.price,
      product.category_id,
      product.stock,
      product.active ? 1 : 0
    )
    .run();

  const productId = result.meta.last_row_id;

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


  const oldImages = results.map(
    img => img.filename
  );


  // Actualizar datos del producto
  await DB.prepare(`
    UPDATE products SET
      name=?,
      description=?,
      price=?,
      category_id=?,
      stock=?,
      active=?
    WHERE id=?
  `)
    .bind(
      product.name,
      product.description,
      product.price,
      product.category_id,
      product.stock,
      product.active ? 1 : 0,
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



    // Limpiar relaciones actuales
    await DB.prepare(`
      DELETE FROM product_images
      WHERE product_id=?
    `)
      .bind(id)
      .run();



    // Insertar imágenes nuevas con posición
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


  return {
    success:true,
    imagesToDelete
  };

}

export async function deleteProduct(DB, id) {

  const { results: images } = await DB.prepare(`
    SELECT filename
    FROM product_images
    WHERE product_id = ?
  `)
    .bind(id)
    .all();


  await DB.prepare(`
    DELETE FROM product_images
    WHERE product_id = ?
  `)
    .bind(id)
    .run();


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