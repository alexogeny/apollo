import { forwardRef, type HTMLAttributes, useMemo } from "react";
import styled, { css } from "styled-components";

import type { ActionTone, ApolloTheme } from "../../theme/tokens";

export type ProgressVariant = "linear" | "rounded";

interface StyledProgressProps {
  readonly $tone: ActionTone;
  readonly $variant: ProgressVariant;
  readonly $value: number;
}

const indicatorStyles = ({ theme, $tone }: StyledProgressProps & { theme: ApolloTheme }) => {
  const palette = theme.colors.action[$tone];
  return css`
    background: linear-gradient(90deg, ${palette.solid}, ${palette.solidHover});
  `;
};

const ProgressRoot = styled.div.withConfig({
  shouldForwardProp: (prop) => !prop.startsWith("$"),
})<{ readonly $variant: ProgressVariant }>`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.surface.surfaceSunken};
  border-radius: ${({ theme, $variant }) =>
    $variant === "rounded" ? theme.radii.pill : theme.radii.md};
  overflow: hidden;
  height: 0.75rem;
`;

const ProgressIndicator = styled.div.withConfig({
  shouldForwardProp: (prop) => !prop.startsWith("$"),
})<StyledProgressProps>`
  height: 100%;
  width: ${({ $value }) => `${$value}%`};
  transition: ${({ theme }) =>
    theme.motion.reduced
      ? "none"
      : `width ${theme.motion.duration.base} ${theme.motion.easing.emphasized}`};
  ${indicatorStyles}
`;

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  readonly value: number;
  readonly min?: number;
  readonly max?: number;
  readonly tone?: ActionTone;
  readonly variant?: ProgressVariant;
  readonly label?: string;
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  { value, min = 0, max = 100, tone = "accent", variant = "linear", label, ...props },
  ref,
) {
  const clamped = useMemo(() => {
    const safeMax = max <= min ? min + 1 : max;
    const normalized = Math.min(Math.max(value, min), safeMax);
    const range = safeMax - min;
    return ((normalized - min) / range) * 100;
  }, [value, min, max]);

  return (
    <ProgressRoot
      ref={ref}
      role="progressbar"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-label={label}
      $variant={variant}
      {...props}
    >
      <ProgressIndicator $value={clamped} $tone={tone} $variant={variant} />
    </ProgressRoot>
  );
});

Progress.displayName = "Progress";
