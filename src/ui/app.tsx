import * as React from 'react';
import { useState } from 'react';

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
    </>
  );
};

export default App;
