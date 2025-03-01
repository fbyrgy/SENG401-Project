'use client';  

import { useState } from 'react';

// Custom hook for managing search state and logic
export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return {
    searchQuery,
    handleSearchChange
  };
};