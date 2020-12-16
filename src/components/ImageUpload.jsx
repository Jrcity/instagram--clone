import { useState } from 'react';
import { Button, LinearProgress } from '@material-ui/core';
import { RiUpload2Fill } from "react-icons/ri";
import firebase from 'firebase';

import {db, storage} from "../config/firebase"

import './ImageUpload.css';

function ImageUpload({username}) {
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);

    function handleChange(e) {
        if(e.target.files[0]) {
            setImage(e.target.files[0])
        }
    }

    function handleUpload(){
        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        uploadTask.on('state_changed', (snapshot) => {
            //progess bar function
            const progress = Math.round((snapshot.bytesTransferred /  snapshot.totalBytes)* 100);
            setProgress(progress);
        }, (error) => {
            //handle errors
            console.error(error.message)
        }, () => {
            //when completed
            storage.ref('images').child(image.name).getDownloadURL().then(url => {
                //post image to database
                db.collection('posts').add({
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    caption,
                    username,
                    imgSrc: url
                });

                //reset progress bar, caption, image
                setProgress(0);
                setCaption('');
                setImage(null);

            });
        })
    }
    return (
        <div className={'ImageUpload '}>
            <LinearProgress variant={'buffer'} value={progress} valueBuffer={Math.round(Math.random() + progress)} />
            <input type="text" placeholder={'Enter a caption...'} value={caption} onChange={e => setCaption(e.target.value)} />
            <input type="image" onChange={handleChange} />
            <Button onClick={handleUpload}>
                {`Upload `}<RiUpload2Fill size={'1.8rem'} />
            </Button>
        </div>
    )
}

export default ImageUpload
 