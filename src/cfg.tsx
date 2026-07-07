import { useEffect, useRef, useState } from "react";
import passwd from "./passwd?raw";
import data from "./data.csv?raw";

function parseRows(csv: string) {
  return csv
    .trim()
    .split(/\r?\n/)
    .map((row) => row.split(",").map((value) => value.trim()));
}

export default function Cfg() {
  const [auth, setAuth] = useState(false);
  const [passtext, setPasstext] = useState("Password");
  const [rows, setRows] = useState(() => {
    const storedRows = window.localStorage.getItem("deal-data");
    return storedRows ? parseRows(storedRows) : parseRows(data);
  });

  const passRef = useRef<HTMLInputElement>(null);
  const newpassRef = useRef<HTMLInputElement>(null);
  const barcodeRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    window.localStorage.setItem(
      "deal-data",
      rows.map((row) => row.join(",")).join("\n"),
    );
  }, [rows]);

  function handlePassword(e: React.FormEvent) {
    e.preventDefault();
    const passbar = passRef.current;
    if (!passbar) return;
    if (passbar.value == passwd) setAuth(true);
    else {
      passbar.value = "";
      setPasstext("Wrong password");
    }
  }

  async function handleNewPassword() {}

  function handleAddItem(e: React.FormEvent) {
    e.preventDefault();

    const barcode = barcodeRef.current?.value.trim();
    const name = nameRef.current?.value.trim();
    const price = priceRef.current?.value.trim();

    if (!barcode || !name || !price) return;

    setRows((currentRows) => [...currentRows, [barcode, name, price]]);

    if (barcodeRef.current) barcodeRef.current.value = "";
    if (nameRef.current) nameRef.current.value = "";
    if (priceRef.current) priceRef.current.value = "";
  }

  function handleRemoveItem() {}

  if (!auth) {
    return (
      <div className=" bg-[#777777] grid place-items-center w-screen h-screen ">
        <div className="bg-white border-4 p-2">
          <form onSubmit={handlePassword}>
            <input ref={passRef} placeholder={passtext} />
            <button type="submit" className="bg-black text-white pl-2 pr-2">
              ok
            </button>
          </form>
          <button
            onClick={() => {
              window.location.href = "/Deal/";
            }}
            className="bg-black text-white w-full mt-2"
          >
            back
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className=" bg-[#777777] grid place-items-center w-screen h-screen ">
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
                {rows.map((row, index) => (
                  <tr key={`${row[0]}-${index}`}>
                    <td className="border-2 border-black px-2">{row[0]}</td>
                    <td className="border-2 border-black px-2">{row[1]}</td>
                    <td className="border-2 border-black px-2">{row[2]}</td>
                    <td className="border-2 border-dashed border-black">
                      <button
                        className="bg-black text-white w-full"
                        onClick={handleRemoveItem}
                      >
                        remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <br />
          <form className="border-4 p-2 w-fit" onSubmit={handleAddItem}>
            <div className="flex flex-wrap gap-2">
              <input ref={barcodeRef} placeholder="Barcode" />
              <input ref={nameRef} placeholder="Name" />
              <input
                ref={priceRef}
                placeholder="Price"
                inputMode="decimal"
                onChange={(event) => {
                  const value = event.target.value;
                  if (value === "" || /^\d*(\.\d{0,2})?$/.test(value)) {
                    event.target.value = value;
                  } else {
                    event.target.value = value.slice(0, -1);
                  }
                }}
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
          <form className="border-4 w-fit" onSubmit={handleNewPassword}>
            <input ref={newpassRef} placeholder="New password" />
            <button type="submit" className="bg-black text-white pl-2 pr-2">
              set
            </button>
          </form>
        </div>
      </div>
    );
  }
}
