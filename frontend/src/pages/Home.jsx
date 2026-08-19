import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <h1>Inicio</h1>

      <nav>
        <ul>
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/products">Productos</Link></li>
          <li><Link to="/admin">Admin</Link></li>
          <li><Link to="/admin/products">Admin Productos</Link></li>
        </ul>
      </nav>
    </div>
  );
}