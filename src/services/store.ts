import { useEffect } from "preact/hooks";
import { JWT } from "../types/auth";
import { RouterOnChangeArgs } from "preact-router";

type Listener<T extends keyof StoreTypes> = (value?: StoreTypes[T]) => void;

// Please stringify every element
export enum Message {
  NeedAuth = "NeedAuth",
  Notification = "Notification",
  Error = "Error",
  UrlChange = "UrlChange",
}

export enum Stored {
  JWT = "JWT",
  RawJWT = "RawJWT",
  RefreshToken = "RefreshToken",
}

export enum DraggedType {
  Question,
  QuestionGroup,
}

interface StoreTypes {
  readonly [Message.NeedAuth]: string;
  readonly [Message.Notification]: string;
  readonly [Message.Error]: string;
  readonly [Message.UrlChange]: RouterOnChangeArgs;
  readonly [Stored.JWT]: JWT;
  readonly [Stored.RawJWT]: string;
  readonly [Stored.RefreshToken]: string;
}

const PERSISTENT_KEYS = [Stored.JWT, Stored.RawJWT, Stored.RefreshToken];

class Store {
  private listeners: { [key in Stored | Message]?: Array<Listener<any>> };
  public store: { [key in Stored]?: any };

  constructor() {
    this.listeners = {};
    this.store = this.readState();
  }

  public listen<T extends Message | Stored>(type: T, callback: Listener<T>) {
    useEffect(() => {
      this.getListeners(type).push(callback);

      return function cleanup() {
        store.forget(type, callback);
      };
    }, []);
  }

  public forget<T extends Message | Stored>(type: T, callback: Listener<T>) {
    this.listeners[type] = this.getListeners(type).filter(
      (cb) => cb !== callback
    );
  }

  public update<K extends Stored>(key: K, value: StoreTypes[K]) {
    if (value === undefined || value === null) {
      const { [key]: omitted, ...stored } = this.store;
      this.store = stored;
    } else {
      this.store[key] = value;
    }
    if (PERSISTENT_KEYS.includes(key)) this.saveState();
    this.getListeners(key).forEach((listener: Listener<K>) => listener(value));
  }

  public notify<M extends Message>(key: M, data?: StoreTypes[M]) {
    this.getListeners(key).forEach((listener: Listener<M>) => listener(data));
  }

  private getListeners<T extends Message | Stored>(type: T): Listener<T>[] {
    this.listeners[type] = this.listeners[type] || [];
    return (this.listeners[type] as any) as Listener<T>[];
  }

  private readState() {
    try {
      return JSON.parse(localStorage.getItem("state") || "{}") || {};
    } catch (err) {
      console.warn("Cannot read the localStorage state");
      return {};
    }
  }

  private saveState() {
    try {
      const filtered = Object.keys(this.store)
        .filter((key) => PERSISTENT_KEYS.includes(key as Stored))
        .reduce((obj: { [key in Stored]?: any }, key) => {
          obj[key as Stored] = this.store[key as Stored];
          return obj;
        }, {});
      return localStorage.setItem("state", JSON.stringify(filtered));
    } catch (err) {
      console.warn("Cannot read the localStorage state");
      return {};
    }
  }
}

const store = new Store();

export default store;
