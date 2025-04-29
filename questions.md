## Questions

### 1. What is the difference between Component and PureComponent? Give an example where it might break my app.

The main difference is Component re-renders when the parent re-renders or when its props or state changes.

Pure Component extends `React.Component` or is created my wrapping a functional React Component in `React.Memo`. And it only re-renders when its own state or prop changes.

Since the comparison between state or props is shallow, having a nested object as a prop might break the app since it does not detect nested changes in a shallow comparison.

### 2. Context + ShouldComponentUpdate might be dangerous. Why is that?

`shouldComponentUpdate` checks a component's state and props for updates but not the state in the Context, and if the Context state changes are not being picked up by `shouldComponentUpdate`, it could lead to bugs.

### 3. Describe 3 ways to pass information from a component to its PARENT.

Pass a callback function as a prop to the child and have the child call it with its own data.

Using the Context API, and have the child update the state in the context, which the parent can pick up.

Creating a state and a setState function within the parent, and passing both the state and setState function to the child as props, allowing the child to update and use the parent state.

### 4. Give 2 ways to prevent components from re-rendering.

Wrapping a component's variables in useMemo, which allow re-renders only when items in the dependency array changes, and using useCallback on the component's methods to achieve the same thing.

Wrapping functional components in React.Memo which only allow re-renders when the component's props or state changes.

### 5. What is a fragment and why do we need it? Give an example where it might break my app.

A Fragment - `<>...</>` or `<React.Fragment />`, allows you to group multiple elements or components together without adding an extra node.

Fragments can be used when we don't want to add unneccesary DOM nodes, or when we want to group related elements or components together.

But since fragments aren't DOM nodes, we can't attach event handlers or apply CSS styling to them and trying to do these might break an app.

Another example is trying apply a key prop to the shorthand fragment sytanx - `<key='x'>...</>` would cause errors.

### 6. Give 3 examples of the HOC pattern.

Higher Order Functions are functions that take a component as an argument and return an enhanced component. Adding more props or methods to it.

An example might be an authentication HOC, can be used to verify authentication and redirect accordingly.

HOC can be used for data fetching and logging operations too.

Some common examples of HOC are `withRouter` used to pass react-router props like `history` and `match` to a component

`connect` in Redux, used to inject `dispatch` method and redux `state` to a component. 

And `withTheme` from material-ui, used to give a component access to a theme's styles and variables.

### 7. What's the difference in handling exceptions in promises, callbacks and async...await?

In promises, we attach a `.catch()` block to the promise, the `catch` block takes a function as an argument, this function is called when the promise gets an error. We can also wrap the promise in a `try...catch` block which does the same thing, with the error being handled in the `catch` block if we don't attach `.catch()`.

In callbacks error handling, a callback function is used which takes two arguments, an error object is the first argument and a success response is the second. We check the error, if it's not empty, we handle it in an `if..condition` block.

Async/Await is syntatic sugar code built on top the `try...catch` block to give it a more synchronous look. When an error occurs in the `await` async function, the error is thrown, and caught in the catch block.

```js
try {
  const res = await fetchFn()
} catch (err) {
  // error from fetchFn is caught and handled here
}
```

### 8. How many arguments does setState take and why is it async.

`setState` takes two argument, the first is an object or function used to set the state - `{ pet: 'dog' }` and the second is an optional callback that gets called once the state is updated.

It is async in order to batch state updates, and this increases performance, since a component re-renders when its state changes. Setting the state synchronously on every update would lead to frequent re-rendering which could take a toll on performance.

### 9. List the steps needed to migrate a Class to Function Component.

Convert the class declaration to a function declaration

```jsx

class Example extends React.Compnent {}

// changes to 

const Example = () => {}
```

Change how you setState from `this.setState` to using the `useState` hook

Convert the component lifecycle methods to use `useEffect` hook with dependency array

Remove all uses of `this` keyword and access props and state directly

Remove `render()` method and just return all its content in the functional component

```jsx
  ...
  render() {
    return <div />
  }

  // changes to

  ...
  return <div />
```

Convert all other class methods to functional methods within the component

### 10. List a few ways styles can be used with components.

The quickest way is inline styles using the style prop

```jsx
  <div style={{ /** add styling */ }}>
```

Using CSS modules, and CSS `.module.css` files. These are a bit more performant than inline styles and allow CSS class scoping. The CSS class names are only available in files they are imported into, and do not leak into the global space.

Using CSS-in-JS libraries which allow CSS to be written in Javascript files. Material-UI is an example of this, and it allows CSS-in-JS theme, or using the `sx` prop value to style a component.

### 11. How to render an HTML string coming from the server.

The first step is to santize the HTML string to prevent injection or cross-scripting attacks.

And once the HTML is santized, we can insert a raw HTML string to a component using the `dangerouslySetInnerHTML` prop to set the HTML. The dangerous in the name is a reminder that without proper sanitization, an app can be vulnerable to attacks.