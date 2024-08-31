import React, { useState, useRef } from 'react';
import axios from 'axios';
import './AddSlang.css';

const AddSlang = () => {
    const [formData, setFormData] = useState({
        slang: '',
        explanation: '',
        image: null,
        audio: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [audioPreview, setAudioPreview] = useState(null);
    const [isGenerateButtonActive, setIsGenerateButtonActive] = useState(false);
    const mediaRecorderRef = useRef(null);
    const [isRecording, setIsRecording] = useState(false);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            const file = files[0];
            setFormData({
                ...formData,
                [name]: file
            });
            setImagePreview(URL.createObjectURL(file));
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
            if (name === 'explanation' && value.trim() !== '') {
                setIsGenerateButtonActive(true);
            } else if (name === 'explanation' && value.trim() === '') {
                setIsGenerateButtonActive(false);
            }
        }
    };

    const handleAudioStart = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.ondataavailable = (event) => {
            const audioBlob = event.data;
            const audioUrl = URL.createObjectURL(audioBlob);
            setFormData({
                ...formData,
                audio: audioBlob
            });
            setAudioPreview(audioUrl);
        };
        mediaRecorderRef.current.start();
        setIsRecording(true);
    };

    const handleAudioStop = () => {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('slang', formData.slang);
        data.append('explanation', formData.explanation);
        if (formData.image) {
            data.append('image', formData.image);
        }
        if (formData.audio) {
            data.append('audio', formData.audio);
        }

        try {
            const response = await axios.post('http://localhost/slang-sharing-backend/api/addSlang.php', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response.data);
        } catch (error) {
            console.error('Error adding slang:', error);
        }
    };

    const handleGenerateImage = async () => {
        try {
            const response = await axios.post('http://localhost/slang-sharing-backend/api/generateImage.php', {
                prompt: formData.explanation
            });
            setImagePreview('data:image/png;base64,' + response.data);
        } catch (error) {
            console.error('Error generating image:', error);
        }
    };

    return (
        <div className="add-slang-container">
            <form onSubmit={handleSubmit}>
                <div className="left-section">
                    <div className="image-preview">
                        {imagePreview ? (
                            <img src={imagePreview} alt="Preview" />
                        ) : (
                            <span>Image preview will appear here</span>
                        )}
                    </div>
                    <div className="button-group">
                        <button
                            type="button"
                            onClick={handleGenerateImage}
                            disabled={!isGenerateButtonActive}
                            className={`generate-button ${isGenerateButtonActive ? '' : 'disabled'}`}
                        >
                            Generate Image
                        </button>
                        <input type="file" name="image" accept="image/*" onChange={handleChange} className="upload-button" />
                    </div>
                </div>
                <div className="right-section">
                    <div className="form-group">
                        <label>Slang:</label>
                        <hr className="line-input" />
                        <input type="text" name="slang" value={formData.slang} onChange={handleChange} className="slang-input" />
                    </div>
                    <div className="form-group">
                        <label>Explanation:</label>
                        <textarea name="explanation" value={formData.explanation} onChange={handleChange} className="explanation-input" rows="4" />
                    </div>
                    <div className="form-group">
                        <label>Audio:</label>
                        <div className="audio-controls">
                            <button type="button" onClick={handleAudioStart} disabled={isRecording} style={{ marginRight: '10px' }}>Start Recording</button>
                            <button type="button" onClick={handleAudioStop} disabled={!isRecording}>Stop Recording</button>
                            {audioPreview && <audio src={audioPreview} controls />}
                        </div>
                    </div>
                    <button type="submit" className="submit-button">Add Slang</button>
                </div>
            </form>
        </div>
    );
};

export default AddSlang;
