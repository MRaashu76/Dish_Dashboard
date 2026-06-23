import { useState, useRef } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const INITIAL_RECIPES = [
  { 
    id: 1, title: "Classic Margherita", time: "25 min", diff: "Easy", bg: "bg-red-50", 
    image: "/images/margherita_pizza_1782140853526.png",
    ingredients: "1 pizza dough\n1/2 cup tomato sauce\n8 oz fresh mozzarella\nFresh basil leaves\nOlive oil",
    instructions: "1. Preheat oven to 500°F (260°C) with a pizza stone.\n2. Stretch dough into a circle.\n3. Spread tomato sauce evenly.\n4. Tear mozzarella and place on top.\n5. Bake for 10-12 minutes until crust is golden.\n6. Top with fresh basil and a drizzle of olive oil."
  },
  { 
    id: 2, title: "Spicy Arrabbiata", time: "30 min", diff: "Medium", bg: "bg-orange-50", 
    image: "/images/spicy_arrabbiata_1782140866625.png",
    ingredients: "1 lb penne pasta\n2 tbsp olive oil\n3 cloves garlic, minced\n1 tsp red pepper flakes\n28 oz crushed tomatoes\nFresh parsley",
    instructions: "1. Boil pasta in salted water until al dente.\n2. In a large pan, sauté garlic and red pepper flakes in olive oil for 1 minute.\n3. Add crushed tomatoes and simmer for 15 minutes.\n4. Toss pasta in the sauce.\n5. Garnish with chopped parsley."
  },
  { 
    id: 3, title: "Creamy Alfredo", time: "20 min", diff: "Easy", bg: "bg-yellow-50", 
    image: "/images/creamy_alfredo_1782140877357.png",
    ingredients: "8 oz fettuccine\n1/2 cup butter\n1 cup heavy cream\n1 1/2 cups grated Parmesan cheese\nBlack pepper",
    instructions: "1. Cook fettuccine in salted water.\n2. In a saucepan, melt butter and whisk in heavy cream over low heat.\n3. Simmer for 2 minutes, then whisk in Parmesan until smooth.\n4. Toss pasta with the sauce.\n5. Serve with freshly cracked black pepper."
  },
  { 
    id: 4, title: "Truffle Mushroom", time: "45 min", diff: "Hard", bg: "bg-stone-50", 
    image: "/images/truffle_mushroom_1782140889761.png",
    ingredients: "1 cup Arborio rice\n1/2 lb mixed mushrooms, sliced\n4 cups vegetable broth, warm\n1/2 cup dry white wine\n1/4 cup Parmesan cheese\n1 tbsp truffle oil",
    instructions: "1. Sauté mushrooms until browned; set aside.\n2. In the same pan, toast rice for 2 minutes.\n3. Pour in wine and stir until absorbed.\n4. Add warm broth 1/2 cup at a time, stirring continuously until absorbed before adding more.\n5. Once rice is creamy and tender, stir in mushrooms, Parmesan, and truffle oil."
  },
  { 
    id: 5, title: "Pesto Pasta", time: "15 min", diff: "Easy", bg: "bg-green-50", 
    image: "/images/pesto_pasta_1782140903417.png",
    ingredients: "1 lb pasta\n2 cups fresh basil\n1/3 cup pine nuts\n1/2 cup Parmesan cheese\n1/2 cup olive oil\n2 cloves garlic",
    instructions: "1. Boil pasta until al dente. Reserve 1/4 cup pasta water.\n2. In a food processor, blend basil, pine nuts, Parmesan, and garlic. Slowly drizzle in olive oil until smooth.\n3. Toss pasta with pesto, adding reserved water if needed to thin the sauce."
  },
  { 
    id: 6, title: "Garlic Butter Shrimp", time: "20 min", diff: "Medium", bg: "bg-blue-50", 
    image: "/images/garlic_butter_shrimp_1782140916426.png",
    ingredients: "1 lb large shrimp, peeled\n4 tbsp butter\n4 cloves garlic, minced\n1/4 cup chicken broth\nJuice of 1/2 lemon\nFresh parsley",
    instructions: "1. Melt 2 tbsp butter in a skillet over medium-high heat.\n2. Add shrimp and cook for 1 minute per side until pink; remove from skillet.\n3. Add remaining butter, garlic, and broth to the skillet. Simmer to reduce slightly.\n4. Stir in lemon juice and return shrimp to the pan.\n5. Garnish with parsley."
  },
];

const BGS = ["bg-red-50", "bg-orange-50", "bg-yellow-50", "bg-green-50", "bg-blue-50", "bg-stone-50", "bg-purple-50", "bg-pink-50"];

