import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import InfoTooltip from './InfoTooltip';

function Login({ handleLogin }) {
  const emailRef = React.useRef('');
  const passwordRef = React.useRef('');
  const [error, setError] = React.useState(false);
  const [messageError, setMessageError] = React.useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(false);
    if (!emailRef.current.value || !passwordRef.current.value) {
      setMessageError('Пожалуйста, введите email и пароль');
      return setError(true);
    }
    const data = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };
    return handleLogin(data, setMessageError, setError);
  };

  return (
    <>
      <Header>
        <Link to="sign-up" className="login__signup login__signup_header">Регистрация</Link>
      </Header>
      <main className="login">
        <section className="login__enter">
          <h2 className="login__title">Вход</h2>
          <form onSubmit={handleSubmit} className="login__form">
            <input ref={emailRef} type="email" placeholder="Email" className="login__input login__input_email" />
            <input ref={passwordRef} type="password" placeholder="Пароль" className="login__input login__input_pswd" />
            <button type="submit" className="login__btn-submit">Войти</button>
            <div className="login__block-signup">
              <p className="login__issue">
                Еще не зарегистрированы?
                <Link to="sign-up" className="login__signup login__signup_form"> Регистрация</Link>
              </p>
            </div>
          </form>
        </section>
        { error && <InfoTooltip success={false} message={messageError} /> }
      </main>
    </>
  );
}

export default Login;