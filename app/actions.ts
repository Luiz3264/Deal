"use server";
import { DatabaseSync } from "node:sqlite";

type ProductRow = {
  bar: string;
  ref: string;
  name: string;
  value: number;
};

function openDb() {
  return new DatabaseSync("app/data.db");
}

export async function getCount(): Promise<number> {
  const db = openDb();
  try {
    const result = db.prepare("SELECT COUNT(*) AS count FROM cash").get() as {
      count: number;
    };
    return result.count + 1;
  } finally {
    db.close();
  }
}

export async function getProduct(barcode: string): Promise<ProductRow | null> {
  const db = openDb();
  try {
    const product = db
      .prepare("SELECT * FROM product WHERE bar = ?")
      .get(barcode) as ProductRow | undefined;

    if (!product) return null;

    return { ...product, value: product.value * 100 };
  } finally {
    db.close();
  }
}

export async function saveData(value: number): Promise<number> {
  const db = openDb();
  try {
    const date = new Date()
      .toLocaleString([], {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
      .replace(",", "");

    const id = await getCount();

    db.prepare("INSERT INTO cash (id, date, value) VALUES (?, ?, ?)").run(
      id,
      date,
      value,
    );

    const result = db.prepare("SELECT COUNT(*) AS count FROM cash").get() as {
      count: number;
    };

    return result.count + 1;
  } finally {
    db.close();
  }
}
