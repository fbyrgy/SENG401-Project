'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Chatbox from './chatbox'; 
import StockTable from './stock_table';
import TopMovers from './top_movers';
import StockNews from "./news";

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
  const [stockData, setStockData] = useState([]);
  const [watchlistData, setWatchlistData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    // Fetch news data from API
    const fetchNews = async () => {
      try {
        const response = await axios.get<{ articles: NewsArticle[] }>(
          `http://127.0.0.1:5003/news?keyword=stocks&limit=5`
        );
        if (response.data && Array.isArray(response.data.articles)) {
          setNewsData(response.data.articles); 
        } else {
          console.error("API response does not contain expected articles:", response.data);
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
    
        const response = await fetch(`http://localhost:5001/get_watchlist?email=${encodeURIComponent(email)}`, {
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
          const response = await fetch(`http://localhost:5004/quote?ticker=${symbol}`);
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
          const response = await fetch(`http://localhost:5004/quote?ticker=${symbol}`);
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
    <div className="flex justify-center flex-row items-start gap-10 p-5 bg-background">

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Watchlist Table - only rendered if it is not empty */}
        {watchlistTickers.length > 0 && (
            <StockTable stockData={watchlistData} title="Your Watchlist" />
        )}
        {/* Popular Symbols table */}
        <StockTable stockData={stockData} title="Popular Symbols" />
        {/* Recent News */}
        <h2 className="text-center mb-4" style={{ color: 'white'}}>Top Stories</h2>
        <StockNews newsData={newsData} />
      </div>

      {/* Right Section */}
      <div style={{ display: 'flex', flexDirection: 'column', width: '300px', gap: '20px' }}>
        {/* Button */}
        <Button
          variant="contained"
          color="primary"
          sx={{
            margin: 'auto',
            marginBottom: '10px',
            width: '300px',
            marginLeft: '0px',
          }}
          onClick={handleChatboxToggle} // chatbox visibility
        >
          Try our AI Advisor
        </Button>

        {/* Top Gainers Table */}
        <TopMovers direction="gainers" title="Top Gainers" />
        {/* Top Losers Table */}
        <TopMovers direction="losers" title="Top Losers" />
      </div>

      {/* Conditionally Render the Chatbox */}
      {showChatbox && <Chatbox ticker={''} />}
    </div>
  );
};

export default StockDashboard;
