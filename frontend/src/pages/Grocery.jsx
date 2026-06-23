import { useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const Grocery = () => {
  const [items, setItems] = useLocalStorage("dish_dashboard_grocery", [
    { id: 1, name: "Fresh Basil", checked: false },
    { id: 2, name: "Mozzarella Cheese", checked: true },
    { id: 3, name: "San Marzano Tomatoes", checked: false },
  ]);
  const [newItem, setNewItem] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    setItems([...items, { id: Date.now(), name: newItem.trim(), checked: false }]);
    setNewItem("");
  };

  const toggleCheck = (id) => {
    setItems(items.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const deleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="p-8 max-w-2xl mx-auto w-full">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Grocery List</h1>
      <p className="text-gray-500 mb-8">What do you need to buy?</p>

      <form onSubmit={handleAdd} className="flex gap-3 mb-8">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add an item (e.g. Olive Oil)"
          className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <button type="submit" className="bg-brand-600 text-white px-6 py-3 rounded-xl font-semibold shadow-sm hover:bg-brand-700">
          Add
        </button>
      </form>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
        {items.length === 0 ? (
          <div className="p-8 text-center text-gray-400">All caught up!</div>
        ) : (
          items.map(item => (
            <div key={item.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
              <label className="flex items-center gap-4 cursor-pointer flex-1">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => toggleCheck(item.id)}
                  className="w-5 h-5 text-brand-600 rounded border-gray-300 focus:ring-brand-500 cursor-pointer"
                />
                <span className={`text-lg ${item.checked ? "line-through text-gray-400" : "text-gray-800"}`}>
                  {item.name}
                </span>
              </label>
              <button onClick={() => deleteItem(item.id)} className="text-gray-400 hover:text-red-500 p-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Grocery;
