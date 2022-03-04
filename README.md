# Operator

Operator is a simple, type-safe state management library, inspired by the observable pattern.

The name comes from the movie Matrix where the operators are crew members on the hovercraft who send information and resources to those connected to the Matrix. Similarly this library sends informations about the state changes to the different software component.

## Installation

The package is available on NPM, you can install it either with npm or yarn:

```
npm install @synth-labs/operator
```

```
yarn add @synth-labs/operator
```

## Usage

### Creating the state

Create an interface describing your state:

```typescript
interface Person {
  name: string;
  age: number;
  boss: boolean;
}
```

Instantiate the store by providing the default values:

```typescript
const person = Store.make<Person>({
  name: "John",
  age: 25,
  boss: false,
});
```

Finally export this `person` object and import where you need to access or manipulate the state.

### Retrieving field

The library provides type safe, auto generated getters on the object, based on the provided interface. You can access any field directly like this:

```typescript
console.log(`${person.name} is ${person.age} years old`);
```

### Setting values

You can change the value of one or multiple fields by using the `set(data: Partial<T>)` method on the object. For example here we change the field `age` and `boss`, but not the `name`:

```typescript
person.set({ age: 30, boss: true });
```

### Subscribing for changes

Changes can happen anytime, especially if the store is used by multiple function, modules, components, etc.
If you don't want to miss any change, you can subscribe to the changes:

```typescript
const listenerIds = person.addListeners({
  age: (value: number) => console.log(`New age is ${value}.`),
  name: (value: string) => console.log(`New name is ${value}.`),
});
```

The `addListener` method returns an object containing a subscription ID for every field we subscribed for.

### Unsubscribing from changes

If you don't want to keep listening for the changes, you can unsubsribe from them. For this simply pass an object containing the fields and subscription IDs. For example here we unsubscribe from everything we subscriber for earlier:

```typescript
person.removeListeners(listenerIds);
```

## Using with React

Changing the values in the store is pretty easy:

```typescript
import person from ".sometPath/store/person";

export default function IncrementAge() {
  return (
    <button onClick={() => person.set({ age: person.age + 1 })}>
      Increment
    </button>
  );
}
```

To use the fields of the store in your React component and keep everything reactive, we recommend to sync your global state to your local state:

```typescript
import { useState, useEffect } from "react";
import person from ".sometPath/store/person";

export default function Person() {
  const [age, setAge] = useState(0);
  const [name, setName] = useState("");

  useEffect(() => {
    let listenerIds = person.addListeners({
      age: setAge,
      name: setName,
    });

    return () => {
      person.removeListeners(listenerIds);
    };
  }, []);

  return (
    <div>
      {name} - {age}
    </div>
  );
}
```

Don't worry too much about the initial values of the local state, since they get synced up to the global state at the subscription, even if there are no new changes.

We can achieve the same thing by using class components as well:

```typescript
import React from "react";
import person from ".sometPath/store/person";
import { CallbackIdMap } from "@synth-labs/operator";

interface PersonState {
  name: string;
  age: number;
}

class Person extends React.Component<{}, PersonState> {
  listenerIds!: CallbackIdMap<PersonState>;

  constructor(props: {}) {
    super(props);

    this.state = {
      name: "",
      age: 0,
    };
  }

  render(): React.ReactNode {
    return (
      <div>
        {this.state.name} - {this.state.age}
      </div>
    );
  }

  componentDidMount() {
    this.listenerIds = person.addListeners({
      name: (value: string) => this.setState({ name: value }),
      age: (value: number) => this.setState({ age: value }),
    });
  }

  componentWillUnmount() {
    person.removeListeners(this.listenerIds);
  }
}

export default Person;
```

## Plans

- custom hook for easier use with functional components
- custom decorator for easier use with functional components
- support for custom set function (e.g increment)
- better support for complex state
  - selector functions
  - subscribe to fields of fields
