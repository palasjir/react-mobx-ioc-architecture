import { PropsWithChildren, useContext } from "react";
import {
  QueryClient,
  QueryClientProvider as TanStackQueryClientProvider
} from "@tanstack/react-query";
import { provider, toValue } from "react-ioc";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity
    }
  }
});

export const QueryClientProvider = provider([
  QueryClient,
  toValue(queryClient)
])((props: PropsWithChildren<{}>) => (
  <TanStackQueryClientProvider client={queryClient} {...props} />
));
