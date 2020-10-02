import React from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import api from '../utils/api'
import * as auth from '../utils/auth';
import '../index.css';
import Header from './Header.js';
import Main from './Main.js';
import Footer from './Footer.js';
import PopupWithForm from './PopupWithForm';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup'
import ImagePopup from './ImagePopup.js';
import DeletePopup from './DeletePopup';
import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute';
import InfoTooltip from './InfoTooltip';
import PageNotFound from './PageNotFound';

import CurrentUserContext from '../contexts/CurrentUserContext';

function App() {
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [infoLoginUser, setInfoLoginUser] = React.useState('');
  const [registerSuccess, setRegisterSuccess] = React.useState(false);
  const history = useHistory();
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [isPopupProfileOpen, setIsPopupProfileOpen] = React.useState(false);
  const [isPopupAddPlaceOpen, setIsPopupAddPlaceOpen] = React.useState(false);
  const [isPopupAvatarEditOpen, setIsPopupAvatarEditOpen] = React.useState(false);
  const [isPopupCardDeleteOpen, setIsPopupCardDeleteOpen] = React.useState({ card: {}, isOpen: false });
  const [selectedCard, setSelectedCard] = React.useState({ card: {}, isOpen: false });

function handleError (error) {
  console.error(error);
}

React.useEffect(() => {
  Promise.all([api.getUserInfo(), api.getInitialCards()])
    .then(([user, initialCards]) => {
      setCurrentUser(user)
      setCards(initialCards)
    })
    .catch(handleError)
  }, []);

function handleEditProfileClick() {
  setIsPopupProfileOpen(true);
}

function handleAddPlaceClick() {
  setIsPopupAddPlaceOpen(true);
}

function handleEditAvatarClick() {
  setIsPopupAvatarEditOpen(true);
}

function handleCardClick(card) {
  setSelectedCard({ card, isOpen: true });
}

function closeAllPopups() {
  setIsPopupProfileOpen(false);
  setIsPopupAddPlaceOpen(false);
  setIsPopupAvatarEditOpen(false);
  setIsPopupCardDeleteOpen({ card: {}, isOpen: false });
  setSelectedCard({ ...selectedCard, isOpen: false })
}

function handleSetCards (updatedCards) {
  setCards(updatedCards);
}

function handleUpdateUser ({ name, about }) {
  api.setUserInfo({ name, about })
    .then(() => {
      setCurrentUser({ ...currentUser, name, about });
      setIsPopupProfileOpen(false);
    })
    .catch(handleError)
}

function handleUpdateAvatar ({ avatar }) {
  api.changeAvatar(avatar)
    .then(() => {
      setCurrentUser({ ...currentUser, avatar });
      setIsPopupAvatarEditOpen(false);
    })
    .catch(handleError)
}

function handleCardLike (card) {
  const isLiked = card.likes.some(i => i._id === currentUser._id);
  function handleResponseCardLike (newCard) {
    const newCards = cards.map((c) => c._id === card._id ? newCard : c);
    setCards(newCards);
  }

  if (!isLiked) {
    api.setLike(card._id)
      .then(handleResponseCardLike)
      .catch(handleError)
  } else {
    api.deleteLike(card._id)
      .then(handleResponseCardLike)
      .catch(handleError)
  }
}

function handleRequestDelete (card) {
  setIsPopupCardDeleteOpen({ card, isOpen: true })
}

function handleCardDelete (card) {
  api.deleteCard(card._id)
    .then(() => {
      const newCards = cards.filter(el => el._id !== card._id);
      setCards(newCards);
      setIsPopupCardDeleteOpen({ card: {}, isOpen: false });
    })
    .catch(handleError)
}

function handleAddPlaceSubmit ({ name, link }) { 
  api.setCard({ name, link })
    .then((newCard) => {
      setCards([newCard, ...cards]);
      setIsPopupAddPlaceOpen(false);
    })
    .catch(handleError)
}

function handleEscClose(evt) {
  if (evt.key === 'Escape') {
    closeAllPopups();
  }
}

function handleOverlayClose(evt) {
  if (evt.target.classList.contains('popup')) {
    closeAllPopups();
  }
}

React.useEffect(() => {
  window.addEventListener('keydown', handleEscClose);
  window.addEventListener('mousedown', handleOverlayClose);

  return () => {
    window.removeEventListener('keydown', handleEscClose);
    window.removeEventListener('mousedown', handleOverlayClose);
  };
})

const handleCheckToken = () => {
  const token = localStorage.getItem('token');
  if (token) {
    auth.getInfoLogin(token).then((getInfo) => {
      setLoggedIn(true);
      history.push('/my-profile');
      return setInfoLoginUser(getInfo);
    });
  }
};

React.useEffect(() => {
  handleCheckToken();
  Promise.all([api.getInfoUser(), api.getInitialCards()]).then(([userData, cardsFromApi]) => {
    setCurrentUser(userData);
    setCards(cardsFromApi);
  }).catch((err) => {
    return console.log(err);
  });
}, []);

const handleLogin = (data, setMessageError, setError) => {
  auth.authorize(data).then((res) => {
    if (!res.token) {
      setMessageError(res.message || res.error);
      return setError(true);
    }
    return auth.getInfoLogin(res.token).then((getInfo) => {
      setLoggedIn(true);
      history.push('/my-profile');
      return setInfoLoginUser(getInfo);
    });
  }).catch((err) => {
    setError(true);
    return console.log(err);
  });
};

const handleRegister = (data, setMessageError, setError) => {
  auth.register(data).then((res) => {
    if (res.data) {
      setLoggedIn(true);
      history.push('/my-profile');
      setInfoLoginUser(res.data);
      return setRegisterSuccess(true);
    }
    setMessageError(res.error || res.message);
    return setError(true);
  });
};

const signOut = () => {
  localStorage.removeItem('token');
  history.push('/sign-in');
  setRegisterSuccess(false);
};

const toggleBurgerMenu = () => {
  const btn = document.querySelector('.burger-menu');
  const header = document.querySelector('.header');
  btn.classList.toggle('burger-menu_active');
  header.classList.toggle('header_burger-menu');
};

return (
  <div className="App">
    <div className="body">
    <div className="page">
      <CurrentUserContext.Provider value={currentUser}>
        <Header/>

        <Main
          onEditProfile={handleEditProfileClick} 
          onAddPlace={handleAddPlaceClick}
          onEditAvatar={handleEditAvatarClick}
          onCardClick={handleCardClick}
          onSetCards={handleSetCards}
          onCardLike={handleCardLike}
          onCardDelete={handleRequestDelete}
          cards={cards}
        />
        <Footer />

        <EditAvatarPopup
          isOpen={isPopupAvatarEditOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />

        <EditProfilePopup
          isOpen={isPopupProfileOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />

        <AddPlacePopup
          isOpen={isPopupAddPlaceOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />

        <ImagePopup
          card={selectedCard.card}
          isOpen={selectedCard.isOpen}
          onClose={closeAllPopups}
        />

        <DeletePopup
          card={isPopupCardDeleteOpen.card}
          isOpen={isPopupCardDeleteOpen.isOpen}
          onClose={closeAllPopups}
          onDelete={handleCardDelete}
        />
      </CurrentUserContext.Provider>
    </div>
  </div>  
  </div>
);
}          

export default App;