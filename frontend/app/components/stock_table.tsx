import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const TIMEOUT_DELAY = 3000; 

const StockTable = ({ stockData, title }) => {
  const [loadingExceeded, setLoadingExceeded] = useState(false);

  useEffect(() => {
    if (!stockData || stockData.length === 0) {
      const timeout = setTimeout(() => {
        setLoadingExceeded(true);
      }, TIMEOUT_DELAY); 

      return () => clearTimeout(timeout);
    }
  }, [stockData]);

  if (!stockData || stockData.length === 0) {
    return (
      <h2 style={{ color: 'white', marginBottom: '10px' }}>
        {loadingExceeded ? `API credit limit exceeded for ${title}. Please refresh the page in 1 minute.` : `Loading ${title}...`}
      </h2>
    );
  }

  return (
    <>
      <h2 style={{ color: 'white', marginBottom: '10px' }}>{title}</h2>
      <TableContainer
        component={Paper}
        sx={{
          maxWidth: '700px',
          borderRadius: '3%',
          background: '#404040',
          marginBottom: '20px',
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ background: '#181818', borderBottom: '1px solid #181818', color: 'white', width: '25%' }}>Name</TableCell>
              <TableCell style={{ background: '#181818', borderBottom: '1px solid #181818', color: 'white', width: '25%' }}>Symbol</TableCell>
              <TableCell style={{ background: '#181818', borderBottom: '1px solid #181818', color: 'white', width: '25%' }}>Price</TableCell>
              <TableCell style={{ background: '#181818', borderBottom: '1px solid #181818', color: 'white', textAlign: 'right', paddingRight: '55px', width: '25%' }}>24H Change</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stockData.map((stock, index) => (
              <TableRow
                key={index}
                sx={{
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: '#505050' },
                }}
              >
                <TableCell style={{ color: 'white', borderBottom: '1px solid #181818' }}>
                  <Link href={`/view/${stock?.symbol?.toUpperCase() || ''}`} passHref>
                    <span style={{ textDecoration: 'none', color: 'inherit' }}>{stock?.name || 'N/A'}</span>
                  </Link>
                </TableCell>
                <TableCell style={{ color: 'white', borderBottom: '1px solid #181818' }}>
                  <Link href={`/view/${stock?.symbol?.toUpperCase() || ''}`} passHref>
                    <span style={{ textDecoration: 'none', color: 'inherit' }}>{stock?.symbol?.toUpperCase() || 'N/A'}</span>
                  </Link>
                </TableCell>
                <TableCell style={{ color: 'white', borderBottom: '1px solid #181818' }}>
                  <Link href={`/view/${stock?.symbol?.toUpperCase() || ''}`} passHref>
                    <span style={{ textDecoration: 'none', color: 'inherit' }}>${stock?.price?.toFixed(2) || 'N/A'}</span>
                  </Link>
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: 'right',
                    paddingRight: '40px',
                    borderBottom: '1px solid #181818',
                  }}
                >
                  <Link href={`/view/${stock?.symbol?.toUpperCase() || ''}`} passHref>
                    <span
                      style={{
                        color: stock?.change >= 0 ? '#31854D' : '#A61111',
                        backgroundColor: stock?.change >= 0 ? '#ACD4B4' : '#CC7474',
                        borderRadius: '999px',
                        padding: '5px 10px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '120px',
                        fontSize: '15px',
                      }}
                    >
                      {stock?.change >= 0 ? (
                        <ArrowUpwardIcon sx={{ fontSize: 30, marginRight: '10px' }} />
                      ) : (
                        <ArrowDownwardIcon sx={{ fontSize: 30, marginRight: '10px' }} />
                      )}
                      {Math.abs(stock?.change) || 'N/A'}%
                    </span>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default StockTable;
