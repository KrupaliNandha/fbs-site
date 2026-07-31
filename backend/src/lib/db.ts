import mysql, {
  type FieldPacket,
  type Pool,
  type PoolConnection,
  type ResultSetHeader,
  type RowDataPacket,
} from "mysql2/promise";

export type SqlValue = string | number | boolean | Date | null;

let pool: Pool | null = null;
let connectionLogged = false;

function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required for MySQL auth configuration.`);
  }

  return value;
}

export function getAuthDatabase(): Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: requireEnv("AUTH_DB_HOST"),
      port: Number(process.env.AUTH_DB_PORT ?? "3306"),
      user: requireEnv("AUTH_DB_USER"),
      password: requireEnv("AUTH_DB_PASSWORD"),
      database: requireEnv("AUTH_DB_NAME"),
      waitForConnections: true,
      connectionLimit: Number(process.env.AUTH_DB_CONNECTION_LIMIT ?? "10"),
      queueLimit: 0,
      namedPlaceholders: false,
      multipleStatements: false,
    });
  }

  if (!connectionLogged) {
    connectionLogged = true;
    void pool
      .getConnection()
      .then((connection) => {
        console.log(
          `[auth-db] Connected to MySQL database "${requireEnv("AUTH_DB_NAME")}" at ${requireEnv("AUTH_DB_HOST")}:${process.env.AUTH_DB_PORT ?? "3306"}`,
        );
        connection.release();
      })
      .catch((error: unknown) => {
        connectionLogged = false;
        console.error("[auth-db] Failed to connect to MySQL database.", error);
      });
  }

  return pool;
}

export async function query<T extends RowDataPacket[] | ResultSetHeader>(
  sql: string,
  params: SqlValue[] = [],
): Promise<[T, FieldPacket[]]> {
  return getAuthDatabase().query<T>(sql, params);
}

export async function execute<T extends ResultSetHeader>(
  sql: string,
  params: SqlValue[] = [],
): Promise<[T, FieldPacket[]]> {
  return getAuthDatabase().execute<T>(sql, params);
}

export async function withTransaction<T>(
  callback: (connection: PoolConnection) => Promise<T>,
): Promise<T> {
  const connection = await getAuthDatabase().getConnection();

  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function verifyAuthDatabaseSchema() {
  const requiredTables = [
    "roles",
    "permissions",
    "role_permissions",
    "users",
    "user_roles",
    "audit_events",
  ];

  const [rows] = await query<RowDataPacket[]>(
    `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = ?
    `,
    [requireEnv("AUTH_DB_NAME")],
  );

  const existingTables = new Set(rows.map((row) => String(row.TABLE_NAME ?? row.table_name)));
  const missingTables = requiredTables.filter((table) => !existingTables.has(table));

  if (missingTables.length > 0) {
    throw new Error(
      `Auth database schema is missing. Apply backend/database/auth-schema.sql before starting the API. Missing tables: ${missingTables.join(", ")}`,
    );
  }
}

let databaseInitialized: Promise<void> | null = null;

export async function initializeAuthDatabase() {
  if (!databaseInitialized) {
    databaseInitialized = (async () => {
      await verifyAuthDatabaseSchema();
    })();
  }

  await databaseInitialized;
}