const Recipes = () => {
  const [recipes, setRecipes] = useLocalStorage("dish_dashboard_recipes", INITIAL_RECIPES);
  
  const [selectedRecipe, setSelectedRecipe] = useState(null); // For viewing
  const [editingRecipe, setEditingRecipe] = useState(null); // For Add/Edit form
  
  const fileInputRef = useRef(null);

  // Form State
  const [formState, setFormState] = useState({
    title: "", time: "30 min", diff: "Easy", ingredients: "", instructions: "", image: ""
  });

  const openAddModal = () => {
    setFormState({ title: "", time: "30 min", diff: "Easy", ingredients: "", instructions: "", image: "" });
    setEditingRecipe("new");
  };

  const openEditModal = (recipe) => {
    setFormState({
      title: recipe.title,
      time: recipe.time,
      diff: recipe.diff,
      ingredients: recipe.ingredients || "",
      instructions: recipe.instructions || "",
      image: recipe.image || ""
    });
    setEditingRecipe(recipe.id);
    setSelectedRecipe(null); // Close view modal
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormState(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formState.title.trim()) return;

    if (editingRecipe === "new") {
      const newRecipe = {
        id: Date.now(),
        ...formState,
        bg: BGS[Math.floor(Math.random() * BGS.length)],
        image: formState.image || INITIAL_RECIPES[Math.floor(Math.random() * INITIAL_RECIPES.length)].image
      };
      setRecipes([...recipes, newRecipe]);
    } else {
      setRecipes(recipes.map(r => r.id === editingRecipe ? { ...r, ...formState } : r));
    }
    setEditingRecipe(null);
  };

  const handleDelete = (id) => {
    setRecipes(recipes.filter(r => r.id !== id));
    setSelectedRecipe(null);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto w-full relative">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recipes</h1>
          <p className="text-gray-500 mt-1">Your saved culinary inspirations</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-brand-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm hover:bg-brand-700 transition-colors"
        >
          + New Recipe
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map(recipe => (
          <div 
            key={recipe.id} 
            onClick={() => setSelectedRecipe(recipe)}
            className={`rounded-2xl p-6 ${recipe.bg} border border-black/5 cursor-pointer group`}
          >
            <div className="aspect-video bg-white/50 rounded-xl mb-4 flex items-center justify-center overflow-hidden shadow-sm">
              <img 
                src={recipe.image} 
                alt={recipe.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-brand-600 transition-colors">{recipe.title}</h3>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {recipe.time}
              </span>
              <span>•</span>
              <span>{recipe.diff}</span>
            </div>
          </div>
        ))}
      </div>

      {/* View Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="aspect-video relative">
              <img src={selectedRecipe.image} alt={selectedRecipe.title} className="w-full h-full object-cover" />
              <button 
                onClick={() => setSelectedRecipe(null)}
                className="absolute top-4 right-4 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="p-8">
              <div className="flex items-start justify-between mb-2">
                <h2 className="text-3xl font-bold text-gray-900">{selectedRecipe.title}</h2>
                <button 
                  onClick={() => openEditModal(selectedRecipe)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-semibold rounded-lg transition-colors"
                >
                  Edit
                </button>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-8 border-b border-gray-100 pb-6">
                <span className="flex items-center gap-1 font-medium">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {selectedRecipe.time}
                </span>
                <span className="px-3 py-1 rounded-full bg-brand-50 text-brand-700 font-bold border border-brand-100">
                  {selectedRecipe.diff}
                </span>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-1 border-r border-gray-100 pr-4">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                    Ingredients
                  </h3>
                  <ul className="text-sm text-gray-600 space-y-2 list-disc pl-4">
                    {(selectedRecipe.ingredients || "").split('\n').filter(Boolean).map((ing, i) => (
                      <li key={i} className="leading-relaxed">{ing}</li>
                    ))}
                  </ul>
                </div>
                <div className="md:col-span-2">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                    Instructions
                  </h3>
                  <div className="text-sm text-gray-600 space-y-4">
                    {(selectedRecipe.instructions || "").split('\n').filter(Boolean).map((step, i) => (
                      <p key={i} className="leading-relaxed">{step}</p>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                <button 
                  onClick={() => handleDelete(selectedRecipe.id)}
                  className="text-red-500 font-medium hover:text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Delete Recipe
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {editingRecipe && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingRecipe === "new" ? "Add New Recipe" : "Edit Recipe"}
              </h2>
              <button 
                onClick={() => setEditingRecipe(null)}
                className="text-gray-400 hover:text-gray-600 p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            
            <form onSubmit={handleSave} className="space-y-6">
              {/* Photo Upload Section */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Recipe Photo</label>
                <div 
                  className="w-full aspect-video rounded-xl border-2 border-dashed border-gray-200 overflow-hidden relative group cursor-pointer hover:border-brand-400 bg-gray-50 flex items-center justify-center transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {formState.image ? (
                    <img src={formState.image} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center text-gray-400">
                      <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      <span className="text-sm font-medium">Click to upload photo</span>
                    </div>
                  )}
                  <div className={`absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity`}>
                    <span className="text-white font-medium text-sm bg-black/40 px-3 py-1.5 rounded-full">Change Photo</span>
                  </div>
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Recipe Name</label>
                <input 
                  type="text" 
                  required
                  value={formState.title}
                  onChange={e => setFormState({...formState, title: e.target.value})}
                  placeholder="e.g. Grandma's Lasagna"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Prep Time</label>
                  <input 
                    type="text" 
                    value={formState.time}
                    onChange={e => setFormState({...formState, time: e.target.value})}
                    placeholder="e.g. 45 min"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Difficulty</label>
                  <select 
                    value={formState.diff}
                    onChange={e => setFormState({...formState, diff: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 outline-none bg-white"
                  >
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Ingredients</label>
                  <textarea 
                    value={formState.ingredients}
                    onChange={e => setFormState({...formState, ingredients: e.target.value})}
                    placeholder="1 lb pasta&#10;2 cups basil&#10;..."
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none min-h-[120px] resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Instructions</label>
                  <textarea 
                    value={formState.instructions}
                    onChange={e => setFormState({...formState, instructions: e.target.value})}
                    placeholder="1. Boil water...&#10;2. Add salt...&#10;..."
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none min-h-[120px] resize-none"
                  />
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-gray-100 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setEditingRecipe(null)}
                  className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm transition-colors"
                >
                  Save Recipe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recipes;
