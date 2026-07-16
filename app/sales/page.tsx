import { getCash, clearAll } from "./actions";

export default async function Cfg() {
  const sales = await getCash();

  return (
    <div className="grid place-items-center w-screen h-screen">
      <div className="bg-white border-4 p-2 w-lg">
        <div className="overflow-auto h-64">
          <table className="min-w-full border-collapse border-b-2 border-x-2 border-black">
            <thead className="sticky top-0">
              <tr className="bg-black text-white">
                <th className="px-2 py-1 text-left">Id</th>
                <th className="px-2 py-1 text-left">Date & Hour</th>
                <th className="px-2 py-1 text-left">Value</th>
              </tr>
            </thead>
            <tbody>
              {sales.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="border-2 border-black px-2 text-center"
                  >
                    No sales found
                  </td>
                </tr>
              ) : (
                sales.map((sale) => (
                  <tr key={sale.id}>
                    <td className="border-2 border-black px-2">{sale.id}</td>
                    <td className="border-2 border-black px-2">{sale.date}</td>
                    <td className="border-2 border-black px-2">{sale.value}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <form action={clearAll} className="">
          <button
            type="submit"
            className="bg-black text-white pl-2 pr-2 w-full"
          >
            Clear
          </button>
        </form>
      </div>
    </div>
  );
}
