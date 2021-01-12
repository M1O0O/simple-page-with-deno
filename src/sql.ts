// deno-lint-ignore-file
import { Client } from "https://deno.land/x/mysql/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";

var sql = await new Client().connect({
    hostname: config().SQL_HOST,
    username: config().SQL_USER,
    db: config().SQL_DB,
    password: config().SQL_PASSWORD,
    port: 3306
});

export async function SQLRequest() {
    var result = await sql.execute("")
    return result;
}