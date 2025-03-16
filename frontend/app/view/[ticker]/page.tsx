// 'use client'

// import { useParams } from 'next/navigation';
// import Header from '../../components/header';
// import { Button } from '@mui/material';
// import { useAuth } from '../../context/AuthContext';
// import StockChart from '../../components/stock_chart';
// import Search from '../../components/search';
// import Chatbox from '../../components/chatbox';
// import { useState } from 'react';


// export default function StockPage() {
//   const params = useParams();
//   const ticker = Array.isArray(params.ticker) ? params.ticker[0] : params.ticker;
//   const { userId, isLoggedIn } = useAuth();
//   const [showChatbox, setShowChatbox] = useState(false);


//   const handleWatchlistAddition = async () => {
//     console.log(userId);
//     if (!isLoggedIn) {
//       alert("You must be logged in to add stocks to your watchlist.");
//       return;
//     }
  
//     try {
//       const response = await fetch("http://localhost:5001/add_watchlist", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           user_id: userId,
//           stock_ticker: ticker,
//         }),
//       });
  
//       const data = await response.json();
  
//       if (!response.ok) {
//         throw new Error(data.error || "Failed to add stock to watchlist");
//       }
  
//       console.log(`Stock ${ticker} added to watchlist successfully`);
//     } catch (error) {
//       console.error("Error adding stock to watchlist:", error);
//     }
//   };
  
  
//   return (
//     <div className="relative w-[1440px] h-[1024px] bg-[#121212] border border-[#181818] text-white">
//       {/* Top Bar */}
//       <div className="absolute top-0 w-full h-[59px] bg-[#181818]">
//       <Header />
//       </div>


//       {/* Search Bar */}
//       <div className="absolute left-[278px] top-[115px] w-[531px] h-[43px] bg-[#404040] rounded-[20px]">
//       <Search />
//       </div>
      
//       {/* AI Button */}
//       <button onClick={() => setShowChatbox(!showChatbox)} className="absolute left-[1096px] top-[258px] w-[260px] h-[49px] bg-[#2596BE] rounded-[20px] flex justify-center items-center text-white font-bold">
//         AI Assistant
//       </button>
      
//       {/* Stock Chart */}
//       <div className="absolute left-[125px] top-[202px] w-[820px] h-[524px]">
//         {ticker && <StockChart ticker={ticker} />}
//       </div>
      
//       {/* News Section */}
//       <div className="absolute left-[136px] top-[785px] w-[809px] h-[185px] bg-[#404040] rounded-[20px]"></div>
      
//       {/* Gainers Section */}
//       <div className="absolute left-[1070px] top-[340px] w-[312px] h-[370px] bg-[#404040] rounded-[20px]"></div>
      
//       {/* Add to Watchlist Button */}
//       <div className="absolute right-[50px] top-[120px]">
//         <Button
//           variant="contained"
//           color="primary"
//           sx={{ width: '300px' }}
//           onClick={handleWatchlistAddition}
//         >
//           Add to Watchlist
//         </Button>
//       </div>
//       {showChatbox && <Chatbox />}
//     </div>
//   );
// }





'use client';

import { useParams } from 'next/navigation';
import Header from '../../components/header';
import { Button } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import StockChart from '../../components/stock_chart';
import Search from '../../components/search';
import Chatbox from '../../components/chatbox';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

interface NewsArticle {
  title: string;
  description?: string;
  url: string;
}

interface StockData {
  name: string;
  change: number;
}

