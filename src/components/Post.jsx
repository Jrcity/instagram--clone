import { Avatar, IconButton } from '@material-ui/core';
import './Post.css'
import {  MoreHoriz } from '@material-ui/icons';
import firebase from 'firebase';
import { IoBookmarkOutline, IoChatbubbleOutline, IoHeartOutline, IoPaperPlaneOutline } from "react-icons/io5";
import { useEffect, useState } from 'react';
import { db } from '../config/firebase';

function Post({avatar, imgSrc, username, user, caption, postId }) {
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    useEffect(()=> {

        var unsubscribe;
        if(postId) {
            unsubscribe = db.collection('posts').doc(postId).collection('comments').orderBy('timestamp', 'desc').onSnapshot((snapshot) => {
                setComments(snapshot.docs.map((doc) => ({commentId: doc.id, comment: doc.data()}
                )))
            })
        }
        return () => {
            unsubscribe()
        }
    }, [postId])

    function postComment(e) {
        e.preventDefault();

        //simple input validation
        let text = comment.trim();
        if(text) {
            db.collection('posts').doc(postId).collection('comments').add({
                username: user.displayName,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    text,
                });

                setComment('')
        }

        setComment('')        
    }

    return (
        <div className={'Post'} >
            <div className={'Post__header'}>
                <div className="Post__headerLeft">
                    <Avatar className={'Post__headerAvatar'}  src={avatar} alt={username} />
                    <h4>{username}</h4>
                </div>
                <IconButton>
                    <MoreHoriz />
                </IconButton>
            </div>
            <div className="Post__body">
                <img className={'Post__image'} src={imgSrc} alt={'img'} />
               
            </div>
            <div className={'Post__footer'}>
                <div className="Post__footerIcons">
                    <div className="Post__iconsLeft">
                        <IconButton>
                            <IoHeartOutline color={'#000'} size={'1.7rem'} />
                        </IconButton>
                        <IconButton>
                            <IoChatbubbleOutline color={'#000'} size={'1.7rem'} style={{transform: 'rotateY(180deg)'}}/>
                        </IconButton>
                        <IconButton>
                            <IoPaperPlaneOutline color={'#000'} size={'1.7rem'} />
                        </IconButton>

                    </div>
                    <div className="Post__iconsRight">
                        <IconButton>
                            <IoBookmarkOutline color={'#000'} size={'1.7rem'} />
                        </IconButton>
                    </div>
                </div>
                 <div className="post__Comments">
                     <p className={'Post__footerText'}>
                    <strong>{`${username} `}</strong>
                    <span>{caption}</span>
                     </p>
                     {comments.map(({commentId, comment}) => {
const {text, username} = comment;
return (<p key={commentId} className={'Post__footerText'}>
                    <strong>{`${username} `}</strong>
                    <span>{text}</span>
                     </p>)
                     } )}
                 </div>
                <form className="Post__footerComment">
                    <input disabled={!user} onChange={(e) => setComment(e.target.value)} value={comment} className={'Post__footerInput'} placeholder={'Add a comment...'} type={'text'} />
                    <button className={'Post__footerButton'}
                    disabled={!comment} onClick={postComment} type={'submit'}>Post</button>
                </form>
            </div>
        </div>
    )
}

export default Post
