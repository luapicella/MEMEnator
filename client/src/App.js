import { useState, useEffect } from 'react';
import { Container, Row, Toast } from 'react-bootstrap/';
import { BrowserRouter as Router, Redirect, Switch, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Navigation from './components/Navigation';
import MemeList from './components/MemeList';
import MemeForm from './components/MemeForm';
import LoginForm from './components/LoginForm';
import LogoutForm from './components/LogoutForm';

import API from './API/API'

const App = () => {

  return (
    <Router>
      <Main></Main>
    </Router>
  );

}

const Main = () => {
  /*auth state*/
  const [loggedIn, setLoggedIn] = useState(false); // at the beginning, no user is logged in
  const [user, setUser] = useState({});
  const [checkAuth, setCheckAuth] = useState(false);

  /*data state*/
  const [memes, setMemes] = useState([]);
  const [images, setImages] = useState([]);
  const [dirty, setDirty] = useState(true);
  const [loading, setLoading] = useState(true);

  /*error msg state*/
  const [message, setMessage] = useState('');

  // check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await API.getUserInfo();
        setUser(user);
        setLoggedIn(true);
      } catch (err) {
        setLoggedIn(false);
        setCheckAuth(true);
      }
    };
    checkAuth()
      .then(() => setCheckAuth(true))
  }, []);


  //get images
  useEffect(() => {
    const getImages = async () => {
      const images = await API.getImages();
      setImages(images);
    };
    if (loggedIn)
      getImages()
      .catch( (err) => {
        err.error = 'Impossible to load images! Please, try again later'
        handleErrors(err)});
  }, [loggedIn]);

  // get memes
  useEffect(() => {
    const getMemes = async () => {
      const memeL = await API.getMemes();
      setMemes(memeL);
    };
    if (loggedIn && dirty)
      getMemes()
        .then(() => {
          setLoading(false);
          setDirty(false)
        })
        .catch( (err) => {
          err.error = 'Impossible to load memes! Please, try again later'
          handleErrors(err)});

  }, [loggedIn, dirty]);

  // show error message in toast
  const handleErrors = (err) => {
    setMessage({ msg: err.error, type: 'danger' });
  }

  //get public memes
  useEffect(() => {
    const getPublicMemes = async () => {
      const memePL = await API.getPublicMemes();
      setMemes(memePL);
    };

    if (!loggedIn && checkAuth && dirty)
      getPublicMemes()
        .then(() => {
          setLoading(false);
          setDirty(false)
        })
        .catch( (err) => {
          err.error = 'Impossible to load public memes! Please, try again later'
          handleErrors(err)});
  }, [loggedIn, checkAuth, dirty]);


  const handleSaveMeme = (meme) => {
    let dirtyMeme = { ...meme }
    dirtyMeme.status = 'warning'
    dirtyMeme.id = 'dirty'
    setMemes((oldMemes) => [...oldMemes, dirtyMeme]);

    API.addMeme(meme)
      .then(() => setDirty(true))
      .catch(err => {
        handleErrors(err)
        setDirty(true);
      })
  }

  const handleDeleteMeme = (memeID) => {
    setMemes((oldMemeList) => {
      return oldMemeList.map(m => {
        if (m.id === memeID)
          return { ...m, status: 'danger' }
        else
          return m;
      })
    });
    API.deleteMeme(memeID)
      .then(() => setDirty(true))
      .catch(err => handleErrors(err))
  }

  const handleLogIn = async (credentials) => {
    const user = await API.logIn(credentials);
    setLoggedIn(true);
    setDirty(true);
    setLoading(true);
    setUser(user);
  }

  const handleLogOut = async () => {
    await API.logOut()
    // clean up everything
    setLoggedIn(false);
    setDirty(true);
    setLoading(true);
    setUser({});
  }

  const memeListProps = {
    /*meme information*/
    memes: memes,
    loading: loading,

    /*auth information*/
    loggedIn: loggedIn,
    user: user,
    checkAuth: checkAuth,

    /*meme operation*/
    onDelete: handleDeleteMeme,
  }

  const memeFormProps = {
    /*images information*/
    images: images,

    /*save meme operation*/
    onSave: handleSaveMeme,
  }


  return (
    <>
      <Container fluid>
        <Row>
          <Navigation onLogOut={''} loggedIn={loggedIn} user={user} />
        </Row>

        <Toast role='alert' className='below-nav' show={message !== ''} onClose={() => setMessage('')} delay={3000} autohide>
          <Toast.Body>{message?.msg}</Toast.Body>
        </Toast>

        <Switch>


          <Route exact path="/login" render={() =>
            <>
              {
                loggedIn
                  ? <Redirect to="/home" />
                  : <LoginForm login={handleLogIn} />
              }
            </>
          } />


          <Route exact path="/logout" render={() =>
            <>
              {
                loggedIn
                  ? <LogoutForm logout={handleLogOut} />
                  : <Redirect to="/home" />
              }
            </>
          } />


          <Route exact path="/home" render={() =>
            <MemeList {...memeListProps} />
          } />

          <Route exact path="/create" render={() =>
            <>
              {
                loggedIn
                  ? <MemeForm {...memeFormProps} />
                  : (checkAuth ? <Redirect to="/login" /> : '')
              }
            </>
          } />


          <Route path="/*" render={() =>
            <Redirect to="/home" />
          } />


        </Switch>

      </Container>
    </>
  );
}



export default App;
