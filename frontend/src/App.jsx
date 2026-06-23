import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import Meals from "./pages/Meals";
import Recipes from "./pages/Recipes";
import Grocery from "./pages/Grocery";
import Settings from "./pages/Settings";
import useLocalStorage from "./hooks/useLocalStorage";

const App = () => {
  const [darkMode] = useLocalStorage("dish_dashboard_darkmode", false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
  }, [darkMode]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="meals" element={<Meals />} />
          <Route path="recipes" element={<Recipes />} />
          <Route path="grocery" element={<Grocery />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
