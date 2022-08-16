import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react";
import { inject } from "react-ioc";
import { PokemonService } from "../services/PokemonService";
import { IPokemonViewData } from "../types";

export class PokemonEditorViewStore {
  private initialData: IPokemonViewData;
  private pokemonService: PokemonService;

  name: string;
  weight: number;

  constructor(initialData: IPokemonViewData, pokemonService?: PokemonService) {
    this.pokemonService = pokemonService || inject(this, PokemonService);
    this.initialData = initialData;
    this.name = initialData.name;
    this.weight = initialData.weight;
    makeAutoObservable(this);
  }

  setWeight = (value: number) => {
    this.weight = value;
  };

  reset = () => {
    this.name = this.initialData.name;
    this.weight = this.initialData.weight;
  };

  save = () => {
    // this fuction demonstrates interaction with the service to write data
    this.pokemonService.updatePokemon(this);
  };
}

interface Props {
  store?: PokemonEditorViewStore;
}

/**
 * This component showcases complex editing logic for obtained data in a reusable component.
 */
export const PokemonEditor = observer((props: Props) => {
  const { store } = props;

  let content;
  if (!store) {
    content = <div>No pokemon selected.</div>;
  } else {
    const { name, weight, setWeight, reset, save } = store;
    content = (
      <div>
        <table>
          <tbody>
            <tr>
              <th>Name:</th>
              <td>{name}</td>
            </tr>
            <tr>
              <th>Weight:</th>
              <td>
                <input
                  value={weight}
                  type="number"
                  onChange={(e) => {
                    setWeight(parseInt(e.target.value || "0"));
                  }}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div>
          <button onClick={reset}>Reset</button>
          <button onClick={save}>Save</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2>Editor</h2>
      {content}
    </div>
  );
});
