import { useRef, useState, useEffect, useMemo } from "react";
import text from "./data.csv?raw";

type Product = {
  bar: string;
  name: string;
  value: number;
};

type CartItem = {
  name: string;
  price: number;
  quantity: number;
};

function parseCSV(data: string): Product[] {
  const products: Product[] = [];
  let current = "";
  let col = 0;
  let bar = "";
  let name = "";

  for (let i = 0; i < data.length; i++) {
    const char = data[i];

    if (char === ",") {
      if (col === 0) bar = current.trim();
      if (col === 1) name = current.trim();
      current = "";
      col++;
    } else if (char === "\n" || i === data.length - 1) {
      const value = Math.round(parseFloat((current || char) + "") * 100);
      if (bar && name) products.push({ bar, name, value });
      current = "";
      col = 0;
      bar = "";
      name = "";
    } else {
      current += char;
    }
  }

  return products;
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
        <span className="text-xl-2 p-1">{children}</span>
        <button
          onClick={onRemove}
          className="bg-black text-white p-2 pl-4 pr-4"
        >
          cancel
        </button>
      </div>
      <hr className="border-t-2 border-dashed" />
    </>
  );
}

function App() {
  const barRef = useRef<HTMLInputElement>(null);
  const [price, setPrice] = useState(0);
  const [itemlist, setItemlist] = useState<CartItem[]>([]);
  const [time, setTime] = useState("Welcome!");

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const products = useMemo(() => parseCSV(text), []);

  const removeItem = (index: number) => {
    const item = itemlist[index];
    const newItemlist =
      item.quantity > 1
        ? itemlist.map((it, i) =>
            i === index ? { ...it, quantity: it.quantity - 1 } : it,
          )
        : itemlist.filter((_, i) => i !== index);

    setItemlist(newItemlist);
    setPrice((p) => p - item.price);
  };

  const addItem = (product: Product) => {
    const itemName = `${(product.value / 100).toFixed(2)} - ${product.name}`;
    const existingIndex = itemlist.findIndex((item) => item.name === itemName);

    if (existingIndex !== -1) {
      setItemlist(
        itemlist.map((item, i) =>
          i === existingIndex ? { ...item, quantity: item.quantity + 1 } : item,
        ),
      );
    } else {
      setItemlist([
        ...itemlist,
        { name: itemName, price: product.value, quantity: 1 },
      ]);
    }

    setPrice((p) => p + product.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const barcode = barRef.current?.value;

    if (!barcode || !barRef.current) return;

    const product = products.find((p) => p.bar === barcode);
    if (product) {
      addItem(product);
      barRef.current.value = "";
    }
  };

  const clearCart = () => {
    setPrice(0);
    setItemlist([]);
    if (barRef.current) {
      barRef.current.value = "";
    }
  };

  return (
    <div className="bg-[#777777] grid place-items-center h-screen w-screen">
      <div className="bg-white w-l border-4 text-2xl">
        <div className="flex justify-between bg-black text-white text-5xl">
          <span>Deal</span>
          {time}
        </div>
        <div className="h-auto">
          {itemlist.map((item, index) => (
            <Item key={index} onRemove={() => removeItem(index)}>
              {item.name} {item.quantity > 1 && `(x${item.quantity})`}
            </Item>
          ))}
        </div>
        <div className="pl-2 text-5xl flex justify-between border-t-4 border-b-4">
          Total:
          <span>{(price / 100).toFixed(2)}</span>
          <button className="bg-black text-white pl-4 pr-4" onClick={clearCart}>
            clear
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            size={20}
            placeholder="Barcode here"
            className="pl-2 pr-2"
            ref={barRef}
          />
          <button type="submit" className="bg-black text-white pl-4 pr-4 p-1">
            ok
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
