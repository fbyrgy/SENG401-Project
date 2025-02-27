'use client'

import { useParams } from 'next/navigation';
import Header from '../../components/header';

export default function StockPage() {

  const params = useParams();
  const ticker = params.ticker

  return (
    <div>
        <Header />
        <h1 className="text-white">Viewing Stock: {ticker}</h1>

    </div>
  );
}
