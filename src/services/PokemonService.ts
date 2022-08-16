import { QueryClient, QueryObserver } from "@tanstack/react-query";
import { inject } from "react-ioc";
import {
  createObservableQuery,
  IQueryResource
} from "../mobx/createObservableQuery";
import { IPokemonViewData } from "../types";

interface IApiPokemon {
  name: string;
  weight: number;
}

export class ObservablePokemonQuery {
  name: string;
  readonly observer: QueryObserver<IApiPokemon>;
  readonly resource: IQueryResource<IApiPokemon>;

  constructor(queryClient: QueryClient, name: string) {
    this.name = name;
    this.observer = new QueryObserver<IApiPokemon>(
      queryClient,
      this.getQueryOptions()
    );
    this.resource = createObservableQuery<IApiPokemon>(this.observer);
  }

  private getQueryKey() {
    return ["pokemon", this.name];
  }

  private getQueryFn() {
    const url = `https://pokeapi.co/api/v2/pokemon/${this.name}`;
    return () =>
      fetch(url).then((res) => {
        return res ? res.json() : undefined;
      });
  }

  private getQueryOptions() {
    return {
      queryKey: this.getQueryKey(),
      queryFn: this.getQueryFn(),
      enabled: Boolean(this.name.length)
    };
  }

  setName = (name: string) => {
    this.name = name;
    this.observer.setOptions(this.getQueryOptions());
  };

  get current() {
    return this.resource.current();
  }
}

export abstract class IPokemonService {
  getPokemonQuery(name: string): ObservablePokemonQuery {
    throw new Error("not implemented");
  }
  async updatePokemon(pokemonData: IPokemonViewData): Promise<void> {
    throw new Error("not implemented");
  }
}

/**
 * Service responsible for comunication with the API.
 */
export class PokemonService extends IPokemonService {
  private queryClient: QueryClient;

  constructor(queryClient?: QueryClient) {
    super();
    this.queryClient = queryClient || inject(this, QueryClient);
  }

  getPokemonQuery(name: string): ObservablePokemonQuery {
    return new ObservablePokemonQuery(this.queryClient, name);
  }

  // question is what this method would take as an input, it should rather be API compatible data then
  // view compatible data, but also depends on some usecases.
  async updatePokemon(pokemonData: IPokemonViewData) {
    return window.fetch({ method: "POST", url: "" }); // not fully implemented
  }
}
