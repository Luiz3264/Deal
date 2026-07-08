import Link from "next/link";

export default async function Cfg() {
  if (true) {
    return (
      <div className="bg-[#777777] grid place-items-center w-screen h-screen">
        <div className="bg-white border-4 p-2">
          <form>
            <input
              name="password"
              type="password"
              placeholder="Password"
              className="border p-1 mr-2"
            />
            <button type="submit" className="bg-black text-white pl-2 pr-2">
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
    <div className="bg-[#777777] grid place-items-center w-screen h-screen">
      <div className="bg-white border-4 p-2 w-lg">
        <div className="bg-black text-white text-5xl">
          Warning: Not functional!
        </div>
        <br />
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
              <tr>
                <td className="border-2 border-black px-2">000000</td>
                <td className="border-2 border-black px-2">placeholder</td>
                <td className="border-2 border-black px-2">0.00</td>
                <td className="border-2 border-dashed border-black">
                  <button className="bg-black text-white w-full">remove</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <br />
        <form className="border-4 p-2 w-fit">
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
              pattern="^\d*(\.\d{0,2})?$" // Replaced stateful regex slice with standard HTML5 validation
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
        <form className="border-4 w-fit">
          <input
            name="newPassword"
            placeholder="New password"
            required
            className="border p-1"
          />
          <button type="submit" className="bg-black text-white pl-2 pr-2">
            set
          </button>
        </form>
      </div>
    </div>
  );
}
