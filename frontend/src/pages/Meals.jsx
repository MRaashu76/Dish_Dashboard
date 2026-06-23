import useLocalStorage from "../hooks/useLocalStorage";

const Meals = () => {
  const [meals, setMeals] = useLocalStorage("dish_dashboard_meals", {
    Breakfast: ["Oatmeal with berries"],
    Lunch: ["Avocado Toast", "Side salad"],
    Dinner: ["Grilled Salmon", "Roasted Asparagus"],
  });

  const handleMealChange = (type, index, value) => {
    const updated = [...meals[type]];
    updated[index] = value;
    setMeals({ ...meals, [type]: updated });
  };

  const handleAddMeal = (type) => {
    setMeals({ ...meals, [type]: [...meals[type], ""] });
  };

  const handleDeleteMeal = (type, index) => {
    const updated = meals[type].filter((_, i) => i !== index);
    setMeals({ ...meals, [type]: updated });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Today's Meals</h1>
          <p className="text-gray-500">Plan your menu for the day</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-brand-600 bg-brand-50 px-3 py-1.5 rounded-full">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          Auto-saving
        </div>
      </div>

      <div className="bg-blue-50 text-blue-800 p-4 rounded-xl mb-8 flex items-start gap-3 border border-blue-100">
        <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <p className="text-sm leading-relaxed">
          <strong>How to use:</strong> Type your planned meals into the fields below. Click the <span className="font-semibold">"+ Add Item"</span> button to add another dish to a meal. To remove a dish, click the <span className="font-semibold text-red-500">trash icon</span> next to it. Everything is saved automatically!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(meals).map(([type, items]) => (
          <div key={type} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full 
                ${type === 'Breakfast' ? 'bg-amber-400' : type === 'Lunch' ? 'bg-orange-400' : 'bg-indigo-500'}
              `}></span>
              {type}
            </h2>
            
            <div className="space-y-3 flex-1">
              {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2 group">
                  <input
                    type="text"
                    placeholder={`e.g., Pancakes...`}
                    value={item}
                    onChange={(e) => handleMealChange(type, index, e.target.value)}
                    className="w-full bg-gray-50 border border-transparent rounded-lg px-3 py-2 text-sm focus:border-brand-500 focus:bg-white focus:ring-1 focus:ring-brand-500 transition-all outline-none"
                  />
                  <button 
                    onClick={() => handleDeleteMeal(type, index)}
                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="Delete item"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              ))}
            </div>

            <button 
              onClick={() => handleAddMeal(type)}
              className="mt-6 w-full py-2 border-2 border-dashed border-gray-200 text-gray-500 rounded-xl text-sm font-semibold hover:border-brand-300 hover:text-brand-600 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              Add Item
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Meals;
