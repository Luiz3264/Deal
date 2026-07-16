"use server";
import { promises as fs } from "fs";
import path from "path";

function isErrnoException(err: unknown): err is NodeJS.ErrnoException {
  return err instanceof Error && "code" in err;
}

export async function saveData(value: string): Promise<number> {
  const filePath = path.join(process.cwd(), "app/cash.csv");

  let fileRaw = "";
  try {
    fileRaw = (await fs.readFile(filePath, "utf8")).trim();
  } catch (err) {
    if (!isErrnoException(err) || err.code !== "ENOENT") throw err;
  }

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

  const count = fileRaw === "" ? 0 : fileRaw.split("\n").length;
  const line = `${count}, ${date}, ${value}`;
  const newContent = fileRaw === "" ? line : fileRaw + "\n" + line;

  await fs.writeFile(filePath, newContent, "utf8");
  return count;
}

export async function getSalesCount(): Promise<number> {
  const filePath = path.join(process.cwd(), "app/cash.csv");
  try {
    const fileRaw = (await fs.readFile(filePath, "utf8")).trim();
    return fileRaw === "" ? 0 : fileRaw.split("\n").length;
  } catch (err) {
    if (isErrnoException(err) && err.code === "ENOENT") return 0;
    throw err;
  }
}
