import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';

function PageNotFound() {
  return (
    <>
      <Header>
        <Link to="sign-in" className="login__signup login__signup_header">На главную</Link>
      </Header>
      <section className="not-found">
        <p className="not-found__error">404</p>
        <h2 className="not-found__title">Кажется страница не найдена. Проверьте введенный вами адрес.</h2>
      </section>
    </>
  );
}

export default PageNotFound;