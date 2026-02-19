// database/db.js
import * as SQLite from "expo-sqlite";

let dbPromise = null;

// Always use ONE DB connection
async function getDB() {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync("smartstock.db");
  }
  return dbPromise;
}

/**
 * Create tables if they don't exist
 * Call this once when the app starts.
 */
export async function initDB() {
  const db = await getDB();

  await db.execAsync(`PRAGMA journal_mode = WAL;`);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      costPrice REAL NOT NULL,
      sellingPrice REAL NOT NULL,
      stockQty INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY NOT NULL,
      productId INTEGER NOT NULL,
      qtySold INTEGER NOT NULL,
      salePrice REAL NOT NULL,
      costPrice REAL NOT NULL,
      total REAL NOT NULL,
      profit REAL NOT NULL,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (productId) REFERENCES products(id)
    );
  `);
}

/* ---------------------------
   Product functions
----------------------------*/

export async function getAllProducts() {
  const db = await getDB();
  return await db.getAllAsync("SELECT * FROM products ORDER BY name ASC;");
}

export async function getProductById(id) {
  const db = await getDB();
  return await db.getFirstAsync("SELECT * FROM products WHERE id = ?;", [id]);
}

export async function addProduct({ name, costPrice, sellingPrice, stockQty }) {
  const db = await getDB();

  const result = await db.runAsync(
    `INSERT INTO products (name, costPrice, sellingPrice, stockQty)
     VALUES (?, ?, ?, ?);`,
    [name.trim(), Number(costPrice), Number(sellingPrice), parseInt(stockQty, 10)]
  );

  return result.lastInsertRowId;
}

export async function updateProduct(id, { name, costPrice, sellingPrice, stockQty }) {
  const db = await getDB();

  await db.runAsync(
    `UPDATE products
     SET name = ?, costPrice = ?, sellingPrice = ?, stockQty = ?
     WHERE id = ?;`,
    [name.trim(), Number(costPrice), Number(sellingPrice), parseInt(stockQty, 10), id]
  );
}

export async function deleteProduct(id) {
  const db = await getDB();

  // clean up related sales first
  await db.runAsync("DELETE FROM sales WHERE productId = ?;", [id]);
  await db.runAsync("DELETE FROM products WHERE id = ?;", [id]);
}


export async function getLowStockProducts(threshold = 3) {
  const db = await getDB();
  return await db.getAllAsync(
    "SELECT * FROM products WHERE stockQty <= ? ORDER BY stockQty ASC, name ASC;",
    [threshold]
  );
}



/* ---------------------------
   Sales functions
----------------------------*/

export async function recordSale({ productId, qtySold }) {
  const db = await getDB();

  const product = await getProductById(productId);
  if (!product) throw new Error("Product not found.");

  const qty = parseInt(qtySold, 10);
  if (!Number.isFinite(qty) || qty <= 0) throw new Error("Quantity must be greater than 0.");

  if (product.stockQty < qty) {
    throw new Error("Not enough stock for this sale.");
  }

  const salePrice = Number(product.sellingPrice);
  const costPrice = Number(product.costPrice);

  const total = salePrice * qty;
  const profit = (salePrice - costPrice) * qty;
  const createdAt = new Date().toISOString();

  const insertRes = await db.runAsync(
    `INSERT INTO sales (productId, qtySold, salePrice, costPrice, total, profit, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?);`,
    [productId, qty, salePrice, costPrice, total, profit, createdAt]
  );

  const newStock = product.stockQty - qty;
  await db.runAsync("UPDATE products SET stockQty = ? WHERE id = ?;", [newStock, productId]);

  return insertRes.lastInsertRowId;
}

export async function getAllSales() {
  const db = await getDB();

  return await db.getAllAsync(`
    SELECT
      s.*,
      p.name as productName
    FROM sales s
    JOIN products p ON p.id = s.productId
    ORDER BY s.createdAt DESC;
  `);
}

/* ---------------------------
   Reports / Analytics
----------------------------*/

export async function getSummary() {
  const db = await getDB();

  const row =
    (await db.getFirstAsync(
      `SELECT
        COUNT(*) as saleCount,
        SUM(total) as totalSales,
        SUM(profit) as totalProfit
       FROM sales;`
    )) || {};

  return {
    saleCount: row.saleCount || 0,
    totalSales: row.totalSales || 0,
    totalProfit: row.totalProfit || 0
  };
}

export async function getProfitByProduct() {
  const db = await getDB();

  const rows = await db.getAllAsync(`
    SELECT
      p.id,
      p.name,
      SUM(s.qtySold) as unitsSold,
      SUM(s.total) as totalSales,
      SUM(s.profit) as totalProfit
    FROM products p
    LEFT JOIN sales s ON s.productId = p.id
    GROUP BY p.id
    ORDER BY totalProfit DESC;
  `);

  return rows.map((r) => ({
    ...r,
    unitsSold: r.unitsSold || 0,
    totalSales: r.totalSales || 0,
    totalProfit: r.totalProfit || 0
  }));
}
