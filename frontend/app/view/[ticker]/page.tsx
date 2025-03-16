'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Header from '../../components/header';
import { Button } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import StockChart from '../../components/stock_chart';

export default function StockPage() {
  const params = useParams();
  const ticker = params.ticker;
  const { userId, isLoggedIn } = useAuth();
  const [stockData, setStockData] = useState([]);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await fetch(`http://localhost:5004/time_series?ticker=${ticker}&interval=1day`);
        const data = await response.json();
        if (data.error) {
          console.error("Error fetching stock data:", data.error);
          return;
        }
        
        // convert API response to Rechartsformat
        const formattedData = data.data.map((item) => ({
          date: item.datetime,
          price: parseFloat(item.close),
        }));
        
        setStockData(formattedData);
      } catch (error) {
        console.error("Failed to fetch stock data:", error);
      }
    };
    fetchStockData();
  }, [ticker]);

  const handleWatchlistAddition = async () => {
    if (!isLoggedIn) {
      alert("You must be logged in to add stocks to your watchlist.");
      return;
    }
    
    try {
      const response = await fetch("http://localhost:5001/add_watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, stock_ticker: ticker }),
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to add stock to watchlist");
      }
      console.log(`Stock ${ticker} added to watchlist successfully`);
    } catch (error) {
      console.error("Error adding stock to watchlist:", error);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white p-8">
      <Header />
      <h1 className="text-2xl font-bold">Viewing Stock: {ticker}</h1>
      
      <div className="mt-8">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={stockData}>
            <XAxis dataKey="date" stroke="#ffffff"/>
            <YAxis stroke="#ffffff"/>
            <Tooltip contentStyle={{ backgroundColor: "#333", color: "#fff" }}/>
            <Line type="monotone" dataKey="price" stroke="#82ca9d" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-end mt-4">
        <Button
          variant="contained"
          color="primary"
          onClick={handleWatchlistAddition}
        >
          Add to Watchlist
        </Button>
        </div>
        {ticker && <StockChart ticker={ticker} />}
    </div>
  );
}