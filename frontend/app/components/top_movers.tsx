import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

interface Stock {
  name: string;
  symbol: string;
  changesPercentage: number;
}

const TopMovers = ({ direction, title }: { direction: "gainers" | "losers"; title: string }) => {
  const [topStocks, setTopStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopMovers = async () => {
      try {
        const endpoint = `http://localhost:5006/biggest_${direction}`;
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();
        setTopStocks(data);
      } catch (error) {
        console.error(`Error fetching top ${direction}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopMovers();
  }, [direction]);

  if (loading) {
    return <CircularProgress sx={{ color: "#fff", display: "block", margin: "20px auto" }} />;
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
          {topStocks.map((stock, index) => (
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
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TopMovers;
