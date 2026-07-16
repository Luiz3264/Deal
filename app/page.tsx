"use client";
import { useRef, useState, useEffect, useMemo } from "react";
import Papa from "papaparse";
import text from "./data.csv";
import { getSalesCount, saveData } from "./actions";

type Product = { bar: string; name: string; value: number };
type CartItem = { id: string; name: string; price: number; quantity: number };

function parseCSV(data: string): Product[] {
  const result = Papa.parse<string[]>(data.trim(), {
    skipEmptyLines: true,
  });

  return result.data
    .map(([bar, name, price]: string[]) => ({
      bar: bar?.trim(),
      name: name?.trim(),
      value: Math.round(parseFloat(price) * 100),
    }))
    .filter((p: Product) => p.bar && p.name && !isNaN(p.value));
}

function Item({
  children,
  onRemove,
}: {
  children: React.ReactNode;
  onRemove: () => void;
}) {
  return (
    <>
      <div className="flex justify-between">
        <span className="px-2">{children}</span>
        <button onClick={onRemove} className="bg-black text-white px-4">
          cancel
        </button>
      </div>
      <hr className="border-t-2 border-dashed" />
    </>
  );
}

export default function App() {
  const barRef = useRef<HTMLInputElement>(null);
  const [itemlist, setItemlist] = useState<CartItem[]>([]);
  const [time, setTime] = useState("Welcome!");
  const [date, setDate] = useState("...");
  const [number, setNumber] = useState(0);

  useEffect(() => {
    let id: ReturnType<typeof setInterval>;

    async function update() {
      setTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
      const count = await getSalesCount();
      setNumber(count);
      setDate(new Date().toLocaleDateString([]));
    }

    async function init() {
      update();
      id = setInterval(update, 1000);
    }

    init();

    return () => clearInterval(id);
  }, []);

  const products = useMemo(() => parseCSV(text), []);

  const price = itemlist.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const removeItem = (index: number) => {
    setItemlist((list) => {
      const item = list[index];
      if (item.quantity > 1) {
        return list.map((it, i) =>
          i === index ? { ...it, quantity: it.quantity - 1 } : it,
        );
      }
      return list.filter((_, i) => i !== index);
    });
  };

  const addItem = (product: Product) => {
    setItemlist((list) => {
      const existing = list.find((item) => item.id === product.bar);
      if (existing) {
        return list.map((item) =>
          item.id === product.bar
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [
        ...list,
        {
          id: product.bar,
          name: product.name,
          price: product.value,
          quantity: 1,
        },
      ];
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const barcode = barRef.current?.value;
    if (!barcode) return;

    const product = products.find((p) => p.bar === barcode);
    if (product) {
      addItem(product);
      barRef.current!.value = "";
    }
  };

  function clear() {
    setItemlist([]);
    if (barRef.current) barRef.current.value = "";
  }

  function checkout() {
    if (itemlist.length === 0) return;
    saveData((price / 100).toFixed(2)).then((newCount) => {
      setNumber(newCount);
    });
    clear();
  }

  return (
    <div className="grid place-items-center h-screen w-screen text-xl">
      <div className="bg-white border-4 w-160 h-120">
        <div className="px-2 flex justify-between bg-black text-white">
          <span>Deal</span>
          {time}
        </div>
        <div className="h-87 overflow-auto">
          {itemlist.map((item, index) => (
            <Item key={item.id} onRemove={() => removeItem(index)}>
              {index + 1} - {item.name} - {(item.price / 100).toFixed(2)}
              {item.quantity > 1 && ` (x${item.quantity})`}
            </Item>
          ))}
        </div>
        <div className="pl-2 flex justify-between border-t-4 border-b-4">
          <span>Id: {number}</span>
          <span>Total: {(price / 100).toFixed(2)}</span>
          <button className="bg-black text-white pl-4 pr-4" onClick={checkout}>
            checkout
          </button>
        </div>
        <div>
          <form onSubmit={handleSubmit} className="flex justify-between">
            <span className="px-2">
              &gt;&gt;{" "}
              <input size={32} placeholder="Barcode here" ref={barRef} />
            </span>
            <button type="submit" className="bg-black text-white px-4">
              ok
            </button>
          </form>
          <hr className="border-b-4" />
          <div className="flex justify-between">
            <button
              className="bg-black text-white pl-1 pr-2"
              onClick={() => (window.location.href = "/cfg")}
            >
              config
            </button>
            {date}
            <button className="bg-black text-white pr-1 pl-2" onClick={clear}>
              clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
