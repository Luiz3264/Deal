"use server";
import { cookies } from "next/headers";
import { promises as fs } from "fs";
import path from "path";
import bcrypt from "bcrypt";

export async function handlePassword(password: string) {
  const filePath = path.join(process.cwd(), "app", "passwd");
  const passwd = (await fs.readFile(filePath, "utf8")).trim();
  const input = await bcrypt.compare(password, passwd);
  if (input) {
    const cookiess = await cookies();
    cookiess.set("auth", "true");
  }
}

export async function newPassword(password: string) {
  const filePath = path.join(process.cwd(), "app", "passwd");
  const hash = await bcrypt.hash(password, 12);
  await fs.writeFile(filePath, hash, "utf8");
  console.log("[WRITE] input password:", JSON.stringify(password));
  console.log("[WRITE] filePath:", filePath);
  console.log("[WRITE] hash written:", hash);
}

export async function logout() {
  "use server";
  const cookiess = await cookies();
  cookiess.set("auth", "false");
}
