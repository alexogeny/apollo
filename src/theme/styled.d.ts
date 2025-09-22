import "styled-components";
import type { ApolloTheme } from "./tokens";

declare module "styled-components" {
  export interface DefaultTheme extends ApolloTheme {}
}
