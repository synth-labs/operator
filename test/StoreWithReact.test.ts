import { expect } from "chai";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";

import { Store } from "../src/index";
import createFunctionComponent from "./createFunctionComponent";
import createClassComponent from "./createClassComponent";
import Person from "./Person";
import React from "react";

let rootContainer: HTMLDivElement | null;

let person: Store<Person> & Person;
const defaultName: string = "John";
const defaultAge: number = 23;

beforeEach(() => {
  rootContainer = document.createElement("div");
  document.body.appendChild(rootContainer);

  person = Store.make<Person>({
    name: defaultName,
    age: defaultAge,
    boss: undefined,
  });
});

afterEach(() => {
  document.body.removeChild(rootContainer as HTMLDivElement);
  rootContainer = null;
});

describe("StoreWithReact", function () {
  describe("functional components", function () {
    it("should sync the state initially", function () {
      const App = createFunctionComponent(person);

      act(() => {
        ReactDOM.render(App(), rootContainer);
      });
      const div = document.getElementById("person");
      expect(div?.textContent).to.equal(`${defaultName} - ${defaultAge}`);
    });

    it("should sync the state after the global state changed", function () {
      const App = createFunctionComponent(person);

      act(() => {
        ReactDOM.render(App(), rootContainer);
      });

      person.set({ name: "Tim", age: 42 });

      const div = document.getElementById("person");
      expect(div?.textContent).to.equal("Tim - 42");
    });

    it("should trigger the state change and sync the state after", function () {
      const App = createFunctionComponent(person);

      act(() => {
        ReactDOM.render(App(), rootContainer);
      });

      const button = document.getElementById("incrementButton");
      button?.click();

      const div = document.getElementById("person");
      expect(div?.textContent).to.equal(`${defaultName} - ${defaultAge + 1}`);
    });
  });

  describe("class components", function () {
    it("should sync the state initially", function () {
      const App = createClassComponent(person);

      act(() => {
        ReactDOM.render(App(), rootContainer);
      });
      const div = document.getElementById("person");
      expect(div?.textContent).to.equal(`${defaultName} - ${defaultAge}`);
    });

    it("should sync the state after the global state changed", function () {
      const App = createClassComponent(person);

      act(() => {
        ReactDOM.render(App(), rootContainer);
      });

      person.set({ name: "Tim", age: 42 });

      const div = document.getElementById("person");
      expect(div?.textContent).to.equal("Tim - 42");
    });

    it("should trigger the state change and sync the state after", function () {
      const App = createClassComponent(person);

      act(() => {
        ReactDOM.render(App(), rootContainer);
      });

      const button = document.getElementById("incrementButton");
      button?.click();

      const div = document.getElementById("person");
      expect(div?.textContent).to.equal(`${defaultName} - ${defaultAge + 1}`);
    });
  });
});
