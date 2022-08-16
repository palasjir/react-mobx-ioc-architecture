import { observer } from "mobx-react";
import { IPokemonViewData } from "../types";

export interface Props {
  pokemon?: IPokemonViewData;
}

/**
 * This component showcases complex readonly logic in a reusable component.
 */
export const PokemonViewer = observer((props: Props) => {
  const { pokemon } = props;

  let content;
  if (!pokemon) {
    content = <div>No pokemon selected.</div>;
  } else {
    const { name, weight } = pokemon;
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
              <td>{weight}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div>
      <h2>Viewer</h2>
      {content}
    </div>
  );
});
