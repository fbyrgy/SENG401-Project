"use client";

import React, { useState, useEffect, useCallback } from "react";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

// Define the type for each symbol object returned from the API
interface Symbol {
  symbol: string;
  instrument_name: string;
}

export default function Search() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredSymbols, setFilteredSymbols] = useState<Symbol[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchQuery(value);
    setPage(1); // Reset to the first page on new search
    setFilteredSymbols([]); // Clear previous search results

    if (value.length > 0) {
      setIsLoading(true);
      fetchSymbols(value, 1);
    } else {
      setFilteredSymbols([]); // Clear filtered symbols when search query is empty
      setHasMore(true); // Reset "has more" state
    }
  };

  // Fetch symbols with pagination support
  const fetchSymbols = useCallback(
    (query: string, pageNum: number) => {
      fetch(`http://127.0.0.1:5004/symbol_search?symbol=${query}&page=${pageNum}`)
        .then((response) => response.json())
        .then((data: { results: Symbol[] }) => {
          if (data.results) {
            // Remove duplicates by using a Map based on the symbol field
            setFilteredSymbols((prevSymbols) => {
              const combinedSymbols = [...prevSymbols, ...data.results];
              const uniqueSymbols = Array.from(
                new Map(combinedSymbols.map((symbol) => [symbol.symbol, symbol])).values()
              );
              return uniqueSymbols;
            });

            if (data.results.length < 5) {
              setHasMore(false); // If less than 5 results are returned, stop loading more
            }
          }
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching symbols:", error);
          setIsLoading(false);
        });
    },
    []
  );

  // Handle scroll to load more results
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const bottom = event.currentTarget.scrollHeight === event.currentTarget.scrollTop + event.currentTarget.clientHeight;
    if (bottom && !isLoading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  // Effect to fetch more results when page changes
  useEffect(() => {
    if (page > 1) {
      fetchSymbols(searchQuery, page);
    }
  }, [page, searchQuery, fetchSymbols]);

  return (
    <div className="flex w-full h-[120px] shadow-md items-center justify-between px-4" style={{ background: "#000" }}>
      {/* Search Bar */}
      <div className="flex items-center justify-center flex-grow ml-4 relative">
        <TextField
          value={searchQuery}
          onChange={handleSearchChange}
          variant="outlined"
          placeholder="Search for Stocks, ETFs, and Crypto"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon style={{ color: "white" }} />
              </InputAdornment>
            ),
            style: { color: "white" },
          }}
          sx={{
            width: "100%",
            maxWidth: "600px",
            backgroundColor: "#404040",
            borderRadius: "20px",
          }}
        />

        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute top-4 right-41 text-white">Loading...</div>
        )}

        {/* Dropdown for filtered results */}
        {searchQuery.length > 0 && filteredSymbols.length > 0 && !isLoading && (
          <div
            className="absolute top-14 w-full max-w-[600px] bg-[#404040] text-white rounded-lg shadow-lg z-50"
            style={{ maxHeight: "200px", overflowY: "auto" }}
            onScroll={handleScroll}
          >
            {filteredSymbols.map((symbol, index) => (
              <div key={index} className="p-2 border-b border-gray-700 hover:bg-gray-700 cursor-pointer">
                {symbol.symbol} - {symbol.instrument_name}
              </div>
            ))}
          </div>
        )}

        {/* No results message */}
        {searchQuery.length > 0 && filteredSymbols.length === 0 && !isLoading && (
          <div className="absolute top-14 w-full max-w-[600px] bg-[#404040] text-white rounded-lg shadow-lg p-2 z-50">
            No results found
          </div>
        )}
      </div>
    </div>
  );
}