// 'use client'

// import { useEffect, useState } from 'react';
// import { useParams } from 'next/navigation';
// import axios from 'axios';
// import Header from '../../components/header';
// import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
// import { ArrowUpward as ArrowUpwardIcon, ArrowDownward as ArrowDownwardIcon } from '@mui/icons-material';
// import { useAuth } from '../../context/AuthContext';
// import StockChart from '../../components/stock_chart';
// import Search from '../../components/search';
// import Chatbox from '../../components/chatbox';

// const topGainers = [
//   { name: 'Apple Inc.', change: +1.25 },
//   { name: 'Amazon.com Inc.', change: +0.98 },
//   { name: 'Google LLC', change: +2.23 }
// ];

// const topLosers = [
//   { name: 'Tesla Inc.', change: -2.11 },
//   { name: 'Microsoft Corp.', change: -0.65 }
// ];

// export default function StockPage() {
//   const params = useParams();
//   const ticker = Array.isArray(params.ticker) ? params.ticker[0] : params.ticker;
//   const { userId, isLoggedIn } = useAuth();
//   const [showChatbox, setShowChatbox] = useState(false);
//   const [newsData, setNewsData] = useState<any[]>([]);


//   // Fetch news data from API
//   useEffect(() => {
//     const fetchNews = async () => {
//       try {
//         const response = await axios.get('API'); // Replace with actual API
//         if (response.data?.articles) {
//           setNewsData(response.data.articles);
//         } else {
//           setNewsData([]); // Ensures it's always an array
//         }
//       } catch (error) {
//         console.error('Error fetching news:', error);
//         setNewsData([]); // Handles the error by setting an empty array
//       }
//     };
  
//     fetchNews();
//   }, []);
  

//   const handleChatboxToggle = () => {
//     setShowChatbox(!showChatbox);
//   };

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

//       const data = await response.json();
//       if (!response.ok) throw new Error(data.error || "Failed to add stock to watchlist");

//       console.log(`Stock ${ticker} added to watchlist successfully`);
//     } catch (error) {
//       console.error("Error adding stock to watchlist:", error);
//     }
//   };

//   return (
//     <div className="relative min-h-screen w-full bg-[#121212] border border-[#181818] text-white">

//       {/* Header */}
//       <div className="flex w-full h-[59px] bg-[#181818] shadow-md items-center justify-between px-4 fixed top-0 z-50">
//         <Header />
//       </div>
      
//       <div className="absolute left-[278px] top-[75px] w-[531px] h-[43px] bg-[#404040] rounded-[20px] ">
//         <Search />
//       </div>

// {/* AI Button */}
// <button
//   onClick={handleChatboxToggle}
//   className="absolute left-[1096px] top-[258px] w-[260px] h-[49px] bg-[#2596BE] rounded-[25px] flex justify-center items-center text-white font-bold transition-transform duration-300 shadow-md hover:bg-[#1B7A99] hover:scale-105"
// >
//   AI Assistant
// </button>


//       {/* Stock Chart */}
//       <div className="absolute left-[125px] top-[202px] w-[820px] h-[524px]">
//         {ticker && <StockChart ticker={ticker} />}
//       </div>

//   {/* News Section */}
// <TableContainer
//   component={Paper}
//   sx={{
//     position: 'absolute',
//     left: '136px',
//     top: '785px',
//     width: '700px',  // Adjusted width
//     maxHeight: '400px',  // Allows scrolling if content overflows
//     borderRadius: '10%',  // Consistent rounded corners
//     background: '#000',  // Darker background for contrast
//     overflowY: 'auto',
//     marginTop: '40px',
//     padding: '10px',
//     borderBottom: '1px solid #181818',  // Adds a subtle bottom border
//   }}
// >
//   <Table>
//     <TableHead>
//       <TableRow>
//         <TableCell sx={{ color: '#fff', background: '#181818', fontSize: '18px', fontWeight: 'bold' }}>
//           Top Financial News
//         </TableCell>
//       </TableRow>
//     </TableHead>
//     <TableBody>
//       {newsData.length > 0 ? (
//         newsData.map((news, index) => (
//           <TableRow key={index}>
//             <TableCell sx={{ color: '#fff', borderBottom: '1px solid #181818', fontSize: '14px' }}>
//               {news.title}
//             </TableCell>
//           </TableRow>
//         ))
//       ) : (
//         <>
//           <TableRow>
//             <TableCell sx={{ color: '#fff', textAlign: 'center', padding: '20px', background: '#404040' }}>
//               Story 1
//             </TableCell>
//           </TableRow>
//           <TableRow>
//             <TableCell sx={{ color: '#fff', textAlign: 'center', padding: '20px', background: '#404040' }}>
//               Story 2
//             </TableCell>
//           </TableRow>
//           <TableRow>
//             <TableCell sx={{ color: '#fff', textAlign: 'center', padding: '20px', background: '#404040' }}>
//               Story 3
//             </TableCell>
//           </TableRow>
//         </>
//       )}
//     </TableBody>
//   </Table>
// </TableContainer>

