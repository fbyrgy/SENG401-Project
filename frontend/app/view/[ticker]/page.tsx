'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Header from '../../components/header';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import StockChart from '../../components/stock_chart';
import Chatbox from '../../components/chatbox';

export default function StockPage() {
  const params = useParams();
  const ticker: string = Array.isArray(params.ticker) ? params.ticker[0] : params.ticker ?? ""; // ✅ Ensure it's always a string

  const { userId, isLoggedIn } = useAuth();
  const [showChatbox, setShowChatbox] = useState(false);
  const [newsData, setNewsData] = useState<any[]>([]);

  // ✅ Fetch news for the specific stock ticker
  useEffect(() => {
    if (!ticker) return;

    const fetchNews = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5003/news?keyword=${encodeURIComponent(ticker)}&limit=5`);
        setNewsData(response.data?.articles || []);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchNews();
  }, [ticker]); // Runs when ticker changes

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

  return (
    <div className="min-h-screen w-full bg-[#121212] text-white flex flex-col items-center p-6">
      {/* Header */}
      <Header />

      {/* Stock Chart Section */}
      <div className="w-full bg-[#404040] rounded-[3%] p-4 mt-6">
        <h2 className="text-white text-lg mb-4 text-center">{ticker} Stock Chart</h2>
        {ticker && <StockChart ticker={ticker} />}
      </div>

      {/* ✅ News Section */}
      <h2 className="text-white text-xl font-bold mt-6">Latest News for {ticker}</h2>
      <TableContainer
        component={Paper}
        sx={{
          width: '100%',
          borderRadius: '10%',
          background: '#000',
          maxHeight: '400px',
          overflowY: 'auto',
          marginTop: '20px',
          padding: '10px',
          borderBottom: '1px solid #181818',
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#fff', background: '#181818', fontSize: '18px', fontWeight: 'bold' }}>
                Headline
              </TableCell>
              <TableCell sx={{ color: '#fff', background: '#181818', fontSize: '18px', fontWeight: 'bold' }}>
                Source
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {newsData.length > 0 ? (
              newsData.map((news, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ color: '#61dafb', borderBottom: '1px solid #181818', fontSize: '14px' }}>
                    <a href={news.link} target="_blank" rel="noopener noreferrer">
                      {news.headline}
                    </a>
                  </TableCell>
                  <TableCell sx={{ color: '#fff', borderBottom: '1px solid #181818', fontSize: '14px' }}>
                    {news.source}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} sx={{ color: '#fff', textAlign: 'center', padding: '20px', background: '#404040' }}>
                  No news available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Watchlist Button */}
      <Button
        variant="contained"
        color="primary"
        sx={{
          width: '100%',
          backgroundColor: '#2596BE',
          fontWeight: 'bold',
          textTransform: 'none',
          borderRadius: '25px',
          marginTop: '20px',
        }}
        onClick={handleWatchlistAddition}
      >
        Add {ticker} to Watchlist
      </Button>

      {/* ✅ Chatbox - Ensures `ticker` is defined before rendering */}
      {showChatbox && ticker && <Chatbox ticker={ticker} />}
    </div>
  );
}
