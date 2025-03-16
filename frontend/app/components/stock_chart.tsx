'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface StockChartProps {
  ticker: string;
}

export default function StockChart({ ticker }: StockChartProps) {
  const [stockData, setStockData] = useState([]);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await fetch(`http://localhost:5004/time_series?ticker=${ticker}&interval=1day`);
        const data = await response.json();
        if (data.error) {
          console.error("Error fetching stock data:", data.error);
          return;
        }
        
        // Convert API response to Recharts format and reverse order
        const formattedData = data.data.map((item) => ({
          date: item.datetime,
          price: parseFloat(item.close),
        })).reverse();
        
        setStockData(formattedData);
      } catch (error) {
        console.error("Failed to fetch stock data:", error);
      }
    };
    fetchStockData();
  }, [ticker]);

  return (
    <div className="mt-8">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={stockData}>
          <XAxis dataKey="date" stroke="#ffffff"/>
          <YAxis stroke="#ffffff"/>
          <Tooltip contentStyle={{ backgroundColor: "#333", color: "#fff" }}/>
          <Line type="monotone" dataKey="price" stroke="#82ca9d" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