//       {/* Gainers & Losers */}
//       <div className="absolute left-[1070px] top-[340px] w-[312px] h-[370px]">
//         {/* Top Gainers */}
//         <TableContainer component={Paper} sx={{ marginBottom: '20px', background: '#404040', borderRadius: '10px' }}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell sx={{ color: '#fff', background: '#181818' }}>Top Gainers</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {topGainers.map((stock, index) => (
//                 <TableRow key={index}>
//                   <TableCell sx={{ color: '#ddd', borderBottom: '1px solid #181818' }}>{stock.name} (+{stock.change}%)</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         {/* Top Losers */}
//         <TableContainer component={Paper} sx={{ background: '#404040', borderRadius: '10px' }}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell sx={{ color: '#fff', background: '#181818' }}>Top Losers</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {topLosers.map((stock, index) => (
//                 <TableRow key={index}>
//                   <TableCell sx={{ color: '#ddd', borderBottom: '1px solid #181818' }}>{stock.name} ({stock.change}%)</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </div>

// {/* Add to Watchlist Button */}
// <div className="absolute left-[1096px] top-[120px] flex items-center">
//   <Button
//     variant="contained"
//     sx={{
//       width: "260px",
//       height: "49px",
//       backgroundColor: "#2596BE",
//       color: "white",
//       fontSize: "16px",
//       fontWeight: "bold",
//       textTransform: "none",
//       borderRadius: "25px",
//       boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
//       transition: "0.3s",
//       "&:hover": {
//         backgroundColor: "#1B7A99",
//         transform: "scale(1.05)",
//       },
//     }}
//     onClick={handleWatchlistAddition}
//   >
//     Add to Watchlist
//   </Button>
// </div>


//       {/* Chatbox */}
//       {showChatbox && <Chatbox />}
//     </div>
//   );
// }





// 'use client'

// import { useEffect, useState } from 'react';
// import { useParams } from 'next/navigation';
// import axios from 'axios';
// import Header from '../../components/header';
// import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
// import { ArrowUpward as ArrowUpwardIcon, ArrowDownward as ArrowDownwardIcon } from '@mui/icons-material';
// import { useAuth } from '../../context/AuthContext';
// import StockChart from '../../components/stock_chart';
// import Search from '../../components/search';
// import Chatbox from '../../components/chatbox';

// const topGainers = [
//   { name: 'Apple Inc.', change: +1.25 },
//   { name: 'Amazon.com Inc.', change: +0.98 },
//   { name: 'Google LLC', change: +2.23 }
// ];

// const topLosers = [
//   { name: 'Tesla Inc.', change: -2.11 },
//   { name: 'Microsoft Corp.', change: -0.65 }
// ];

// export default function StockPage() {
//   const params = useParams();
//   const ticker = Array.isArray(params.ticker) ? params.ticker[0] : params.ticker;
//   const { userId, isLoggedIn } = useAuth();
//   const [showChatbox, setShowChatbox] = useState(false);
//   const [newsData, setNewsData] = useState<any[]>([]);

//   useEffect(() => {
//     const fetchNews = async () => {
//       try {
//         const response = await axios.get('API'); // Replace with actual API
//         setNewsData(response.data?.articles || []);
//       } catch (error) {
//         console.error('Error fetching news:', error);
//       }
//     };
//     fetchNews();
//   }, []);

//   const handleChatboxToggle = () => {
//     setShowChatbox(!showChatbox);
//   };

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

//       const data = await response.json();
//       if (!response.ok) throw new Error(data.error || "Failed to add stock to watchlist");

//       console.log(`Stock ${ticker} added to watchlist successfully`);
//     } catch (error) {
//       console.error("Error adding stock to watchlist:", error);
//     }
//   };

//   return (
//     <div className="min-h-screen w-full bg-[#121212] border border-[#181818] text-white flex flex-col items-center p-6">
//       {/* Header */}
//       <div className="w-full h-[59px] bg-[#181818] shadow-md flex items-center justify-between px-4 fixed top-0 z-50">
//         <Header />
//       </div>

//       {/* Search Bar */}
//       <div className="mt-[80px] flex w-full h-[120px] shadow-md items-center justify-between">
//         <Search />
//       </div>

//       {/* Main Content */}
//       <div className="flex flex-row w-full max-w-[1200px] gap-10 mt-6">
//         {/* Left Section (Stock Chart & News) */}
//         <div className="flex flex-col items-center w-[820px]">

//           {/* Stock Chart */}
//           <div className="w-full bg-[#404040] rounded-[3%] p-4">
//             <h2 className="text-white text-lg mb-4 text-center"></h2>
//             {ticker && <StockChart ticker={ticker} />}
//           </div>

