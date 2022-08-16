import "./styles.css";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react";
import { provider, useInstance, inject } from "react-ioc";
import { QueryClientProvider } from "./providers/QueryClientProvider";
import { ServicesProvider } from "./providers/ServicesProvider";
import {
  ObservablePokemonQuery,
  IPokemonService
} from "./services/PokemonService";
import {
  PokemonEditor,
  PokemonEditorViewStore
} from "./components/PokemonEditor";
import { PokemonViewer } from "./components/PokemonViewer";
import { IPokemonViewData } from "./types";

class PokemonPageViewStore {
  name: string;

  private _pokemon: ObservablePokemonQuery;
  private pokemonService: IPokemonService;

  constructor(pokemonService?: IPokemonService) {
    this.name = "";
    this.pokemonService = pokemonService || inject(this, IPokemonService);
    this._pokemon = this.pokemonService.getPokemonQuery(this.name);
    makeAutoObservable(this);
  }

  setName = (value: string) => {
    this.name = value;
    this._pokemon.setName(value);
  };

  get pokemon(): IPokemonViewData | undefined {
    const pokemon = this._pokemon.current?.data;
    return pokemon ? { name: pokemon.name, weight: pokemon.weight } : undefined;
  }

  get status() {
    return this._pokemon.current?.status || "idle";
  }

  get editorStore(): PokemonEditorViewStore | undefined {
    const data = this._pokemon.current?.data;
    if (!data) return undefined;
    return new PokemonEditorViewStore({ name: data.name, weight: data.weight });
  }
}

const PokemonLoadingIndicator = observer(() => {
  const store = useInstance(PokemonPageViewStore);
  return <h2>Status: {store.status}</h2>;
});

const PokemonInput = observer(() => {
  const store = useInstance(PokemonPageViewStore);
  return (
    <div>
      <div>Type pokemon name to select one (eg. bulbasaur, pikachu, etc.).</div>
      <label>
        Name:
        <input
          value={store.name}
          onChange={(e) => store.setName(e.target.value || "")}
        />
      </label>
    </div>
  );
});

const PokemonPage = provider(PokemonPageViewStore)(
  observer(() => {
    // i can start using instance here => no zombie child
    const store = useInstance(PokemonPageViewStore);

    return (
      <div>
        <PokemonInput />
        <PokemonLoadingIndicator />
        <PokemonEditor store={store.editorStore} />
        <PokemonViewer pokemon={store.pokemon} />
      </div>
    );
  })
);

export default function App() {
  return (
    <QueryClientProvider>
      <ServicesProvider>
        <PokemonPage />
      </ServicesProvider>
    </QueryClientProvider>
  );
}
