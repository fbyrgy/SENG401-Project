import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface Stock {
  name: string;
  symbol: string;
  changesPercentage: number;
}

const TopMovers = ({ direction, title }: { direction: "gainers" | "losers"; title: string }) => {
  const [topStocks, setTopStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchTopMovers = async () => {
      try {
        const endpoint = `${BACKEND_URL}/stockmovers/biggest_${direction}`;
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid API response"); // Handle non-array response
        }

        setTopStocks(data);
      } catch (error) {
        console.error(`Error fetching top ${direction}:`, error);
        setError(true);
        setTopStocks([]); // Ensure topStocks remains an array
      } finally {
        setLoading(false);
      }
    };

    fetchTopMovers();
  }, [direction]);

  if (loading) {
    return <CircularProgress sx={{ color: "#fff", display: "block", margin: "20px auto" }} />;
  }

  if (error) {
    return <p style={{ color: "white", textAlign: "center" }}>Error fetching data for {title}. API limit may be exceeded.</p>;
  }

  return (
    <TableContainer component={Paper} sx={{ borderRadius: "3%", background: "#404040", overflow: "hidden", width: "100%" }}>
      <Table sx={{ width: "100%" }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: "#fff", background: "#181818", borderBottom: "1px solid #181818" }}>{title}</TableCell>
            <TableCell sx={{ color: "#fff", background: "#181818", borderBottom: "1px solid #181818" }}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {topStocks.length > 0 ? (
            topStocks.map((stock, index) => (
              <TableRow
                key={index}
                sx={{
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "#505050" },
                  width: "100%",
                }}
              >
                <TableCell sx={{ color: "#ddd", borderBottom: "1px solid #181818" }}>
                  <Link href={`/view/${stock.symbol}`} passHref style={{ textDecoration: "none", color: "inherit", display: "block", width: "100%" }}>
                    {stock.name}
                  </Link>
                </TableCell>
                <TableCell sx={{ borderBottom: "1px solid #181818", textAlign: "right", paddingRight: "40px" }}>
                  <Link href={`/view/${stock.symbol}`} passHref style={{ textDecoration: "none", color: "inherit", display: "block", width: "100%" }}>
                    <span
                      style={{
                        color: stock.changesPercentage >= 0 ? "#31854D" : "#A61111",
                        backgroundColor: stock.changesPercentage >= 0 ? "#ACD4B4" : "#CC7474",
                        borderRadius: "999px",
                        padding: "5px 10px",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "120px",
                        fontSize: "15px",
                      }}
                    >
                      {stock.changesPercentage >= 0 ? (
                        <ArrowUpwardIcon sx={{ fontSize: 30, marginRight: "10px" }} />
                      ) : (
                        <ArrowDownwardIcon sx={{ fontSize: 30, marginRight: "10px" }} />
                      )}
                      {stock.changesPercentage.toFixed(2)}%
                    </span>
                  </Link>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={2} sx={{ color: "#fff", textAlign: "center", padding: "20px" }}>
                No data available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TopMovers;
