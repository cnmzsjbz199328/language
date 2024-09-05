import React, { useState } from 'react';
import axios from 'axios';
import { ReactMediaRecorder } from 'react-media-recorder';
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
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            const file = files[0];
            setFormData({
                ...formData,
                [name]: file
            });
            setImagePreview(URL.createObjectURL(file));
            console.log('Image selected:', file);
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
            console.log(`${name} changed:`, value);
        }
    };

    const handleAudioStop = (blobUrl, blob) => {
        setFormData({
            ...formData,
            audio: blob
        });
        setAudioPreview(blobUrl);
        console.log('Audio recorded:', blob);
        console.log('Audio URL:', blobUrl);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const data = new FormData();
        data.append('slang', formData.slang);
        data.append('explanation', formData.explanation);
        if (formData.image) {
            data.append('image', formData.image);
        }
        if (formData.audio) {
            data.append('audio', formData.audio);
        }

        const username = sessionStorage.getItem('username');
        if (username) {
            data.append('contributor', username);
        }

        const currentTime = new Date().toISOString();
        data.append('time', currentTime);

        try {
            const response = await axios.post('http://localhost/slang-sharing-backend/api/addSlang.php', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Response:', response.data);
        } catch (error) {
            console.error('Error adding slang:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGenerateImage = async () => {
        try {
            const response = await axios.post('http://localhost/slang-sharing-backend/api/generateImage.php', {
                prompt: formData.explanation
            });
            const imageBlob = await fetch('data:image/png;base64,' + response.data).then(res => res.blob());
            const imageFile = new File([imageBlob], 'generated.png', { type: 'image/png' });
            setFormData({
                ...formData,
                image: imageFile
            });
            setImagePreview(URL.createObjectURL(imageFile));
            console.log('Generated image:', imageFile);
        } catch (error) {
            console.error('Error generating image:', error);
        }
    };

    return (
        <div className="add-slang-container">
            <h2>Add New Slang</h2>
            <form onSubmit={handleSubmit} className="slang-form">
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
                        <input type="text" name="slang" value={formData.slang} onChange={handleChange} className="slang-input" />
                    </div>
                    <div className="form-group">
                        <label>Explanation:</label>
                        <textarea name="explanation" value={formData.explanation} onChange={handleChange} className="explanation-input" rows="4" />
                    </div>
                    <div className="form-group">
                        <label>Audio:</label>
                        <div className="audio-controls">
                            <ReactMediaRecorder
                                audio
                                onStop={handleAudioStop}
                                render={({ startRecording, stopRecording, mediaBlobUrl, status }) => (
                                    <div>
                                        <button type="button" onClick={() => { console.log('Start recording'); startRecording(); }} style={{ marginRight: '10px' }}>Start Recording</button>
                                        <button type="button" onClick={() => { console.log('Stop recording'); stopRecording(); }}>Stop Recording</button>
                                        <p>Status: {status}</p>
                                        {audioPreview && <audio src={audioPreview} controls style={{ display: 'block', marginTop: '10px' }} />}
                                    </div>
                                )}
                            />
                        </div>
                    </div>
                    <button type="submit" className={`submit-button ${isSubmitting ? 'disabled' : ''}`} disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Add Slang'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddSlang;