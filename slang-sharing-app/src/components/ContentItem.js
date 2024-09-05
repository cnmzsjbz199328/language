import React from 'react';
import PropTypes from 'prop-types';
import styles from './ContentItem.module.css'; // 使用 CSS 模块

const ContentItem = ({ id, imageSrc, slang, explanation, audioSrc, contributor, time }) => (
    <div className={styles['content-item']}>
        <div className={styles['content-item-id']}>{id}</div>
        <div className={styles['content-item-image']}>
            <img src={imageSrc} alt={slang} />
        </div>
        <div className={styles['content-item-slang']}>{slang}</div>
        <div className={styles['content-item-explanation']}>{explanation}</div>
        <div className={styles['content-item-contributor']}>{contributor}</div>
        <div className={styles['content-item-time']}>{new Date(time).toLocaleString()}</div>
        <div className={styles['content-item-audio']}>
            <button onClick={() => new Audio(audioSrc).play()}>🔊</button>
        </div>
    </div>
);

ContentItem.propTypes = {
    id: PropTypes.number.isRequired,
    imageSrc: PropTypes.string.isRequired,
    slang: PropTypes.string.isRequired,
    explanation: PropTypes.string.isRequired,
    audioSrc: PropTypes.string.isRequired,
    contributor: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
};

export default ContentItem;