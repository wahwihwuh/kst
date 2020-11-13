import { Pool } from 'pg';

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

pool
  .connect()
  .then(async client => {
    const query =
        `
            CREATE TABLE IF NOT EXISTS category(
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) UNIQUE NOT NULL
            );
            
            CREATE TABLE IF NOT EXISTS menu(
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                price Float NOT NULL,
                category_id INT,
                CONSTRAINT fk_category
                FOREIGN KEY(category_id)
                REFERENCES category(id) 
                ON DELETE CASCADE
            );
        `;
    try {
        await client
            .query(query);
        client.release();
    } catch (err) {
        client.release();
    }
});

export default pool;
