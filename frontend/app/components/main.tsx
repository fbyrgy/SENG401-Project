'use client';

import React, { useEffect, useState } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Chatbox from './chatbox'; 

const stockData = [
  { name: 'Apple Inc.', symbol: 'AAPL', price: 175.42, change: +1.25 },
  { name: 'Tesla Inc.', symbol: 'TSLA', price: 244.23, change: -2.11 },
  { name: 'Amazon.com Inc.', symbol: 'AMZN', price: 123.45, change: +0.98 },
  { name: 'Microsoft Corp.', symbol: 'MSFT', price: 315.67, change: -0.65 },
  { name: 'Google LLC', symbol: 'GOOGL', price: 134.89, change: +2.23 }
];

interface NewsArticle {
  headline: string;
  source: string;
  link: string;
  picture?: string; // Optional property
}

const topGainers = stockData.filter(stock => stock.change > 0);
const topLosers = stockData.filter(stock => stock.change < 0);

const StockDashboard = () => {
  const [newsData, setNewsData] = useState<NewsArticle[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const { isLoggedIn } = useAuth();
  const [showChatbox, setShowChatbox] = useState(false); // control visibility of chatbox
  const [searchQuery, setSearchQuery] = useState('');

  const fetchNews = async (symbol: string) => {
        try {
          const response = await axios.get<{ articles: NewsArticle[] }>(
            `http://127.0.0.1:5003/news?keyword=${encodeURIComponent(symbol)}&limit=5`
          );
      
          setNewsData(response.data.articles);
        } catch (error) {
          console.error('Error fetching news:', error);
        }
      };

      const handleSearch = () => {
        if (searchQuery.trim() !== '') {
          fetchNews(searchQuery);
        }
      };
  
  useEffect(() => {
    const fetchWatchlist = async () => {
      if (!isLoggedIn) {
        setWatchlist([]);
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
          setWatchlist(data.watchlist || []);
        } else {
          console.error("Error fetching watchlist:", data.error);
        }
      } catch (error) {
        console.error("Error fetching watchlist:", error);
      }
    };
    

    fetchNews("stocks");
    fetchWatchlist();
  }, [isLoggedIn]);

  const handleChatboxToggle = () => {
    setShowChatbox(!showChatbox);
  };
  

  return (
    <div className="flex justify-center" style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '40px', padding: '20px', background: '#000' }}>


      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Watchlist Table - only rendered if it is not empty */}
        {watchlist.length > 0 && (
          <>
            <h2 style={{ color: 'white', marginBottom: '10px' }}>Your Watchlist</h2>
            <TableContainer
              component={Paper}
              sx={{
                maxWidth: '700px',
                borderRadius: '3%',
                background: '#404040',
                marginBottom: '40px',
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ background: "#181818", borderBottom: '1px solid #181818', color: 'white', width: '25%' }}>Name</TableCell>
                    <TableCell style={{ background: "#181818", borderBottom: '1px solid #181818', color: 'white', width: '25%' }}>Symbol</TableCell>
                    <TableCell style={{ background: "#181818", borderBottom: '1px solid #181818', color: 'white', width: '25%' }}>Price</TableCell>
                    <TableCell style={{ background: "#181818", borderBottom: '1px solid #181818', color: 'white', textAlign: 'right', paddingRight: '55px', width: '25%' }}>24H Change</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {watchlist.map((stock, index) => (
                    <TableRow key={index}>
                      <TableCell style={{ color: 'white', borderBottom: '1px solid #181818' }}>{stock}</TableCell>
                      <TableCell style={{ color: 'white', borderBottom: '1px solid #181818' }}>{stock}</TableCell>
                      <TableCell style={{ color: 'white', borderBottom: '1px solid #181818' }}>$--.--</TableCell>
                      <TableCell
                        sx={{
                          textAlign: 'right',
                          paddingRight: '40px',
                          borderBottom: '1px solid #181818'
                        }}
                      >
                        {/*TODO: add conditional colours when price data is available*/}
                        <span
                          style={{
                            color: '#ffffff',
                            backgroundColor: '#888888',
                            borderRadius: '999px',
                            padding: '5px 10px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '120px',
                            fontSize: '15px',
                          }}
                        >
                          --
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {/* Main Stock Table */}
        <h2 style={{ color: 'white', marginBottom: '10px' }}>Popular Symbols</h2>
        <TableContainer
          component={Paper}
          sx={{
            maxWidth: '700px',
            borderRadius: '3%',
            background: '#404040',
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ background: "#181818", borderBottom: '1px solid #181818', color: 'white', width: '25%' }}>Name</TableCell>
                <TableCell style={{ background: "#181818", borderBottom: '1px solid #181818', color: 'white', width: '25%' }}>Symbol</TableCell>
                <TableCell style={{ background: "#181818", borderBottom: '1px solid #181818', color: 'white', width: '25%' }}>Price</TableCell>
                <TableCell style={{ background: "#181818", borderBottom: '1px solid #181818', color: 'white', textAlign: 'right', paddingRight: '55px', width: '25%' }}>24H Change</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stockData.map((stock, index) => (
                <TableRow key={index}>
                  <TableCell style={{ color: 'white', borderBottom: '1px solid #181818' }}>{stock.name}</TableCell>
                  <TableCell style={{ color: 'white', borderBottom: '1px solid #181818' }}>{stock.symbol}</TableCell>
                  <TableCell style={{ color: 'white', borderBottom: '1px solid #181818' }}>${stock.price.toFixed(2)}</TableCell>
                  <TableCell
                    sx={{
                      textAlign: 'right',
                      paddingRight: '40px',
                      borderBottom: '1px solid #181818'
                    }}
                  >
                    <span
                      style={{
                        color: stock.change >= 0 ? '#31854D' : '#A61111',
                        backgroundColor: stock.change >= 0 ? '#ACD4B4' : '#CC7474',
                        borderRadius: '999px',
                        padding: '5px 10px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '120px',
                        fontSize: '15px',
                      }}
                    >
                      {stock.change >= 0 ? (
                        <ArrowUpwardIcon sx={{ fontSize: 30, marginRight: '10px' }} />
                      ) : (
                        <ArrowDownwardIcon sx={{ fontSize: 30, marginRight: '10px' }} />
                      )}
                      {Math.abs(stock.change)}%
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Stock News Table - Positioned Below Main Table */}
        {/* News Section Title */}
        <h2 style={{ color: 'white', marginTop:'40px', marginBottom: '10px' }}>Top Financial News</h2>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search Stocks (e.g., AAPL)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
          style={{
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            marginRight: '10px',
            width: '250px',
            backgroundColor: '#181818',
            color: 'white',
          }}
        />
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Search
        </Button>
      </div>

        {/* News Table (Matches Popular Symbols Layout) */}
        <TableContainer
          component={Paper}
          sx={{
            maxWidth: '700px',
            borderRadius: '3%',
            background: '#404040',
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  style={{
                    background: "#181818",
                    borderBottom: '1px solid #181818',
                    color: 'white',
                    width: '75%', // Wider to match stock "Name" column
                  }}
                >
                  Headline
                </TableCell>
                <TableCell
                  style={{
                    background: "#181818",
                    borderBottom: '1px solid #181818',
                    color: 'white',
                    width: '25%', // Narrower for news source
                  }}
                >
                  Source
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {newsData.length > 0 ? (
                newsData.map((news, index) => (
                  <TableRow key={index}>
                    <TableCell
                      style={{
                        color: 'white',
                        borderBottom: '1px solid #181818',
                      }}
                    >
                      <a
                        href={news.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: '#61dafb',
                          textDecoration: 'none',
                          fontWeight: 'bold',
                        }}
                      >
                        {news.headline}
                      </a>
                    </TableCell>
                    <TableCell
                      style={{
                        color: 'white',
                        borderBottom: '1px solid #181818',
                      }}
                    >
                      {news.source}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={2}
                    style={{
                      color: '#fff',
                      textAlign: 'center',
                      padding: '20px',
                      background: '#404040',
                    }}
                  >
                    No news available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
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
        <TableContainer component={Paper} sx={{ borderRadius: '3%', background: '#404040' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#fff', background: '#181818', borderBottom: '1px solid #181818' }}>Name</TableCell>
                <TableCell sx={{ color: '#fff', background: '#181818', borderBottom: '1px solid #181818' }}>Change</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {topGainers.map((stock, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ color: '#ddd', borderBottom: '1px solid #181818' }}>{stock.name}</TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #181818', textAlign: 'right', paddingRight: '40px' }}>
                    <span
                      style={{
                        color: stock.change >= 0 ? '#31854D' : '#A61111',
                        backgroundColor: stock.change >= 0 ? '#ACD4B4' : '#CC7474',
                        height: '34px',
                        borderRadius: '999px',
                        padding: '5px 10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        width: '110px',
                        fontSize: '15px',
                      }}
                    >
                      {stock.change >= 0 ? (
                        <ArrowUpwardIcon sx={{ fontSize: 20, marginRight: '5px' }} />
                      ) : (
                        <ArrowDownwardIcon sx={{ fontSize: 20, marginRight: '5px' }} />
                      )}
                      {Math.abs(stock.change)}%
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Top Losers Table */}
        <TableContainer component={Paper} sx={{ borderRadius: '3%', background: '#404040' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#fff', background: '#181818', borderBottom: '1px solid #181818' }}>Top Losers</TableCell>
                <TableCell sx={{ color: '#fff', background: '#181818', borderBottom: '1px solid #181818' }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {topLosers.map((stock, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ color: '#ddd', borderBottom: '1px solid #181818' }}>{stock.name}</TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #181818', textAlign: 'right', paddingRight: '40px' }}>
                    <span
                      style={{
                        color: stock.change >= 0 ? '#31854D' : '#A61111',
                        backgroundColor: stock.change >= 0 ? '#ACD4B4' : '#CC7474',
                        height: '34px',
                        borderRadius: '999px',
                        padding: '5px 10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        width: '110px',
                        fontSize: '15px',
                      }}
                    >
                      {stock.change >= 0 ? (
                        <ArrowUpwardIcon sx={{ fontSize: 20, marginRight: '5px' }} />
                      ) : (
                        <ArrowDownwardIcon sx={{ fontSize: 20, marginRight: '5px' }} />
                      )}
                      {Math.abs(stock.change)}%
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Conditionally Render the Chatbox */}
      {showChatbox && <Chatbox />}
    </div>
  );
};

export default StockDashboard;
