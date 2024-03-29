import { Debouncer, nop, timeOut } from "@uxland/uxl-utilities";
import { LitElement } from "lit";
import { filter, hasIn, map, pipe, propEq, reject, uniq, values } from "ramda";
import { Store, Unsubscribe } from "redux";
import { PropertyWatch } from "./connect";
import { getWatchedProperties } from "./watched-redux-property";

const mapWatches = (watchesMap: { [key: string]: PropertyWatch }) =>
  values(watchesMap);
const getWatchesByStore: (
  store: Store
) => (watches: PropertyWatch[]) => PropertyWatch[] = (store) =>
  filter<PropertyWatch>(propEq("store", store));

interface PropertyState {
  name: string;
  current: any;
  old?: any;
}

const getProperties = (state: any, litElement) =>
  map<PropertyWatch, PropertyState>((x) => ({
    name: x.name,
    old: litElement[x.name],
    current: x.selector.call(litElement, state),
  }));
const isDomElement = hasIn("tagName");
const rejectUnchanged: (changes: PropertyState[]) => PropertyState[] =
  reject<PropertyState>((x) => x.old === x.current);
const updateProperties = (element: LitElement) =>
  map<PropertyState, void>((change) => {
    element[change.name] = change.current;
    if (element.requestUpdate && !isDomElement(element))
      element.requestUpdate(change.name, change.old);
  });
const getStoreWatches = (element: LitElement) => (store: Store<any, any>) =>
  pipe(getWatchedProperties, mapWatches, getWatchesByStore(store))(element);
const listen = (element: LitElement, store: Store) => {
  const watches = getStoreWatches(element)(store);
  let debounceJob = null;
  const update = () =>
    pipe(
      getProperties(store.getState(), element),
      rejectUnchanged,
      updateProperties(element),
      nop
    )(watches);
  return () => Debouncer.debounce(debounceJob, timeOut.after(16), update);
};
const listener = (element: LitElement) => (store: Store) =>
  store.subscribe(listen(element, store));

const getAllStores = (watches: { [key: string]: PropertyWatch }) =>
  uniq(map((x) => x.store, values(watches)));

const subscribe = (element: LitElement) =>
  map<Store, Unsubscribe>(listener(element));

const storeSubscriptions =
  (element: LitElement) => (subscriptions: Unsubscribe[]) =>
    Object.defineProperty(element, "__reduxStoreSubscriptions__", {
      get(): Unsubscribe[] {
        return subscriptions;
      },
      configurable: true,
      enumerable: true,
    });
const initializeValues =
  (element: LitElement) => (stores: Store<any, any>[]) => {
    const storeWatches = map(getStoreWatches(element), stores);
    storeWatches.forEach((value) => {
      value.forEach(
        (x) => (element[x.name] = x.selector.call(element, x.store.getState()))
      );
    });
    return stores;
  };
export const bind: (element: LitElement) => void = (element) =>
  pipe(
    getWatchedProperties,
    getAllStores,
    initializeValues(element),
    subscribe(element),
    storeSubscriptions(element),
    nop
  )(element);
export default bind;
