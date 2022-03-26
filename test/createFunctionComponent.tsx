import React, { useState, useEffect } from "react";
import { Store } from "../src";

interface IPerson {
  name: string;
  age: number;
  boss?: boolean;
}

function createComponent(store: Store<IPerson> & IPerson) {
  function IncrementAge() {
    return (
      <button
        id="incrementButton"
        onClick={() => store.set({ age: store.age + 1 })}
      >
        Increment
      </button>
    );
  }
  function Person() {
    const [age, setAge] = useState(0);
    const [name, setName] = useState("");

    useEffect(() => {
      let listenerIds = store.addListeners({
        age: setAge,
        name: setName,
      });

      return () => {
        store.removeListeners(listenerIds);
      };
    }, []);

    return (
      <div id="person">
        {name} - {age}
      </div>
    );
  }

  return function App() {
    return (
      <div>
        <Person />
        <IncrementAge />
      </div>
    );
  };
}

export default createComponent;
