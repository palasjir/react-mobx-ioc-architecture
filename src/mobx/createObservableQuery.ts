import { QueryObserver, QueryObserverResult } from "@tanstack/react-query";
import { fromResource, IResource } from "mobx-utils";

export type IQueryResource<T> = IResource<QueryObserverResult<T> | undefined>;

export function createObservableQuery<T>(
  observable: QueryObserver<T>
): IQueryResource<T> {
  let unsubscribe: () => void | undefined;

  return fromResource<QueryObserverResult<T>>(
    (sink) => {
      // sink the current state
      const result = observable.getCurrentResult();
      sink(result);
      // subscribe to the record, invoke the sink callback whenever new data arrives
      unsubscribe = observable.subscribe((value) => {
        sink(value);
      });
    },
    () => {
      // the user observable is not in use at the moment, unsubscribe (for now)
      unsubscribe?.();
    }
  );
}
