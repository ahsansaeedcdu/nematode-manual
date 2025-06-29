import './App.css';
import SearchBar from './components/SearchBar';
import AZFilter from './components/AZFilter';
import { useState } from 'react';
function App() {
  const [query, setQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState(null);
  return (
    <>
      <header className="header">
        <h1>NEMATODE</h1>
        <SearchBar
          value={query}
          onChange={setQuery}
          onClear={() => setQuery('')}
        />
        <AZFilter onLetterClick={(letter) => setSelectedLetter(letter)} />
      </header>

      <main className="main">
        
      </main>
    </>
  );
}

export default App;