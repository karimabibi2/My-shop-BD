
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CategoryContextType {
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <CategoryContext.Provider value={{ 
      activeCategory, 
      setActiveCategory, 
      isDrawerOpen, 
      setIsDrawerOpen 
    }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (!context) throw new Error('useCategory must be used within a CategoryProvider');
  return context;
};