export default function StockPage() {
  const params = useParams();
  const ticker = Array.isArray(params.ticker) ? params.ticker[0] : params.ticker;
  const { userId, isLoggedIn } = useAuth();
  const [showChatbox, setShowChatbox] = useState(false);
  const [newsData, setNewsData] = useState<NewsArticle[]>([]);
  const [gainers, setGainers] = useState<StockData[]>([]);
  const [losers, setLosers] = useState<StockData[]>([]);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await axios.get<{ gainers: StockData[]; losers: StockData[] }>('API_ENDPOINT_FOR_MARKET_DATA');
        setGainers(response.data.gainers);
        setLosers(response.data.losers);
      } catch (error) {
        console.error('Error fetching market data:', error);
      }
    };

    const fetchNews = async () => {
      try {
        const response = await axios.get<NewsArticle[]>('API_ENDPOINT_FOR_NEWS');
        setNewsData(response.data);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchMarketData();
    fetchNews();
  }, []);

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
      if (!response.ok) {
        throw new Error('Failed to add stock to watchlist');
      }
      console.log(`Stock ${ticker} added to watchlist successfully`);
    } catch (error) {
      console.error('Error adding stock to watchlist:', error);
    }
  };

  return (
    <div className="relative w-[1440px] h-[1024px] bg-[#121212] border border-[#181818] text-white">
      <div className="absolute top-0 w-full h-[59px] bg-[#181818]">
        <Header />
      </div>

      <div className="absolute left-[278px] top-[115px] w-[531px] h-[43px] bg-[#404040] rounded-[20px]">
        <Search />
      </div>

      <button onClick={() => setShowChatbox(!showChatbox)} className="absolute left-[1096px] top-[258px] w-[260px] h-[49px] bg-[#2596BE] rounded-[20px] flex justify-center items-center text-white font-bold">
        AI Assistant
      </button>

      <div className="absolute left-[125px] top-[202px] w-[820px] h-[524px]">
        {ticker && <StockChart ticker={ticker} />}
      </div>

      <div className="absolute left-[136px] top-[785px] w-[809px] h-[185px] bg-[#404040] rounded-[20px] overflow-auto">
        <h3 className="text-white p-2">Latest Financial News</h3>
        {newsData.length > 0 ? newsData.map((news, index) => (
          <p key={index} className="p-2">{news?.title}</p>
        )) : <p className="p-2">No news available.</p>}
      </div>

      <div className="absolute left-[1070px] top-[340px] w-[312px] h-[370px] bg-[#404040] rounded-[20px] overflow-auto">
        <h3 className="text-white p-2">Top Gainers</h3>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              {gainers.map((stock, index) => (
                <TableRow key={index}>
                  <TableCell>{stock.name}</TableCell>
                  <TableCell>
                    <span style={{ color: 'green' }}><ArrowUpwardIcon /> {stock.change}%</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <div className="absolute left-[1070px] top-[720px] w-[312px] h-[370px] bg-[#404040] rounded-[20px] overflow-auto">
        <h3 className="text-white p-2">Top Losers</h3>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              {losers.map((stock, index) => (
                <TableRow key={index}>
                  <TableCell>{stock.name}</TableCell>
                  <TableCell>
                    <span style={{ color: 'red' }}><ArrowDownwardIcon /> {stock.change}%</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <div className="absolute right-[50px] top-[120px]">
        <Button variant="contained" color="primary" sx={{ width: '300px' }} onClick={handleWatchlistAddition}>
          Add to Watchlist
        </Button>
      </div>
      {showChatbox && <Chatbox />}
    </div>
  );
}




// 'use client';

// import { useParams } from 'next/navigation';
// import Header from '../../components/header';
// import { Button, Table, TableBody, TableCell, TableContainer, TableRow, Paper } from '@mui/material';
// import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
// import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
// import { useAuth } from '../../context/AuthContext';
// import StockChart from '../../components/stock_chart';
// import Search from '../../components/search';
// import Chatbox from '../../components/chatbox';
// import { useEffect, useState } from 'react';
// import axios from 'axios';

// const stockData = [
//   { name: 'Apple Inc.', symbol: 'AAPL', price: 175.42, change: +1.25 },
//   { name: 'Tesla Inc.', symbol: 'TSLA', price: 244.23, change: -2.11 },
//   { name: 'Amazon.com Inc.', symbol: 'AMZN', price: 123.45, change: +0.98 },
//   { name: 'Microsoft Corp.', symbol: 'MSFT', price: 315.67, change: -0.65 },
//   { name: 'Google LLC', symbol: 'GOOGL', price: 134.89, change: +2.23 }
// ];

// const topGainers = stockData.filter(stock => stock.change > 0);
// const topLosers = stockData.filter(stock => stock.change < 0);

// export default function StockPage() {
//   const params = useParams();
//   const ticker = Array.isArray(params.ticker) ? params.ticker[0] : params.ticker;
//   const { userId, isLoggedIn } = useAuth();
//   const [newsData, setNewsData] = useState([]);
//   const [watchlist, setWatchlist] = useState<string[]>([]);
//   const [showChatbox, setShowChatbox] = useState(false);

//   useEffect(() => {
//     const fetchNews = async () => {
//       try {
//         // Replace 'API' with your real news API endpoint
//         const response = await axios.get('API');
//         setNewsData(response.data.articles);
//       } catch (error) {
//         console.error('Error fetching news:', error);
//       }
//     };

//     const fetchWatchlist = async () => {
//       if (!isLoggedIn) {
//         setWatchlist([]);
//         return;
//       }
//       try {
//         const email = localStorage.getItem("email");
//         if (!email) return;
//         const response = await fetch(`http://localhost:5001/get_watchlist?email=${encodeURIComponent(email)}`);
//         const data = await response.json();
//         if (response.ok) setWatchlist(data.watchlist || []);
//       } catch (error) {
//         console.error("Error fetching watchlist:", error);
//       }
//     };
    
//     fetchNews();
//     fetchWatchlist();
//   }, [isLoggedIn]);

//   const handleWatchlistAddition = async () => {
//     if (!isLoggedIn) {
//       alert("You must be logged in to add stocks to your watchlist.");
//       return;
//     }
//     try {
//       const response = await fetch("http://localhost:5001/add_watchlist", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ user_id: userId, stock_ticker: ticker }),
//       });
//       if (!response.ok) throw new Error("Failed to add stock to watchlist");
//       console.log(`Stock ${ticker} added to watchlist successfully`);
//       // Optionally, update your watchlist state here
//     } catch (error) {
//       console.error("Error adding stock to watchlist:", error);
//     }
//   };

//   return (
//     <div className="relative w-full min-h-screen bg-[#121212] text-white">
//       {/* Header */}
//       <header className="absolute top-0 w-full h-[59px] bg-[#181818]">
//         <Header />
//       </header>

//       {/* Search */}
//       <div className="absolute left-0 right-0 top-[80px] flex justify-center">
//         <Search />
//       </div>

//       {/* AI Assistant Toggle */}
//       <button 
//         onClick={() => setShowChatbox(!showChatbox)} 
//         className="absolute right-10 top-20 w-[260px] h-[49px] bg-[#2596BE] rounded-[20px] flex justify-center items-center text-white font-bold">
//         AI Assistant
//       </button>

//       {/* Stock Chart */}
//       <div className="absolute left-10 top-[150px] w-[820px]">
//         {ticker ? <StockChart ticker={ticker} /> : <p>Please select a stock ticker.</p>}
//       </div>

//       {/* Latest News Section */}
//       <div className="absolute left-10 top-[600px] w-[820px] bg-[#404040] rounded-[20px] p-4">
//         <h2 className="text-lg font-bold mb-2">Latest News</h2>
//         {newsData && newsData.length > 0 ? (
//           <ul>
//             {newsData.map((article, index) => (
//               <li key={index} className="mb-2">
//                 <a 
//                   href={article.url} 
//                   target="_blank" 
//                   rel="noopener noreferrer" 
//                   className="text-[#2596BE] hover:underline"
//                 >
//                   {article.title}
//                 </a>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p>No news available.</p>
//         )}
//       </div>

//       {/* Top Gainers & Losers & Watchlist Button */}
//       <div className="absolute right-10 top-[100px] flex flex-col gap-4">
//         <div className="bg-[#404040] rounded-[20px] p-4">
//           <h2 className="text-white text-lg text-center mb-2">Top Gainers</h2>
//           <TableContainer component={Paper} sx={{ borderRadius: '3%', background: '#404040' }}>
//             <Table>
//               <TableBody>
//                 {topGainers.map((stock, index) => (
//                   <TableRow key={index}>
//                     <TableCell sx={{ color: '#ddd' }}>{stock.name}</TableCell>
//                     <TableCell sx={{ color: '#31854D', display: 'flex', alignItems: 'center' }}>
//                       <ArrowUpwardIcon fontSize="small" /> {stock.change}%
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </div>
//         <div className="bg-[#404040] rounded-[20px] p-4">
//           <h2 className="text-white text-lg text-center mb-2">Top Losers</h2>
//           <TableContainer component={Paper} sx={{ borderRadius: '3%', background: '#404040' }}>
//             <Table>
//               <TableBody>
//                 {topLosers.map((stock, index) => (
//                   <TableRow key={index}>
//                     <TableCell sx={{ color: '#ddd' }}>{stock.name}</TableCell>
//                     <TableCell sx={{ color: '#FF4C4C', display: 'flex', alignItems: 'center' }}>
//                       <ArrowDownwardIcon fontSize="small" /> {stock.change}%
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </div>
//         <Button variant="contained" color="primary" sx={{ width: '300px' }} onClick={handleWatchlistAddition}>
//           Add to Watchlist
//         </Button>
//       </div>

//       {/* Chatbox */}
//       {showChatbox && (
//         <div className="absolute bottom-10 right-10">
//           <Chatbox />
//         </div>
//       )}
//     </div>
//   );
// }
