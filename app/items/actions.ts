"use server";
import { DatabaseSync } from "node:sqlite";
import { revalidatePath } from "next/cache";

type ProductRow = {
  bar: string;
  ref: string;
  name: string;
  value: number;
};

type Item = {
  bar: string;
  name: string;
  ref: string;
  value: string;
};

function openDb() {
  return new DatabaseSync("app/data.db");
}

export async function getItems(): Promise<Item[]> {
  const db = openDb();
  try {
    const rows = db.prepare("SELECT * FROM product").all() as ProductRow[];
    console.log(rows);
    return rows.map((row) => ({
      bar: row.bar,
      name: row.name,
      ref: row.ref,
      value: row.value.toFixed(2),
    }));
  } finally {
    db.close();
  }
}

export async function removeItem(barcode: string) {
  const db = openDb();
  try {
    db.prepare("DELETE FROM product WHERE bar = ?").run(barcode);
  } finally {
    db.close();
  }
  revalidatePath("/items");
}

export async function addItem(formData: FormData) {
  const barcode = formData.get("barcode")?.toString().trim();
  const name = formData.get("name")?.toString().trim();
  const ref = formData.get("ref")?.toString().trim();
  const priceRaw = formData.get("price")?.toString().trim();

  if (!barcode || !name || !ref || !priceRaw) {
    throw new Error("All fields are required");
  }

  const price = Number(priceRaw);
  if (Number.isNaN(price) || price < 0) {
    throw new Error("Invalid price");
  }

  const db = openDb();
  try {
    db.prepare(
      "INSERT INTO product (bar, ref, name,value) VALUES (?, ?, ?, ?)",
    ).run(barcode, ref, name, priceRaw);
  } finally {
    db.close();
  }
  revalidatePath("/items");
}
