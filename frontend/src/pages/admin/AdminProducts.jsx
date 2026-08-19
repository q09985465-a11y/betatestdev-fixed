import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getProducts,
  deleteProduct,
} from "../../services/productService";

import ProductTable from "../../components/admin/ProductTable";
import SearchBar from "../../components/admin/ui/Searchbar";
import Button from "../../components/admin/ui/Button";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error("Error cargando productos:", err);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const text = search.toLowerCase();

    return (
      product.name?.toLowerCase().includes(text) ||
      product.category?.toLowerCase().includes(text)
    );
  });

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar producto?")) return;

    try {
      await deleteProduct(id);
      await loadProducts();
    } catch (err) {
      console.error("Error eliminando producto:", err);
    }
  };

  return (
    <div className="page">

      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <SearchBar
          value={search}
          onChange={setSearch}
        />

        <Button
          onClick={() =>
            navigate("/admin/products/new")
          }
        >
          + Nuevo producto
        </Button>
      </div>

      {/* TABLE */}
      <ProductTable
        products={filteredProducts}
        onEdit={(product) =>
          navigate(`/admin/products/${product.id}`)
        }
        onDelete={handleDelete}
      />

    </div>
  );
}