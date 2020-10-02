import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const ProtectedRoute = ({ Component, loggedIn }) => {
  return (
    <Route>
      {
          () => { return (loggedIn ? Component : <Redirect to="/sign-in" />); }
      }
    </Route>
  );
};

export default ProtectedRoute;