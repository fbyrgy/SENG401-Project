'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '../../components/header';
import { Button } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import StockChart from '../../components/stock_chart';
import Link from 'next/link';

export default function StockPage() {
  const params = useParams();
  const ticker = Array.isArray(params.ticker) ? params.ticker[0] : params.ticker;
  const { userId, isLoggedIn } = useAuth();
  const [isValidTicker, setIsValidTicker] = useState<boolean | null>(null);

  useEffect(() => {
    const validateTicker = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5004/validate_ticker?ticker=${ticker}`);
        const data = await response.json();
        setIsValidTicker(response.ok && data.valid);
      } catch (error) {
        console.error('Error validating ticker:', error);
        setIsValidTicker(false);
      }
    };

    validateTicker();
  }, [ticker]);

  const handleWatchlistAddition = async () => {
    if (!isLoggedIn) {
      alert('You must be logged in to add stocks to your watchlist.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/add_watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, stock_ticker: ticker }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to add stock to watchlist');

      console.log(`Stock ${ticker} added to watchlist successfully`);
    } catch (error) {
      console.error('Error adding stock to watchlist:', error);
    }
  };

  if (isValidTicker === null) {
    return <div className="text-white">Validating ticker...</div>;
  }

  if (!isValidTicker) {
    return (
      <>
      <Header />
      <div className="text-white text-center mt-10">
        <h1 className="text-2xl">No results for &#39;{ticker}&#39;</h1>
        <Link href="/">
          <Button variant="contained" color="primary" sx={{ marginTop: '10px' }}>
            Return Home
          </Button>
        </Link>
      </div>
      </>
    );
  }

  return (
    <div>
      <Header />

      <div className="flex justify-end mt-4 m-8">
        <Button variant="contained" color="primary" sx={{ width: '300px' }} onClick={handleWatchlistAddition}>
          Add to Watchlist
        </Button>
      </div>

      {ticker && <StockChart ticker={ticker} />}
    </div>
  );
}
