import Callback from "./Callback";

type ListenerMap<T> = { [key in keyof T]: Map<string, Callback<T[key]>> };

export default ListenerMap;
