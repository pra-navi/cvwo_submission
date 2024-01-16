import pg from 'pg'
const { Pool } = pg

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "learners",
    password: "india2003",
    port: 5432,
});

export default pool; 