'use client';

import React, { useEffect, useState } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import axios from 'axios';
import Chatbox from './chatbox'; 

const stockData = [
  { name: 'Apple Inc.', symbol: 'AAPL', price: 175.42, change: +1.25 },
  { name: 'Tesla Inc.', symbol: 'TSLA', price: 244.23, change: -2.11 },
  { name: 'Amazon.com Inc.', symbol: 'AMZN', price: 123.45, change: +0.98 },
  { name: 'Microsoft Corp.', symbol: 'MSFT', price: 315.67, change: -0.65 },
  { name: 'Google LLC', symbol: 'GOOGL', price: 134.89, change: +2.23 }
];

const topGainers = stockData.filter(stock => stock.change > 0);
const topLosers = stockData.filter(stock => stock.change < 0);

const StockDashboard = () => {
  const [newsData, setNewsData] = useState([]);
  const [showChatbox, setShowChatbox] = useState(false); // control visibility of chatbox

  // Fetch news data from API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('API'); // Replace with a real API
        setNewsData(response.data.articles); // API returns
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };
    fetchNews();
  }, []);

  const handleChatboxToggle = () => {
    setShowChatbox(!showChatbox);
  };

  return (
    <div className="flex justify-center" style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '40px', padding: '20px', background: '#000' }}>
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Main Stock Table */}
        <TableContainer component={Paper} sx={{ maxWidth: '700px', borderRadius: '3%', background: '#404040' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ background: "#181818", borderBottom: '1px solid #181818', color: 'white' }}>Name</TableCell>
                <TableCell style={{ background: "#181818", borderBottom: '1px solid #181818', color: 'white' }}>Symbol</TableCell>
                <TableCell style={{ background: "#181818", borderBottom: '1px solid #181818', color: 'white' }}>Price</TableCell>
                <TableCell style={{ background: "#181818", borderBottom: '1px solid #181818', color: 'white', textAlign: 'right', paddingRight: '55px' }}>24H Change</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stockData.map((stock, index) => (
                <TableRow key={index}>
                  <TableCell style={{ color: 'white', borderBottom: '1px solid #181818' }}>{stock.name}</TableCell>
                  <TableCell style={{ color: 'white', borderBottom: '1px solid #181818' }}>{stock.symbol}</TableCell>
                  <TableCell style={{ color: 'white', borderBottom: '1px solid #181818' }}>${stock.price.toFixed(2)}</TableCell>
                  <TableCell sx={{ textAlign: 'right', paddingRight: '40px', borderBottom: '1px solid #181818' }}>
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
        <TableContainer
          component={Paper}
          sx={{
            width: '700px',
            borderRadius: '10%',
            background: '#000',
            maxHeight: '400px',
            overflowY: 'auto',
            marginTop: '40px',
            padding: '10px',
            borderBottom: '1px solid #181818',
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#fff', background: '#181818' }}>Top Financial News</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {newsData.length > 0 ? (
                newsData.map((news, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ color: '#fff', borderBottom: '1px solid #181818' }}></TableCell>
                  </TableRow>
                ))
              ) : (
                <>
                  <TableRow>
                    <TableCell sx={{ color: '#fff', textAlign: 'center', padding: '20px', background: '#404040' }}>
                      Story 1
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: '#fff', textAlign: 'center', padding: '20px', background: '#404040' }}>
                      Story 2
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: '#fff', textAlign: 'center', padding: '20px', background: '#404040' }}>
                      Story 3
                    </TableCell>
                  </TableRow>
                </>
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
