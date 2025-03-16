'use client'

import { useParams } from 'next/navigation';
import Header from '../../components/header';
import { Button } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import StockChart from '../../components/stock_chart';

export default function StockPage() {
  const params = useParams();
  const ticker = Array.isArray(params.ticker) ? params.ticker[0] : params.ticker;
  const { userId, isLoggedIn } = useAuth();

  const handleWatchlistAddition = async () => {
    console.log(userId);
    if (!isLoggedIn) {
      alert("You must be logged in to add stocks to your watchlist.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5001/add_watchlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          stock_ticker: ticker,
        }),
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
    <div>
      <Header />
      <h1 className="text-white">Viewing Stock: {ticker}</h1>
      
      <div className="flex justify-end mt-4 m-8">
        <Button
          variant="contained"
          color="primary"
          sx={{
            width: '300px',
          }}
          onClick={handleWatchlistAddition}
        >
          Add to Watchlist
        </Button>
      </div>
        {ticker && <StockChart ticker={ticker} />}
    </div>
  );
}