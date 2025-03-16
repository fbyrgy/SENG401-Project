// 'use client'

// import { useParams } from 'next/navigation';
// import Header from '../../components/header';
// import { Button } from '@mui/material';
// import { useAuth } from '../../context/AuthContext';
// import StockChart from '../../components/stock_chart';

// export default function StockPage() {
//   const params = useParams();
//   const ticker = Array.isArray(params.ticker) ? params.ticker[0] : params.ticker;
//   const { userId, isLoggedIn } = useAuth();

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
//     <div>
//       <Header />
//       <h1 className="text-white">Viewing Stock: {ticker}</h1>
      
//       <div className="flex justify-end mt-4 m-8">
//         <Button
//           variant="contained"
//           color="primary"
//           sx={{
//             width: '300px',
//           }}
//           onClick={handleWatchlistAddition}
//         >
//           Add to Watchlist
//         </Button>
//         </div>
//         {ticker && <StockChart ticker={ticker} />}
//     </div>
//   );
// }

'use client';

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
  
      if (!response.ok) {
        throw new Error("Failed to add stock to watchlist");
      }
      console.log(`Stock ${ticker} added to watchlist successfully`);
    } catch (error) {
      console.error("Error adding stock to watchlist:", error);
    }
  };
  
  return (
    <div className="relative w-[1440px] h-[1024px] bg-[#121212] border border-[#181818] text-white">
      {/* Top Bar */}
      <div className="absolute top-0 w-full h-[59px] bg-[#181818]"></div>
      <Header />

      {/* Search Bar */}
      <div className="absolute left-[278px] top-[115px] w-[531px] h-[43px] bg-[#404040] rounded-[20px]"></div>
      
      {/* AI Button */}
      <button className="absolute left-[1096px] top-[258px] w-[260px] h-[49px] bg-[#2596BE] rounded-[20px] flex justify-center items-center text-white font-bold">
        AI Assistant
      </button>
      
      {/* Stock Chart */}
      <div className="absolute left-[125px] top-[202px] w-[820px] h-[524px]">
        {ticker && <StockChart ticker={ticker} />}
      </div>
      
      {/* News Section */}
      <div className="absolute left-[136px] top-[785px] w-[809px] h-[185px] bg-[#404040] rounded-[20px]"></div>
      
      {/* Gainers Section */}
      <div className="absolute left-[1070px] top-[340px] w-[312px] h-[370px] bg-[#404040] rounded-[20px]"></div>
      
      {/* Add to Watchlist Button */}
      <div className="absolute right-[50px] top-[120px]">
        <Button
          variant="contained"
          color="primary"
          sx={{ width: '300px' }}
          onClick={handleWatchlistAddition}
        >
          Add to Watchlist
        </Button>
      </div>
    </div>
  );
}
