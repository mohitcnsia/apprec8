The **Context API** in React Native (and React in general) is a state management solution that allows you to share values (like theme, authentication status, user preferences, etc.) between components **without prop drilling**. It provides a way to manage global state efficiently without needing third-party libraries like Redux.

___
 
&nbsp;

# How Context API Works in React Native


It primarily involves three key steps:

## 1. Create a Context
You create a new context using `React.createContext()`.

 ```javascript
    import React, { createContext, useState } from 'react';

    // Creating a Context
    const MyContext = createContext();
```

## 2. Create a Provider Component
The Provider component wraps around the parts of your application that need access to the shared state. It provides the state value to all components inside it.


```javascript
const MyProvider = ({ children }) => {
  const [count, setCount] = useState(0);

  return (
    <MyContext.Provider value={{ count, setCount }}>
      {children}
    </MyContext.Provider>
  );
};
```

## 3. Consume the Context
You can access the context value using the `useContext()` hook in functional components or Context.Consumer in class components.

Using `useContext` (Recommended for functional components)

```javascript
import React, { useContext } from 'react';
import { View, Text, Button } from 'react-native';

const Counter = () => {
  const { count, setCount } = useContext(MyContext);

  return (
    <View>
      <Text>Count: {count}</Text>
      <Button title="Increment" onPress={() => setCount(count + 1)} />
    </View>
  );
};
```

#### Using `Context.Consumer` (For class components)

``` javascript
<MyContext.Consumer>
  {({ count, setCount }) => (
    <View>
      <Text>Count: {count}</Text>
      <Button title="Increment" onPress={() => setCount(count + 1)} />
    </View>
  )}
</MyContext.Consumer>
```

## 4. Wrap Your App with the Provider
To make the context available globally, wrap your application inside the provider component.

```javascript
import React from 'react';
import { SafeAreaView } from 'react-native';

const App = () => {
  return (
    <MyProvider>
      <SafeAreaView>
        <Counter />
      </SafeAreaView>
    </MyProvider>
  );
};

export default App;
```

&nbsp;

&nbsp;

# When to Use Context API?

- When state needs to be shared across multiple components (e.g., authentication state, user preferences, dark mode, language settings).
- When you want to avoid prop drilling (passing props manually through multiple nested components).
- When you need lightweight state management (for simple global state, instead of using Redux or Zustand).

&nbsp;

# When NOT to Use Context API?

- For frequently updating state (e.g., high-frequency state updates like animation frames, real-time data fetching). It may cause unnecessary re-renders.
- For deeply nested components that only need state locally (Consider using props in such cases).

&nbsp;

# Alternatives to Context API

- **Redux** (for complex state management with actions & reducers).
- **Zustand** (simpler alternative to Redux, with a minimal API).
- **Recoil / Jotai** (fine-grained reactivity and better performance for state management).