import DataTable from "./ui/DataTable";
import TableHeader from "./ui/TableHeader";
import Pagination from "./ui/Pagination";

import Button from "./ui/Button";
import Badge from "./ui/Badge";

const columns = [
  "Nombre",
  "Descripción",
  "Estado",
  "Acciones",
];

export default function CategoryTable({
  categories,
  onEdit,
  onDelete,
}) {

  return (
    <DataTable>

      <table>

        <TableHeader columns={columns} />

        <tbody>

          {categories.length === 0 ? (

            <tr>

              <td
                colSpan={4}
                style={{
                  textAlign: "center",
                  padding: "30px",
                }}
              >
                No hay categorías registradas.
              </td>

            </tr>

          ) : (

            categories.map((category) => (

              <tr key={category.id}>

                <td>{category.name}</td>

                <td>{category.description}</td>

                <td>
                  <Badge active={category.active} />
                </td>

                <td>

                  <div className="table-actions">

                    <Button
                      onClick={() => onEdit(category)}
                    >
                      Editar
                    </Button>

                    <Button
                      variant="danger"
                      onClick={() => onDelete(category.id)}
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