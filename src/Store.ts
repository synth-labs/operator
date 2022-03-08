import { v4 } from "uuid";

import Callback from "./Callback";
import CallbackMap from "./CallbackMap";
import CallbackIdMap from "./CallbackIdMap";
import ListenerMap from "./ListenerMap";

class Store<T> {
  private data: T;
  private listeners: ListenerMap<T>;

  protected constructor(data: T) {
    this.data = data;

    const l: Partial<ListenerMap<T>> = {};
    Object.keys(this.data).forEach((field: string): void => {
      l[field as keyof T] = new Map();
    });

    this.listeners = l as ListenerMap<T>;

    Object.keys(this.data).forEach((field: string) => {
      Object.defineProperty(this, field, {
        get: () => this.data[field as keyof T],
      });
    });
  }

  static make<T>(base: T) {
    return new Store<T>(base) as Store<T> & T;
  }

  set(values: Partial<T>) {
    Object.entries(values).forEach(([k, v]: [string, any]) => {
      this.data[k as keyof T] = v;
    });

    this.notify(Object.keys(values) as (keyof T)[]);
  }

  private notify(fields: (keyof T)[]): void {
    for (const field of fields) {
      const m = this.listeners[field];
      if (m !== undefined) {
        m.forEach((value: Callback<any>, key: string): void => {
          value(this.data[field]);
        });
      }
    }
  }

  addListeners(listeners: CallbackMap<T>): CallbackIdMap<T> {
    const listenerIds: Record<string, string> = {};
    Object.entries(listeners).forEach(([field, listener]): void => {
      const key: string = `${Math.random()}${Math.random()}`;
      listenerIds[field] = key;

      let m = this.listeners[field as keyof T];
      if (m === undefined) {
        this.listeners[field as keyof T] = new Map<string, Callback<any>>();
        m = this.listeners[field as keyof T];
      }

      m?.set(key, listener as Callback<any>);

      (listener as Callback<any>)(this.data[field as keyof T]);
    });

    return listenerIds as CallbackIdMap<T>;
  }

  removeListeners(listeners: CallbackIdMap<T>) {
    Object.entries(listeners).forEach(([field, listenerId]): void => {
      this.listeners[field as keyof T].delete(listenerId as string);
    });
  }
}

export default Store;
