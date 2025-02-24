'use client';
import React from 'react';
import Link from 'next/link';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useSearch } from '../context/SearchInput';

export default function Search() {
  // Use the custom hook for search state and handler
  const { searchQuery, handleSearchChange } = useSearch();  

  return (
    <div className="flex w-full h-[120px]  shadow-md items-center justify-between px-4" style= {{background: '#000'}}
    >

      {/* Search Bar */}
      <div className="flex items-center justify-center flex-grow ml-4">
        <TextField
          value={searchQuery}
          onChange={handleSearchChange}  
          variant="outlined"
          placeholder="Search for Stocks, ETFs, and Crypto"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon style={{ color: 'white' }} />
              </InputAdornment>
            ),
            style: { color: 'white'}
          }}
          sx={{
            width: '500%',
            maxWidth: '600px',
            backgroundColor: '#404040',
            borderRadius: '20px',
          }}
        />
      </div>
    </div>
  );
}
