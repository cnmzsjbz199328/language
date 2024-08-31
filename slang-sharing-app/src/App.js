import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import AlphabetNavigation from './components/AlphabetNavigation';
import SearchNavbar from './components/SearchNavbar';
import Home from './components/Home';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import AddSlang from './backstage/AddSlang';
import './App.css';

function App() {
    const [filterLetter, setFilterLetter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const handleLetterClick = (letter) => {
        setFilterLetter(letter);
        setSearchTerm(''); // 清除搜索
        console.log(`选择的字母: ${letter}`);
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
        setFilterLetter(''); // 清除字母过滤
        console.log(`搜索词: ${term}`);
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={
                    <div className="App">
                        <SearchNavbar onSearch={handleSearch} />
                        <div className="content-both-container">
                            <AlphabetNavigation onLetterClick={handleLetterClick} />
                            <Home filterLetter={filterLetter} searchTerm={searchTerm} />
                        </div>
                        <Footer />
                    </div>
                } />
                <Route path="/login" element={<LoginModal show={true} onClose={() => {}} />} />
                <Route path="/add-slang" element={<AddSlang />} />
            </Routes>
        </Router>
    );
}

export default App;