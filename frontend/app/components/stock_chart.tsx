'use client';

import { useEffect, useState } from 'react';
import { Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

interface StockChartProps {
  ticker: string;
}

export default function StockChart({ ticker }: StockChartProps) {
  const [stockData, setStockData] = useState([]);
  const [stockName, setStockName] = useState<string | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [percentChange, setPercentChange] = useState<number | null>(null);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [areaColor, setAreaColor] = useState<string>('#31854D'); 
  type RangeOption = '5day' | '1month' | '3month' | '1y';
  const [range, setRange] = useState<RangeOption>('5day'); // Default range

  // Intervals for each range
  const rangeOptions = {
    '5day': { interval: '30min', days: 5 },
    '1month': { interval: '1day', days: 30 },
    '3month': { interval: '1week', days: 90 },
    '1y': { interval: '1month', days: 365 },
  };

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const { interval, days } = rangeOptions[range];
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - days);

        const startStr = startDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        const endStr = endDate.toISOString().split('T')[0];

        const response = await fetch(
          `http://localhost:5004/time_series?ticker=${ticker}&interval=${interval}&start_date=${startStr}&end_date=${endStr}`
        );
        const data = await response.json();

        if (data.error) {
          console.error("Error fetching stock data:", data.error);
          return;
        }

        const formattedData = data.data.map((item: { datetime: string; close: string }) => ({
          date: item.datetime,
          price: parseFloat(item.close),
        })).reverse();

        setStockData(formattedData);

        if (formattedData.length > 0) {
          const latestPrice = formattedData[formattedData.length - 1].price;
          const oldestPrice = formattedData[0].price;
          setCurrentPrice(latestPrice);

          if (oldestPrice !== 0) {
            const change = ((latestPrice - oldestPrice) / oldestPrice) * 100;
            setPercentChange(change);
            setAreaColor(change >= 0 ? '#31854D' : '#A61111'); // Set the colour below the chart based on the change
          }

          // Scaling the y-axis based on the min and max prices
          const prices = formattedData.map((d: { date: string; price: number }) => d.price);
          setMinPrice(Math.min(...prices));
          setMaxPrice(Math.max(...prices));
        }
      } catch (error) {
        console.error("Failed to fetch stock data:", error);
      }
    };

    const fetchStockName = async () => {
      try {
        const response = await fetch(`http://localhost:5004/validate_ticker?ticker=${ticker}`);
        const data = await response.json();
        if (data.valid) {
          setStockName(data.name);
        } else {
          setStockName(null);
        }
      } catch (error) {
        console.error("Failed to fetch stock name:", error);
      }
    };

    fetchStockData();
    fetchStockName();
  }, [ticker, range]);

  return (
    <div className="mt-8">
      {/* Display current price and percentage change within range */}
      {currentPrice !== null && percentChange !== null && (
        <div className="flex items-center space-x-4 mb-2">
          <h2 className="text-2xl font-bold text-white">
            ${currentPrice.toFixed(2)}
          </h2>
          <span
            style={{
              color: percentChange >= 0 ? '#31854D' : '#A61111',
              backgroundColor: percentChange >= 0 ? '#ACD4B4' : '#CC7474',
              borderRadius: '999px',
              padding: '3px 8px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '80px',
              fontSize: '14px',
            }}
          >
            {percentChange >= 0 ? (
              <ArrowUpwardIcon sx={{ fontSize: 16, marginRight: '3px' }} />
            ) : (
              <ArrowDownwardIcon sx={{ fontSize: 16, marginRight: '3px' }} />
            )}
            {Math.abs(percentChange).toFixed(2)}%
          </span>
        </div>
      )}

      {/* Display stock name and ticker */}
      <h2 className="text-xl font-bold text-white mb-4">
        {stockName ? `${stockName} (${ticker.toUpperCase()})` : ticker.toUpperCase()}
      </h2>

      {/* Range selection buttons */}
      <div className="flex space-x-2 mb-4">
        {Object.keys(rangeOptions).map((key) => (
          <button
            key={key}
            onClick={() => setRange(key as RangeOption)}
            className={`px-2 py-1 text-sm rounded-lg border ${
              range === key ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            {key.toUpperCase()}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={stockData}>
          <XAxis dataKey="date" stroke="#ffffff" />
          <YAxis stroke="#ffffff" tickFormatter={(value) => value.toFixed(2)} domain={minPrice !== null && maxPrice !== null ? [minPrice, maxPrice] : ['auto', 'auto']} />
          <Tooltip 
            contentStyle={{ backgroundColor: "#333", color: "#fff" }}
            itemStyle={{ color: "#fff" }} 
            formatter={(value) => [`$${parseFloat(value as string).toFixed(2)}`, "Price"]}
          />
          <Area type="monotone" dataKey="price" stroke={areaColor} fill={areaColor} fillOpacity={0.3} />
          <Line type="monotone" dataKey="price" stroke={areaColor} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