//           {/* News Section */}
//           <TableContainer
//             component={Paper}
//             sx={{
//               width: '100%',
//               borderRadius: '10%',
//               background: '#000',
//               maxHeight: '400px',
//               overflowY: 'auto',
//               marginTop: '40px',
//               padding: '10px',
//               borderBottom: '1px solid #181818',
//             }}
//           >
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell sx={{ color: '#fff', background: '#181818', fontSize: '18px', fontWeight: 'bold' }}>
//                     Top Financial News
//                   </TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {newsData.length > 0 ? (
//                   newsData.map((news, index) => (
//                     <TableRow key={index}>
//                       <TableCell sx={{ color: '#fff', borderBottom: '1px solid #181818', fontSize: '14px' }}>
//                         {news.title}
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 ) : (
//                   <>
//                     <TableRow>
//                       <TableCell sx={{ color: '#fff', textAlign: 'center', padding: '20px', background: '#404040' }}>
//                         Story 1
//                       </TableCell>
//                     </TableRow>
//                     <TableRow>
//                       <TableCell sx={{ color: '#fff', textAlign: 'center', padding: '20px', background: '#404040' }}>
//                         Story 2
//                       </TableCell>
//                     </TableRow>
//                     <TableRow>
//                       <TableCell sx={{ color: '#fff', textAlign: 'center', padding: '20px', background: '#404040' }}>
//                         Story 3
//                       </TableCell>
//                     </TableRow>
//                   </>
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </div>

//         {/* Right Section (Gainers, Losers, AI Button) */}
//         <div className="flex flex-col w-[300px] gap-6">
//           {/* AI Assistant Button */}
//           <Button
//             variant="contained"
//             color="primary"
//             sx={{
//               width: '100%',
//               backgroundColor: '#2596BE',
//               fontWeight: 'bold',
//               textTransform: 'none',
//               borderRadius: '25px',
//               boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
//               transition: '0.3s',
//               '&:hover': {
//                 backgroundColor: '#1B7A99',
//                 transform: 'scale(1.05)',
//               },
//             }}
//             onClick={handleChatboxToggle}
//           >
//             Try our AI Advisor
//           </Button>

//           {/* Top Gainers & Losers Tables */}
//           {[{ title: 'Top Gainers', data: topGainers }, { title: 'Top Losers', data: topLosers }].map(({ title, data }) => (
//             <TableContainer key={title} component={Paper} sx={{ borderRadius: '3%', background: '#404040' }}>
//               <Table>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell sx={{ color: '#fff', background: '#181818', borderBottom: '1px solid #181818' }}>{title}</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {data.map((stock, index) => (
//                     <TableRow key={index}>
//                       <TableCell sx={{ color: '#ddd', borderBottom: '1px solid #181818' }}>
//                         {stock.name} ({stock.change > 0 ? '+' : ''}{stock.change}%)
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           ))}
//         </div>
//       </div>

//       {/* Chatbox */}
//       {showChatbox && <Chatbox />}
//     </div>
//   );
// }


'use client'

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Header from '../../components/header';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { ArrowUpward as ArrowUpwardIcon, ArrowDownward as ArrowDownwardIcon } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import StockChart from '../../components/stock_chart';
import Search from '../../components/search';
import Chatbox from '../../components/chatbox';

const topGainers = [
  { name: 'Apple Inc.', change: +1.25 },
  { name: 'Amazon.com Inc.', change: +0.98 },
  { name: 'Google LLC', change: +2.23 }
];

const topLosers = [
  { name: 'Tesla Inc.', change: -2.11 },
  { name: 'Microsoft Corp.', change: -0.65 }
];

export default function StockPage() {
  const params = useParams();
  const ticker = Array.isArray(params.ticker) ? params.ticker[0] : params.ticker;
  const { userId, isLoggedIn } = useAuth();
  const [showChatbox, setShowChatbox] = useState(false);
  const [newsData, setNewsData] = useState<any[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('API'); // Replace with actual API
        setNewsData(response.data?.articles || []);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };
    fetchNews();
  }, []);

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

  return (
    <div className="min-h-screen w-full bg-[#121212] border border-[#181818] text-white flex flex-col items-center p-6">
      {/* Header */}
      <div className="w-full h-[59px] bg-[#181818] shadow-md flex items-center justify-between px-4 fixed top-0 z-50">
        <Header />
      </div>

       {/* Search Bar */}
       <div className="mt-[40px] flex w-full h-[120px] shadow-md items-center justify-between">
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
          <TableContainer
            component={Paper}
            sx={{
              width: '100%',
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
                  <TableCell sx={{ color: '#fff', background: '#181818', fontSize: '18px', fontWeight: 'bold' }}>
                    Top Financial News
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {newsData.length > 0 ? (
                  newsData.map((news, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ color: '#fff', borderBottom: '1px solid #181818', fontSize: '14px' }}>
                        {news.title}
                      </TableCell>
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
          {[{ title: 'Top Gainers', data: topGainers }, { title: 'Top Losers', data: topLosers }].map(({ title, data }) => (
            <TableContainer key={title} component={Paper} sx={{ borderRadius: '3%', background: '#404040' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: '#fff', background: '#181818', borderBottom: '1px solid #181818' }}>{title}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((stock, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ color: '#ddd', borderBottom: '1px solid #181818' }}>
                        {stock.name} ({stock.change > 0 ? '+' : ''}{stock.change}%)
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ))}
        </div>
      </div>

      {/* Chatbox */}
      {showChatbox && <Chatbox />}
    </div>
  );
}
