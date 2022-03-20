import { expect } from "chai";
import { Store } from "../src/index";

describe("@synthesis-labs/operator", function () {
  describe("Store", function () {
    describe(".make()", function () {
      it("should not throw", function () {
        interface Person {
          name: string;
          age: number;
          boss?: boolean;
        }

        expect(() => {
          const person = Store.make<Person>({
            name: "John",
            age: 23,
          });
        }).not.to.throw();
      });

      it("should have the defined fields", function () {
        interface Person {
          name: string;
          age: number;
          boss?: boolean;
        }

        const person = Store.make<Person>({
          name: "John",
          age: 23,
          boss: undefined,
        });

        expect(person).to.haveOwnProperty("name", "John");
        expect(person).to.haveOwnProperty("age", 23);
        expect(person).to.haveOwnProperty("boss", undefined);
      });
    });

    describe("#addListeners()", function () {
      it("should return subscription IDs for every field", function () {
        interface Person {
          name: string;
          age: number;
          boss?: boolean;
        }

        const person = Store.make<Person>({
          name: "John",
          age: 23,
          boss: undefined,
        });

        const subscriptionIds = person.addListeners({
          name: (value: string) => {},
          age: (value: number) => {},
        });

        expect(subscriptionIds).to.have.property("name");
        expect(subscriptionIds).to.have.property("age");
        expect(subscriptionIds).to.not.have.property("boss");
      });

      it("should receive updates on the subscribed fields", function () {
        interface Person {
          name: string;
          age: number;
          boss?: boolean;
        }

        let localName: string = "John";
        let localAge: number = 23;

        const person = Store.make<Person>({
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
        interface Person {
          name: string;
          age: number;
          boss?: boolean;
        }

        let localName: string = "John";
        let localAge: number = 23;

        const person = Store.make<Person>({
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
});
