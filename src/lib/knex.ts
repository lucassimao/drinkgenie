import knexx, { Knex } from "knex";

const pg: Knex = knexx({
  client: "pg",
});

export default pg;
