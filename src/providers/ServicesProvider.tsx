import { PropsWithChildren } from "react";
import { provider } from "react-ioc";
import { PokemonService, IPokemonService } from "../services/PokemonService";

export const ServicesProvider = provider([IPokemonService, PokemonService])(
  (props: PropsWithChildren<{}>) => {
    return <>{props.children}</>;
  }
);
