import { forwardRef, type HTMLAttributes } from "react";
import styled, { css, keyframes } from "styled-components";

import type { ActionTone } from "../../theme/tokens";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const sizeMap = {
  xs: "1rem",
  sm: "1.5rem",
  md: "2rem",
  lg: "2.5rem",
} as const;

export type SpinnerSize = keyof typeof sizeMap;

const SpinnerRoot = styled.span.withConfig({
  shouldForwardProp: (prop) => !prop.startsWith("$"),
})<{ readonly $size: SpinnerSize; readonly $tone: ActionTone }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: ${({ $size }) => sizeMap[$size]};
  height: ${({ $size }) => sizeMap[$size]};

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: ${({ theme }) => theme.radii.pill};
    border: 3px solid ${({ theme }) => theme.colors.surface.surfaceSunken};
    border-top-color: ${({ theme, $tone }) => theme.colors.action[$tone].solid};
    ${({ theme }) =>
      theme.motion.reduced
        ? css`
            animation: none;
          `
        : css`
            animation-name: ${spin};
            animation-duration: ${theme.motion.duration.slow};
            animation-timing-function: ${theme.motion.easing.emphasized};
            animation-iteration-count: infinite;
          `};
  }
`;

const SpinnerLabel = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  readonly size?: SpinnerSize;
  readonly tone?: ActionTone;
  readonly label?: string;
}

export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { size = "md", tone = "accent", label = "Loading", ...props },
  ref,
) {
  return (
    <SpinnerRoot ref={ref} role="status" aria-live="polite" $size={size} $tone={tone} {...props}>
      <SpinnerLabel>{label}</SpinnerLabel>
    </SpinnerRoot>
  );
});

Spinner.displayName = "Spinner";
