import { expect } from "chai";
import { Store } from "../src/index";
import Person from "./Person";

let person: Store<Person> & Person;
const defaultName: string = "John";
const defaultAge: number = 23;

beforeEach(() => {
  person = Store.make<Person>({
    name: defaultName,
    age: defaultAge,
    boss: undefined,
  });
});

describe("Store", function () {
  describe(".make()", function () {
    it("should have the defined fields", function () {
      expect(person).to.haveOwnProperty("name", "John");
      expect(person).to.haveOwnProperty("age", 23);
      expect(person).to.haveOwnProperty("boss", undefined);
    });
  });

  describe("#addListeners()", function () {
    it("should return subscription IDs for every field", function () {
      const subscriptionIds = person.addListeners({
        name: (value: string) => {},
        age: (value: number) => {},
      });

      expect(subscriptionIds).to.have.property("name");
      expect(subscriptionIds).to.have.property("age");
      expect(subscriptionIds).to.not.have.property("boss");
    });

    it("should receive updates on the subscribed fields", function () {
      let localName: string = "John";
      let localAge: number = 23;

      person = Store.make<Person>({
        name: localName,
        age: localAge,
        boss: undefined,
      });

      person.addListeners({
        name: (value: string) => (localName = value),
        age: (value: number) => (localAge = value),
      });

      person.set({ name: "Joe" });

      expect(localName).to.be.equal("Joe");
      expect(localAge).to.be.equal(23);

      person.set({ name: "Tim", age: 42 });

      expect(localName).to.be.equal("Tim");
      expect(localAge).to.be.equal(42);
    });
  });

  describe("#removeListeners()", function () {
    it("should not receive updates after unsubscribe", function () {
      let localName: string = "John";
      let localAge: number = 23;

      person = Store.make<Person>({
        name: localName,
        age: localAge,
        boss: undefined,
      });

      const listenerIds = person.addListeners({
        name: (value: string) => (localName = value),
        age: (value: number) => (localAge = value),
      });

      person.removeListeners(listenerIds);

      person.set({ name: "Joe" });

      expect(localName).to.be.equal("John");
      expect(localAge).to.be.equal(23);

      person.set({ name: "Tim", age: 42 });

      expect(localName).to.be.equal("John");
      expect(localAge).to.be.equal(23);
    });
  });
});
