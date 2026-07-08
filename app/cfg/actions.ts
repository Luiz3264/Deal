"use server";
import { promises as fs } from "fs";
import path from "path";

// 1. Password Verification Action
export async function handlePasswordSubmit(formData: FormData) {
  const filePath = path.join(process.cwd(), "data", "passwd");
  const fileContent = await fs.readFile("passwd", "utf8");
}
export async function handleAddItem() {}
export async function handleRemoveItem() {}
export async function handleNewPassword() {}
