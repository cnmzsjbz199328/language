import React from 'react';
import PropTypes from 'prop-types';
//import './ContentItem.css'; // 如果有单独的样式文件

const ContentItem = ({ id, imageSrc, slang, explanation, audioSrc }) => (
    <div className="content-item">
        <span>{id}</span>
        <img src={imageSrc} alt={slang} />
        <span>{slang}</span>
        <span>{explanation}</span>
        <button onClick={() => new Audio(audioSrc).play()}>🔊</button>
    </div>
);

ContentItem.propTypes = {
    id: PropTypes.number.isRequired,
    imageSrc: PropTypes.string.isRequired,
    slang: PropTypes.string.isRequired,
    explanation: PropTypes.string.isRequired,
    audioSrc: PropTypes.string.isRequired,
};

export default ContentItem;