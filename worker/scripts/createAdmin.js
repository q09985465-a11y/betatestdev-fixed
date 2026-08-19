import { hashPassword } from "../src/auth/password.js";

// Uso:
//   node worker/scripts/createAdmin.js <usuario> <password>
// Si no se pasan argumentos, usa admin / Admin123 (cámbialos en producción).

const username = process.argv[2] || "admin";
const password = process.argv[3] || "Admin123";

const hash = await hashPassword(password);

console.log("");
console.log("Usuario :", username);
console.log("Password:", password);
console.log("");
console.log("Copia y pega uno de estos comandos para insertar el admin en D1:");
console.log("");
console.log("# Local (para wrangler dev):");
console.log(
  `npx wrangler d1 execute betatestdev_db --local --command="INSERT INTO admins (username, password_hash) VALUES ('${username}', '${hash}')"`
);
console.log("");
console.log("# Remoto (base de datos real en Cloudflare):");
console.log(
  `npx wrangler d1 execute betatestdev_db --remote --command="INSERT INTO admins (username, password_hash) VALUES ('${username}', '${hash}')"`
);
console.log("");
