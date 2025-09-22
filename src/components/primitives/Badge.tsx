import { forwardRef, type HTMLAttributes } from "react";
import styled, { css } from "styled-components";

import type { ActionTone, ApolloTheme } from "../../theme/tokens";

export type BadgeVariant = "solid" | "outline" | "subtle";

const toneStyles = ({ theme, $tone, $variant }: StyledBadgeProps & { theme: ApolloTheme }) => {
  const palette = theme.colors.action[$tone];
  switch ($variant) {
    case "outline":
      return css`
        color: ${$tone === "neutral" ? theme.colors.text.primary : palette.solid};
        border: 1px solid ${palette.outline};
        background-color: transparent;
      `;
    case "subtle":
      return css`
        color: ${palette.subtleForeground};
        background-color: ${palette.subtle};
        border: 1px solid transparent;
      `;
    case "solid":
    default:
      return css`
        color: ${palette.solidForeground};
        background-color: ${palette.solid};
        border: 1px solid ${palette.solid};
      `;
  }
};

interface StyledBadgeProps {
  readonly $tone: ActionTone;
  readonly $variant: BadgeVariant;
}

const StyledBadge = styled.span.withConfig({
  shouldForwardProp: (prop) => !prop.startsWith("$"),
})<StyledBadgeProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space[2]};
  font-family: ${({ theme }) => theme.typography.fonts.sans};
  font-size: ${({ theme }) => theme.typography.variants.detail.fontSize};
  line-height: ${({ theme }) => theme.typography.variants.detail.lineHeight};
  letter-spacing: ${({ theme }) => theme.typography.variants.detail.letterSpacing};
  padding: ${({ theme }) => `${theme.space[1]} ${theme.space[2]}`};
  border-radius: ${({ theme }) => theme.radii.pill};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  text-transform: uppercase;
  white-space: nowrap;
  ${toneStyles}
`;

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  readonly tone?: ActionTone;
  readonly variant?: BadgeVariant;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { tone = "accent", variant = "solid", children, ...props },
  ref,
) {
  return (
    <StyledBadge ref={ref} $tone={tone} $variant={variant} data-tone={tone} data-variant={variant} {...props}>
      {children}
    </StyledBadge>
  );
});

Badge.displayName = "Badge";
