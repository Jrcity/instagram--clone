import { useEffect, useState } from 'react';
import InstagramEmbed from 'react-instagram-embed';

import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

import { auth, db } from './config/firebase';
import logo from './logo.png';
import './App.css';

import Header from './components/Header';
import Post from './components/Post';
import { Button, CircularProgress, Input } from '@material-ui/core';
import ImageUpload from './components/ImageUpload';

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'relative',
    top: 300,
    width: 280,
    margin: 'auto',
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const unsubsribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user log in
        setUser(authUser);

        if (authUser.displayName) {
          //do nothing
          return;
        } else {
          return authUser.updateProfile({ displayName: username });
        }
      } else {
        //user log out
        setUser(null);
      }
    });

    return () => {
      //clean up
      unsubsribe();
    };
  }, [user, username]);

  //get all current post from firebase
  useEffect(() => {
    db.collection('posts')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          })),
        );
      });
  }, []);

  function handleSignup(event) {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .catch((error) => console.error(error.message));

    //hide modal after click signup
    setOpen(false);

    // reset inputs
    setEmail('');
    setPassword('');
    setUsername('');
  }

  function handleLogin(event) {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => console.error(error.message));

    setOpenSignIn(false);

    // reset inputs
    setEmail('');
    setPassword('');
    setUsername('');
  }

  // return posts.length ? (
  return (
    <div className="App">
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className={classes.paper}>
          <form className={'App__signup'}>
            <center>
              <img src={logo} alt={'logo'} />
            </center>
            <Input
              type={'text'}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={'Username'}
            />
            <Input
              type={'email'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={'Email Address'}
            />
            <Input
              type={'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={'Password'}
            />
            <Button type={'submit'} onClick={handleSignup}>
              Signup
            </Button>
          </form>
        </div>
      </Modal>
      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div className={classes.paper}>
          <form className={'App__signup'}>
            <center>
              <img src={logo} alt={'logo'} />
            </center>

            <Input
              type={'email'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={'Email Address'}
            />
            <Input
              type={'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={'Password'}
            />
            <Button type={'submit'} onClick={handleLogin}>
              Login
            </Button>
          </form>
        </div>
      </Modal>

      {/* Header */}
      <Header
        isLogin={user}
        onSignin={() => setOpenSignIn(true)}
        openSignup={() => setOpen(true)}
        onSignOut={() => auth.signOut()}
      />
      <div className="App__body">
        <div className={'App__bodyLeft'}>
          {/* Post */}
          {posts.map(({ id, post }) => {
            const { username, caption, imgSrc, avatar } = post;
            return (
              <Post
                key={id}
                user={user}
                postId={id}
                username={username}
                caption={caption}
                imgSrc={imgSrc}
                avatar={avatar}
              />
            );
          })}
          {/* image upload */}
          {user?.displayName ? (
            <ImageUpload username={user.displayName} />
          ) : (
            <h4>Login to upload</h4>
          )}
        </div>
        <div className={'App__bodyRight'}>
          <InstagramEmbed
            url={`https://www.instagram.com/p/B_uf9dmAGPw/`}
            clientAccessToken="123|456"
            maxWidth={320}
            hideCaption={false}
            containerTagName="div"
            protocol=""
            injectScript={true}
            onLoading={() => (
              <div className={'App__loading'}>
                <CircularProgress
                  style={{
                    color: 'GrayText',
                    justifySelf: 'center',
                    alignSelf: 'center',
                  }}
                />
              </div>
            )}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
          <h1>Embed from my instagram feed</h1>
        </div>
      </div>
    </div>
  );
  // ) : (
  //   <div className={'App__loading'}>
  //     <CircularProgress
  //       style={{
  //         color: 'GrayText',
  //         justifySelf: 'center',
  //         alignSelf: 'center',
  //       }}
  //     />
  //   </div>
  // );
}

export default App;
