import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ContentItem from './ContentItem';
import './Home.css';

const Home = () => {
    const [contentData, setContentData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost/slang-sharing-backend/api/getSlangs.php');
                setContentData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="content-container">
            <div className="content-header">
                <span>编号</span>
                <span>图片</span>
                <span>Slang</span>
                <span>解释</span>
                <span>语音</span>
            </div>
            <div className="content-body">
                {contentData.map(item => (
                    <ContentItem
                        key={item.id}
                        id={item.id}
                        imageSrc={item.imageSrc}
                        slang={item.slang}
                        explanation={item.explanation}
                        audioSrc={item.audioSrc}
                    />
                ))}
            </div>
        </div>
    );
};

export default Home;