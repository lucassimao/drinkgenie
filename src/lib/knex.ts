import "server-only";
import knexx, { Knex } from "knex";

const pg: Knex = knexx({
  client: "pg",
  connection: process.env.POSTGRES_URL,
});

export default pg;
