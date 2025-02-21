
import * as schema from "./schema";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { env } from "../utils/env";

const dev = import.meta.env.DEV;
const url = env("TURSO_URL");
const authToken = env("TURSO_AUTH_TOKEN");
const embeddedReplicaUrl = dev ? env("TURSO_EMBEDDED_REPLICA_URL") : "";

console.log("Connecting to Turso");
export let client = createClient({
	// url: dev ? embeddedReplicaUrl : url,
	// syncUrl: dev ? url : undefined,
	// authToken: authToken,
	url: "http://localhost:8080",
});
console.log("Syncing with Turso");
// if (dev) {
// 	console.time("turso-sync");
// 	await client.sync();
// 	console.timeEnd("turso-sync");
// }
console.log('connected')

export const db = drizzle(client, { schema, logger: false });
