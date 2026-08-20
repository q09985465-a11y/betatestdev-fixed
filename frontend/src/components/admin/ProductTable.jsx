import DataTable from "./ui/DataTable";
import TableHeader from "./ui/TableHeader";
import Pagination from "./ui/Pagination";
import { getImageUrl } from "./images/imageUtils";

import Button from "./ui/Button";
import Badge from "./ui/Badge";

const columns = [
  "Imagen",
  "Nombre",
  "Categoría",
  "Precio",
  "Stock",
  "Estado",
  "Acciones",
];

export default function ProductTable({
  products,
  onEdit,
  onDelete,
}) {
  return (
    <DataTable>
      <table>
        <TableHeader columns={columns} />

        <tbody>
          {products.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                style={{
                  textAlign: "center",
                  padding: "30px",
                }}
              >
                No hay productos registrados.
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product.id}>

                {/* IMAGEN */}
                <td>
                  {product.images && product.images.length > 0 ? (
                    <div>
                      <img
                        className="product-image"
                        src={getImageUrl(product.images[0])}
                        alt={product.name}
                      />

                      {product.images.length > 1 && (
                        <small>
                          +{product.images.length - 1} imágenes
                        </small>
                      )}
                    </div>
                  ) : (
                    <div className="no-image">
                      Sin imagen
                    </div>
                  )}
                </td>


                {/* NOMBRE */}
                <td>
                  {product.name}
                </td>


                {/* CATEGORÍA */}
                <td>
                  {product.category_name || "Sin categoría"}
                </td>


                {/* PRECIO */}
                <td>
                  ${Number(product.price).toFixed(2)}
                </td>


                {/* STOCK */}
                <td>
                  {product.stock ?? 0}
                </td>


                {/* ESTADO */}
                <td>
                  <Badge
                    active={product.active}
                    label={product.status}
                  />
                </td>


                {/* ACCIONES */}
                <td>
                  <div className="table-actions">

                    <Button
                      onClick={() => onEdit(product)}
                    >
                      Editar
                    </Button>

                    <Button
                      variant="danger"
                      onClick={() => onDelete(product.id)}
                    >
                      Eliminar
                    </Button>

                  </div>
                </td>

              </tr>
            ))
          )}
        </tbody>
      </table>

      <Pagination />
    </DataTable>
  );
}