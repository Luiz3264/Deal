"use server";
import { DatabaseSync } from "node:sqlite";
import { revalidatePath } from "next/cache";

type CashRow = {
  id: number;
  date: string;
  value: number;
};

function openDb() {
  return new DatabaseSync("app/data.db");
}

export async function getCash(): Promise<CashRow[]> {
  const db = openDb();
  try {
    const rows = db.prepare("SELECT * FROM cash").all() as CashRow[];
    return rows;
  } finally {
    db.close();
  }
}

export async function clearAll() {
  const db = openDb();
  try {
    db.prepare("DELETE FROM cash").run();
  } finally {
    db.close();
  }
  revalidatePath("/cash");
}
