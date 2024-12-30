import { DatabaseSync } from "node:sqlite";

const database = new DatabaseSync("./main.db");

export default database;
