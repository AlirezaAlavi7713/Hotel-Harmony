import mysql from "mysql2/promise";

const bdd = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

bdd.getConnection()
// si la connexion est réussie
    .then(() =>
        console.log("database ok !"))
// si la connexion échoue    
    .catch(error => console.error("database KO !", error));

export default bdd;    