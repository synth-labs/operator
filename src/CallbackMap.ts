type CallbackMap<T> = { [key in keyof T]?: (value: T[key]) => void };

export default CallbackMap;
