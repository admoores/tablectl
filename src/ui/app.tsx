import * as React from 'react';
import { useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
} from 'react-router-dom';
import Display from './display/display';
import Control from './control/control';

const App = (): JSX.Element => {
  const [testState, setTestState] = useState<number>(0);

  return (
    <>
      <h1>This is the app!!!</h1>
      <h2>{testState}</h2>
      <button
        onClick={(): void => {
          setTestState(testState + 1);
        }}
      >add</button>
      <Router>
        <Link to="/display">Display</Link>
        <Link to="/control">Control</Link>
        <Switch>
          <Route exact path="/display" component={Display} />
          <Route exact path="/control" component={Control} />
        </Switch>
      </Router>
    </>
  );
};

export default App;
