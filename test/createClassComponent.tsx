import React, { useState, useEffect } from "react";
import { CallbackIdMap, Store } from "../src";

interface IPerson {
  name: string;
  age: number;
  boss?: boolean;
}

function createClassComponent(store: Store<IPerson> & IPerson) {
  class IncrementAge extends React.Component {
    render(): React.ReactNode {
      return (
        <button
          id="incrementButton"
          onClick={() => store.set({ age: store.age + 1 })}
        >
          Increment
        </button>
      );
    }
  }

  class Person extends React.Component<{}, { age: number; name: string }> {
    listenerIds!: CallbackIdMap<IPerson>;

    constructor(props: {}) {
      super(props);

      this.state = {
        name: "",
        age: 0,
      };
    }

    render(): React.ReactNode {
      return (
        <div id="person">
          {this.state.name} - {this.state.age}
        </div>
      );
    }

    componentDidMount() {
      this.listenerIds = store.addListeners({
        age: (value: number) => this.setState({ age: value }),
        name: (value: string) => this.setState({ name: value }),
      });
    }

    componentWillUnmount() {
      store.removeListeners(this.listenerIds);
    }
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

export default createClassComponent;
