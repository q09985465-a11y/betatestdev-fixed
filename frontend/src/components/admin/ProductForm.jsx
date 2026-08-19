import { useEffect, useState } from "react";
import { ImageGallery } from "./images";
import { mapExistingImages } from "./images/imageUtils";

const initialState = {
  name: "",
  description: "",
  price: "",
  category_id: "",
  stock: "",
  images: [],
  active: true,
};

export default function ProductForm({
  initialData,
  categories = [],
  onSubmit,
  onCancel,
}) {
  const [form, setForm] = useState(initialState);

  useEffect(() => {

	  if (initialData) {

		setForm({
		  ...initialState,
		  ...initialData,

		  images: mapExistingImages(
			initialData.images || [],
			"/images"
		  ),

		  category_id:
			initialData.category_id || "",
		});

	  } else {

		setForm(initialState);

	  }

	}, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      return alert("Debe ingresar un nombre.");
    }

    if (Number(form.price) <= 0) {
      return alert("Precio inválido.");
    }

    if (Number(form.stock) < 0) {
      return alert("Stock inválido.");
    }

    if (!form.category_id) {
      return alert("Debe seleccionar una categoría.");
    }

    onSubmit({
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      category_id: Number(form.category_id),
    });
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h2>
        {initialData ? "Editar producto" : "Nuevo producto"}
      </h2>

      <div className="grid-form">
        {/* IZQUIERDA */}
        <div className="col">
          <label>Nombre</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
          />

          <label>Descripción</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
          />

          <label>Precio</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
          />

          <label>Categoría</label>
          <select
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
          >
            <option value="">
              Seleccione una categoría...
            </option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>

          <label>Stock</label>
          <input
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
          />

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "10px",
            }}
          >
            <input
              type="checkbox"
              name="active"
              checked={form.active}
              onChange={handleChange}
            />
            Activo
          </label>
        </div>

        {/* DERECHA */}
        <div className="col">
          <label>Imagen</label>

          <ImageGallery
			value={form.images}
			onChange={(images)=>
				setForm(prev=>({
					...prev,
					images
				}))
			}
		/>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit">
          Guardar
        </button>

        <button
          type="button"
          onClick={onCancel}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}