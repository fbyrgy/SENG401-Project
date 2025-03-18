import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

const News = ({ newsData }: { newsData: any[] }) => {
  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: "12px",
        background: "#202020", 
        width: "100%",
        maxHeight: "400px",
        overflowY: "auto",
        padding: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)", 
      }}
    >
      <Table>
        {/* Table Header */}
        <TableHead>
          <TableRow sx={{ backgroundColor: "#303030" }}> 
            <TableCell sx={{ color: "#fff", fontSize: "16px", fontWeight: "bold", padding: "12px" }}>Headline</TableCell>
            <TableCell sx={{ color: "#fff", fontSize: "16px", fontWeight: "bold", textAlign: "right", padding: "12px" }}>Source</TableCell>
          </TableRow>
        </TableHead>

        {/* Table Body */}
        <TableBody>
          {newsData.length > 0 ? (
            newsData.map((news, index) => (
              <TableRow
                key={index}
                sx={{
                  backgroundColor: "#2a2a2a", 
                  "&:hover": { backgroundColor: "#1e1e1e" }, 
                }}
              >
                <TableCell sx={{ color: "#61dafb", fontSize: "14px", fontWeight: "500", padding: "15px" }}>
                  <a href={news.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit" }}>
                    {news.headline}
                  </a>
                </TableCell>
                <TableCell sx={{ color: "#ffffff", fontSize: "14px", padding: "15px", textAlign: "right" }}>
                  {news.source}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={2} sx={{ color: "#fff", textAlign: "center", padding: "20px", background: "#303030", borderRadius: "8px" }}>
                No financial news available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default News;
