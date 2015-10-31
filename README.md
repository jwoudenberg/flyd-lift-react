# Lift React Component
[![Build status](https://img.shields.io/travis/jwoudenberg/flyd-lift-react/master.svg?style=flat-square)](https://travis-ci.org/jwoudenberg/flyd-lift-react)

A higher order [React](http://facebook.github.io) component for use with [flyd](https://github.com/paldepind/flyd).

Combining React and flyd for an [elm](http://elm-lang.org/)-like architecture couldn't be easier.
Just look at this example:

```jsx
// Write an ordinary React component that takes some props:
const Counter = (value, increment) => (
    <div onClick={increment}>
        {value}
    </div>
);

// Lift it
import Lift from 'flyd-lift-react';
const LiftedCounter = Lift(Counter);

// Use it
import { stream } from 'flyd';
const clicks = stream();
const value = stream([clicks], self => self(self() + 1));

import { render } from 'react-dom';
render(
    <LiftedCounter value={value} increment={e => clicks(e)} />,
    document.body
);
```

`Lift` is a higher order React component.
- Pass a mix of streams an ordinary values as props to your lifted component.
- The component being lifted will only receive normal values as props.
- If a stream updates, so so will the lifted ocomponent.
