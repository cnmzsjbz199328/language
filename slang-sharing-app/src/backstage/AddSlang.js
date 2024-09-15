import React, { useState } from 'react';
import axios from 'axios';
import { ReactMediaRecorder } from 'react-media-recorder';
import styles from './AddSlang.module.css'; // Import CSS module
import config from '../config'; // Import config

const AddSlang = () => {
    const [formData, setFormData] = useState({
        slang: '',
        explanation: '',
        image: null,
        audio: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [audioPreview, setAudioPreview] = useState(null);
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    const [isImageGenerated, setIsImageGenerated] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image' && files.length > 0) {
            const file = files[0];
            setFormData(prevState => ({
                ...prevState,
                [name]: file
            }));
            setImagePreview(URL.createObjectURL(file));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleAudioStop = (blobUrl, blob) => {
        setFormData(prevState => ({
            ...prevState,
            audio: blob
        }));
        setAudioPreview(blobUrl);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setIsSubmitSuccessful(false);

        
    // Log the API host to check if it's correctly loaded
    console.log('API Host:', config.apiHost);
    
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
    
        try {
            const response = await axios.post(`${config.apiHost}/addSlang.php`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Response:', response.data);
            setIsSubmitSuccessful(true);
        } catch (error) {
            console.error('Error adding slang:', error);
            alert('Failed to submit: ' + (error.response ? JSON.stringify(error.response.data) : error.message));
        } finally {
            setIsSubmitting(false);
        }
    };
    

    const handleGenerateImage = async () => {
        setIsGeneratingImage(true);
        setIsImageGenerated(false);
        try {
            const response = await axios.post(`${config.apiHost}/generateImage.php`, {
                prompt: formData.explanation
            });
            const imageBlob = await fetch('data:image/png;base64,' + response.data).then(res => res.blob());
            const imageFile = new File([imageBlob], 'generated.png', { type: 'image/png' });
            setFormData(prevState => ({
                ...prevState,
                image: imageFile
            }));
            setImagePreview(URL.createObjectURL(imageFile));
            setIsImageGenerated(true);
        } catch (error) {
            console.error('Error generating image:', error);
        } finally {
            setIsGeneratingImage(false);
        }
    };

    return (
        <div className={styles['add-slang-container']}>
            <h2>Add New Slang</h2>
            <form onSubmit={handleSubmit} className={styles['slang-form']}>
                <div className={styles['left-section']}>
                    <div className={styles['image-preview']}>
                        {imagePreview ? (
                            <img src={imagePreview} alt="Preview" />
                        ) : (
                            <span>Image preview will appear here</span>
                        )}
                    </div>
                    <div className={styles['button-group']}>
                        <button
                            type="button"
                            onClick={handleGenerateImage}
                            disabled={!formData.explanation || isGeneratingImage}
                            className={`${styles['generate-button']} ${!formData.explanation ? styles['disabled'] : ''} ${isImageGenerated ? styles['success'] : ''}`}
                        >
                            {isImageGenerated ? 'Well Done' : isGeneratingImage ? 'Generating...' : 'Generate Image'}
                        </button>
                        <input type="file" name="image" accept="image/*" onChange={handleChange} className={styles['upload-button']} />
                    </div>
                </div>
                <div className={styles['right-section']}>
                    <div className={styles['form-group']}>
                        <label>Slang:</label>
                        <input type="text" name="slang" value={formData.slang} onChange={handleChange} className={styles['slang-input']} />
                    </div>
                    <div className={styles['form-group']}>
                        <label>Explanation:</label>
                        <textarea name="explanation" value={formData.explanation} onChange={handleChange} className={styles['explanation-input']} rows="4" />
                    </div>
                    <div className={styles['form-group']}>
                        <label>Audio:</label>
                        <ReactMediaRecorder
                            audio
                            onStop={handleAudioStop}
                            render={({ startRecording, stopRecording, status }) => (
                                <div>
                                    <button type="button" onClick={startRecording} style={{ marginRight: '10px' }}>Start Recording</button>
                                    <button type="button" onClick={stopRecording}>Stop Recording</button>
                                    <p>Status: {status}</p>
                                    {audioPreview && <audio src={audioPreview} controls style={{ display: 'block', marginTop: '10px' }} />}
                                </div>
                            )}
                        />
                    </div>
                    <button
                        type="submit"
                        className={`${styles['submit-button']} ${isSubmitting ? styles['disabled'] : ''} ${isSubmitSuccessful ? styles['success'] : ''}`}
                        disabled={isSubmitting}
                    >
                        {isSubmitSuccessful ? 'Well Done' : isSubmitting ? 'Submitting...' : 'Add Slang'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddSlang;