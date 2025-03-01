import Header from './components/header';
import Search from './components/search';
import StockDashboard from './components/main';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

export default function Home() {
  return (
    
    <div>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
      />
      <Header />
      <Search/>
      <StockDashboard/>
    </div>
  );
}
