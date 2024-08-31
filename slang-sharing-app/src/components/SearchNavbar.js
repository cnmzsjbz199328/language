import React, { useState } from 'react';
import './SearchNavbar.css';
import LoginModal from './LoginModal';

const SearchNavbar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(searchTerm);
    };

    const handleVoiceInput = () => {
        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = 'en-AU';
        recognition.onresult = (event) => {
            setSearchTerm(event.results[0][0].transcript);
            onSearch(event.results[0][0].transcript);
        };
        recognition.start();
        setIsListening(true);
        recognition.onend = () => setIsListening(false);
    };

    return (
        <nav className="search-navbar">
            <div className="logo-title">
                <h1 className="title">Australian Slang</h1>
            </div>
            <form className="search-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search Slang here..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="button" className="voice-button" onClick={handleVoiceInput}>
                    {isListening ? 'Listening...' : '🎤'}
                </button>
                <button type="submit" className="search-button">Search</button>
            </form>
            <button onClick={() => setShowLoginModal(true)} className="join-us-button">Join Us</button>
            <LoginModal show={showLoginModal} onClose={() => setShowLoginModal(false)} />
        </nav>
    );
};

export default SearchNavbar;