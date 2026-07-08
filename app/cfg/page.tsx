import Link from "next/link";
import { handlePassword, newPassword, logout } from "./actions";
import { cookies } from "next/headers";
import fs from "fs/promises";
import path from "path";

type Item = {
  barcode: string;
  name: string;
  price: string;
};

export default async function Cfg() {
  const cookiess = await cookies();
  const auth = cookiess.get("auth")?.value === "true";

  async function handleSubmit(formData: FormData) {
    "use server";
    const password = formData.get("password")?.toString() || "";
    await handlePassword(password.trim());
  }

  async function HandleNewPassword(formData: FormData) {
    "use server";
    const password = formData.get("newPassword")?.toString() || "";
    console.log(password);
    await newPassword(password);
  }

  async function addItem(formData: FormData) {
    "use server";
    const barcode = formData.get("barcode")?.toString().trim() || "";
    const name = formData.get("name")?.toString().trim() || "";
    const price = formData.get("price")?.toString().trim() || "";

    if (!barcode || !name || !price) return;

    const filePath = path.join(process.cwd(), "app", "data.csv");
    const line = `\n${barcode},${name},${price}`;

    try {
      await fs.appendFile(filePath, line, "utf8");
    } catch (err) {
      console.error("Failed to append to data.csv:", err);
    }
  }

  async function removeItem(formData: FormData) {
    "use server";
    const barcode = formData.get("barcode")?.toString().trim() || "";
    if (!barcode) return;

    const filePath = path.join(process.cwd(), "app", "data.csv");
    try {
      const raw = await fs.readFile(filePath, "utf8");
      const lines = raw.trim().split("\n").filter(Boolean);
      if (lines.length === 0) return;

      const [header, ...rows] = lines;
      const filtered = rows.filter((line) => {
        const [b] = line.split(",").map((v) => v.trim());
        return b !== barcode;
      });

      await fs.writeFile(
        filePath,
        [header, ...filtered].join("\n") + "\n",
        "utf8",
      );
    } catch (err) {
      console.error("Failed to remove item from data.csv:", err);
    }
  }

  async function getItems(): Promise<Item[]> {
    const filePath = path.join(process.cwd(), "app", "data.csv");
    try {
      const raw = await fs.readFile(filePath, "utf8");
      const lines = raw.trim().split("\n").filter(Boolean);
      if (lines.length === 0) return [];

      const [...rows] = lines;

      return rows.map((line) => {
        const [barcode, name, price] = line.split(",").map((v) => v.trim());
        return { barcode, name, price };
      });
    } catch (err) {
      console.error("Failed to read data.csv:", err);
      return [];
    }
  }

  const items = await getItems();

  if (!auth) {
    return (
      <div className="grid place-items-center w-screen h-screen">
        <div className="bg-white border-4 p-2">
          <form action={handleSubmit}>
            <input
              name="password"
              type="password"
              placeholder="Password"
              className="border-4 px-1"
            />
            <button
              type="submit"
              className="border-4 border-black bg-black text-white pl-2 pr-2"
            >
              ok
            </button>
          </form>
          <Link href="/">
            <button className="bg-black text-white w-full mt-2">back</button>
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="grid place-items-center w-screen h-screen">
      <div className="bg-white border-4 p-2 w-lg">
        <div className="overflow-auto h-64">
          <table className="min-w-full border-collapse border-b-2 border-x-2 border-black">
            <thead className="sticky top-0">
              <tr className="bg-black text-white">
                <th className="px-2 py-1 text-left">Barcode</th>
                <th className="px-2 py-1 text-left">Name</th>
                <th className="px-2 py-1 text-left">Price</th>
                <th className="px-2 py-1 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="border-2 border-black px-2 text-center"
                  >
                    No items found
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.barcode}>
                    <td className="border-2 border-black px-2">
                      {item.barcode}
                    </td>
                    <td className="border-2 border-black px-2">{item.name}</td>
                    <td className="border-2 border-black px-2">{item.price}</td>
                    <td className="border-2 border-dashed border-black">
                      <form action={removeItem}>
                        <input
                          type="hidden"
                          name="barcode"
                          value={item.barcode}
                        />
                        <button
                          type="submit"
                          className="bg-black text-white w-full"
                        >
                          remove
                        </button>
                      </form>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <form action={addItem} className="border-4 p-2 w-fit">
          <div className="flex flex-wrap gap-2">
            <input
              name="barcode"
              placeholder="Barcode"
              required
              className="border p-1"
            />
            <input
              name="name"
              placeholder="Name"
              required
              className="border p-1"
            />
            <input
              name="price"
              placeholder="Price"
              inputMode="decimal"
              required
              className="border p-1"
              pattern="^\d*(\.\d{0,2})?$"
            />
          </div>
          <button
            type="submit"
            className="bg-black text-white pl-2 pr-2 mt-2 w-full"
          >
            Add item
          </button>
        </form>
        <br />
        <form action={HandleNewPassword} className="border-4 w-fit">
          <input
            name="newPassword"
            placeholder="New password"
            required
            className="px-1"
          />
          <button type="submit" className="bg-black text-white px-2">
            set
          </button>
        </form>
        <span className="flex justify-end">
          <button onClick={logout} className="bg-black px-2 text-white">
            logout
          </button>
        </span>
      </div>
    </div>
  );
}
