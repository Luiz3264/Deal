import { getItems, removeItem, addItem } from "./actions";

export default async function Cfg() {
  const items = await getItems();

  return (
    <div className="grid place-items-center w-screen h-screen">
      <div className="bg-white border-4 p-2 w-lg">
        <div className="overflow-auto h-64">
          <table className="min-w-full border-collapse border-b-2 border-x-2 border-black">
            <thead className="sticky top-0">
              <tr className="bg-black text-white">
                <th className="px-2 py-1 text-left">Barcode</th>
                <th className="px-2 py-1 text-left">Ref</th>
                <th className="px-2 py-1 text-left">Name</th>
                <th className="px-2 py-1 text-left">Price</th>
                <th className="px-2 py-1 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="border-2 border-black px-2 text-center"
                  >
                    No items found
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.bar}>
                    <td className="border-2 border-black px-2">{item.bar}</td>
                    <td className="border-2 border-black px-2">{item.ref}</td>
                    <td className="border-2 border-black px-2">{item.name}</td>
                    <td className="border-2 border-black px-2">{item.value}</td>
                    <td className="border-2 border-dashed border-black">
                      <form action={removeItem.bind(null, item.bar)}>
                        <input type="hidden" name="barcode" value={item.bar} />
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
          <div className="flex flex-wrap justify-between gap-2 px-8">
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
              name="ref"
              placeholder="Ref"
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
      </div>
    </div>
  );
}
