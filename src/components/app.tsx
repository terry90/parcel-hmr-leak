import { h } from "preact";
import { Route, Router, RouterOnChangeArgs } from "preact-router";
import Home from "../routes/home";
import Profile from "../routes/profile";
import NotFoundPage from "../routes/notfound";
import Header from "./header";
import store, { Message, Stored } from "../services/store";
import { useState } from "preact/hooks";
import { LoginPage } from "../routes/login";

const App = () => {
  const [jwt, setJwt] = useState<Stored.JWT | null>(null);

  const handleRoute = (e: RouterOnChangeArgs) => {
    store.notify(Message.UrlChange, e);
  };

  store.listen(Stored.JWT, setJwt as any);

  if (!jwt) {
    return <LoginPage />;
  }

  return (
    <div id="app">
      <Header />
      <Router onChange={handleRoute}>
        <Route path="/" component={Home} />
        <Route path="/profile/" component={Profile} user="me" />
        <Route path="/profile/:user" component={Profile} />
        <NotFoundPage default />
      </Router>
    </div>
  );
};

export default App;
