'use client'

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Header from '../../components/header';
import { useAuth } from '../../context/AuthContext';
import StockChart from '../../components/stock_chart';
import Search from '../../components/search';
import Chatbox from '../../components/chatbox';
import TopMovers from '../../components/top_movers';
import News from "../../components/news";
import Link from 'next/link';
import Button from '@mui/material/Button';

interface NewsArticle {
  headline: string;
  source: string;
  link: string;
}

export default function StockPage() {
  const params = useParams();
  const ticker = Array.isArray(params.ticker) ? params.ticker[0] : params.ticker;
  const { userId, isLoggedIn } = useAuth();
  const [showChatbox, setShowChatbox] = useState(false);
  const [newsData, setNewsData] = useState<NewsArticle[]>([]);
  const [isValidTicker, setIsValidTicker] = useState<boolean | null>(null);

  useEffect(() => {

    const fetchNews = async () => {
      try {
        const response = await axios.get<{ articles: NewsArticle[] }>(
          `http://127.0.0.1:5003/news?keyword=${ticker}&limit=5`
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
    fetchNews();
  }, []);

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
  } , [ticker]);

  const handleChatboxToggle = () => {
    setShowChatbox(!showChatbox);
  };

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
      if (!response.ok) throw new Error(data.error || "Failed to add stock to watchlist");

      console.log(`Stock ${ticker} added to watchlist successfully`);
    } catch (error) {
      console.error("Error adding stock to watchlist:", error);
    }
  };

  if (isValidTicker === null) {
    return <h2 className="text-white">Crunching data...</h2>;
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
    <div className="min-h-screen w-full bg-[#121212] border border-[#181818] text-white flex flex-col items-center p-6">
      {/* Header */}
      <div className="w-full h-[59px] bg-[#181818] shadow-md flex items-center justify-between px-4 fixed top-0 z-50">
        <Header />
      </div>

      {/* Search Bar */}
      <div className="mt-[40px] flex w-full h-[120px] items-center justify-between">
        <Search />
      </div>

      {/* Main Content */}
      <div className="flex flex-row w-full max-w-[1200px] gap-10 mt-6">
        {/* Left Section (Stock Chart & News) */}
        <div className="flex flex-col items-center w-[820px]">

          {/* Stock Chart */}
          <div className="w-full bg-[#404040] rounded-[3%] p-4">
            <h2 className="text-white text-lg mb-4 text-center"></h2>
            {ticker && <StockChart ticker={ticker} />}
          </div>

          {/* News Section */}
            <div className="w-full mt-6">
            <h2 className="text-center mb-4">Top Stories</h2>
            <News newsData={newsData} />
            </div>
        </div>

        {/* Right Section (Buttons, Gainers, Losers) */}
        <div className="flex flex-col w-[300px] gap-6">
          {/* Add to Watchlist Button */}
          <Button
            variant="contained"
            color="primary"
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
            onClick={handleWatchlistAddition}
          >
            Add to Watchlist
          </Button>

          {/* AI Assistant Button */}
          <Button
            variant="contained"
            color="primary"
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

          {/* Top Gainers & Losers */}
          <TopMovers direction="gainers" title="Top Gainers" />
          <TopMovers direction="losers" title="Top Losers" />
        </div>
      </div>

      {/* Chatbox */}
      {showChatbox && <Chatbox ticker={ticker} />}

    </div>
  );
}