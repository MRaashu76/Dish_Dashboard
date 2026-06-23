import { useState, useEffect } from "react";

const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      const current = window.localStorage.getItem(key);
      const stringified = JSON.stringify(value);
      if (current !== stringified) {
        window.localStorage.setItem(key, stringified);
        window.dispatchEvent(new Event("local-storage"));
      }
    } catch (error) {
      console.error(error);
    }
  }, [key, value]);

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const item = window.localStorage.getItem(key);
        if (item && item !== JSON.stringify(value)) {
          setValue(JSON.parse(item));
        }
      } catch (error) {
        console.error(error);
      }
    };
    
    window.addEventListener("local-storage", handleStorageChange);
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("local-storage", handleStorageChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [key, value]);

  return [value, setValue];
};

export default useLocalStorage;
