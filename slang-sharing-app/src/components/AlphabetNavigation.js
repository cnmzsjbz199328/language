// src/components/AlphabetNavigation/AlphabetNavigation.js
import React from 'react';
import './AlphabetNavigation.css';

const AlphabetNavigation = ({ onLetterClick }) => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    return (
        <div className="alphabet-navigation">
            {letters.map(letter => (
                <button
                    key={letter}
                    className="alphabet-button"
                    onClick={() => onLetterClick(letter)}
                >
                    {letter}
                </button>
            ))}
        </div>
    );
};

export default AlphabetNavigation;
