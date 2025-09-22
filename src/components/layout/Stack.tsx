import { forwardRef, type Ref } from "react";

import { Box, type BoxProps } from "../primitives/Box";
import type { SpacingScale } from "../../theme/tokens";

export type StackDirection = "horizontal" | "vertical";

export interface StackProps
  extends Omit<BoxProps, "display" | "direction" | "wrap" | "gap"> {
  readonly direction?: StackDirection;
  readonly gap?: SpacingScale;
  readonly wrap?: boolean;
}

export const Stack = forwardRef<HTMLElement, StackProps>(function Stack(
  { direction = "vertical", gap = "4", wrap = false, ...rest },
  ref,
) {
  const flexDirection = direction === "horizontal" ? "row" : "column";
  return (
    <Box
      ref={ref as Ref<HTMLElement>}
      display="flex"
      direction={flexDirection}
      wrap={wrap ? "wrap" : "nowrap"}
      gap={gap}
      {...rest}
    />
  );
});

Stack.displayName = "Stack";
