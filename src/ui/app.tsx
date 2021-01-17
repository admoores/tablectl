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
      <Router>
        <Switch>
          <Route exact path="/view" component={Display} />
          <Route exact path="/edit" component={Control} />
        </Switch>
      </Router>
    </>
  );
};

export default App;
