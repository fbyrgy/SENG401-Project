'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import Chatbox from './chatbox'; 
import StockTable from './stock_table';
import TopMovers from './top_movers';
import StockNews from "./news";
import { BACKEND_URL } from '../config';

interface NewsArticle {
  headline: string;
  source: string;
  link: string;
}

const STOCK_TICKERS = ['AAPL', 'MSFT', 'GOOGL'];

const StockDashboard = () => {
  const [newsData, setNewsData] = useState<NewsArticle[]>([]);
  const [watchlistTickers, setWatchlistTickers] = useState<string[]>([]);
  const { isLoggedIn } = useAuth();
  const [showChatbox, setShowChatbox] = useState(false); // control visibility of chatbox
  const [stockData, setStockData] = useState<{ name: string; symbol: string; price: number; change: number }[]>([]);
  const [watchlistData, setWatchlistData] = useState<{ name: string; symbol: string; price: number; change: number }[]>([]);
  const [, setLoading] = useState(true);

  useEffect(() => {
    
    // Fetch news data from API
    const fetchNews = async () => {
      try {
      const response = await fetch(`${BACKEND_URL}/news/news?keyword=stocks&limit=5`);
      if (!response.ok) {
        throw new Error(`Failed to fetch news: ${response.statusText}`);
      }
      const data = await response.json();
      if (data && Array.isArray(data.articles)) {
        setNewsData(data.articles);
      } else {
        console.error("API response does not contain expected articles:", data);
      }
      } catch (error) {
      console.error('Error fetching news:', error);
      }
    };

    const fetchWatchlist = async () => {
      if (!isLoggedIn) {
        setWatchlistTickers([]);
        return;
      }
    
      try {
        const email = localStorage.getItem("email");
        if (!email) {
          console.error("No email found in localStorage.");
          return;
        }
    
        const response = await fetch(`${BACKEND_URL}/connection/get_watchlist?email=${encodeURIComponent(email)}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
    
        const data = await response.json();
    
        if (response.ok) {
          setWatchlistTickers(data.watchlist || []);
        } else {
          console.error("Error fetching watchlist:", data.error);
        }
      } catch (error) {
        console.error("Error fetching watchlist:", error);
      }
    };

    const fetchStockData = async () => {
      try {
        const requests = STOCK_TICKERS.map(async (symbol) => {
          const response = await fetch(`${BACKEND_URL}/stocks/quote?ticker=${symbol}`);
          if (!response.ok) throw new Error(`Failed to fetch data for ${symbol}`);

          const data = await response.json();
          return {
            name: data.name,
            symbol: data.symbol.toUpperCase(),
            price: data.current_price,
            change: parseFloat(data.percent_change.toFixed(2))
          };
        });

        const stocks = await Promise.all(requests); // Fetch all stocks in parallel
        setStockData(stocks);
      } catch (error) {
        console.error('Error fetching stock data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
    fetchWatchlist();
    fetchStockData();
  }, [isLoggedIn]);

  useEffect(() => {
    if (watchlistTickers.length === 0) {
      setWatchlistData([]); 
      return;
    }
  
    const fetchWatchlistData = async () => {
      try {
        const requests = watchlistTickers.map(async (symbol) => {
          const response = await fetch(`${BACKEND_URL}/stocks/quote?ticker=${symbol}`);
          if (!response.ok) throw new Error(`Failed to fetch data for ${symbol}`);
  
          const data = await response.json();
          return {
            name: data.name,
            symbol: data.symbol.toUpperCase(),
            price: data.current_price,
            change: parseFloat(data.percent_change.toFixed(2)),
          };
        });
  
        const stocks = await Promise.all(requests);
        setWatchlistData(stocks);
      } catch (error) {
        console.error('Error fetching watchlist stock data:', error);
      }
    };
  
    fetchWatchlistData();
  }, [watchlistTickers]); 

  const handleChatboxToggle = () => {
    setShowChatbox(!showChatbox);
  };

return (
  <div className="flex flex-col md:flex-row justify-center items-start gap-6 md:gap-10 p-5 bg-background w-full">
    {/* Left Section */}
    <div className="flex flex-col items-center w-full md:w-[700px]">
      {/* Watchlist Table */}
      {watchlistTickers.length > 0 && (
        <StockTable stockData={watchlistData} title="Your Watchlist" />
      )}
      {/* Popular Symbols Table */}
      <StockTable stockData={stockData} title="Popular Symbols" />
      
      {/* Recent News */}
      <h2 className="text-center mb-4 text-white">Top Stories</h2>
      <StockNews newsData={newsData} />
    </div>

    {/* Right Section */}
    <div className="flex flex-col w-full lg:w-[300px] gap-6">
      {/* Button */}
      <Button
        variant="contained"
        sx={{
          width: '100%',
          backgroundColor: '#2596BE',
          fontWeight: 'bold',
          textTransform: 'none',
          borderRadius: '25px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
          transition: '0.3s',
          '&:hover': {
            backgroundColor: '#1B7A99',
            transform: 'scale(1.05)',
          },
        }}
        onClick={handleChatboxToggle}
      >
        Try our AI Advisor
      </Button>

      {/* Top Gainers Table */}
      <TopMovers direction="gainers" title="Top Gainers" />
      {/* Top Losers Table */}
      <TopMovers direction="losers" title="Top Losers" />
    </div>

    {/* Conditionally Render the Chatbox */}
    {showChatbox && (
      <div className="fixed bottom-5 right-5 md:relative md:bottom-auto md:right-auto w-full md:w-auto">
        <Chatbox ticker={''} />
      </div>
    )}
  </div>
);
};

export default StockDashboard;

