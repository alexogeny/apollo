import {
  forwardRef,
  type ElementType,
  type Ref,
} from "react";
import styled, { css } from "styled-components";

import { Box, type BoxProps } from "./Box";

const INTERACTIVE_HTML_TAGS = new Set([
  "a",
  "button",
  "summary",
  "input",
  "textarea",
  "select",
  "option",
]);

interface StyledCardProps {
  readonly $interactive: boolean;
  readonly $tone: "neutral" | "accent";
}

export interface CardProps extends BoxProps {
  readonly interactive?: boolean;
  readonly tone?: "neutral" | "accent";
}

const StyledCard = styled(Box)<StyledCardProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.surface.surface};
  transition: ${({ theme }) =>
    theme.motion.reduced
      ? "none"
      : `background-color ${theme.motion.duration.base} ${theme.motion.easing.standard}, box-shadow ${theme.motion.duration.base} ${theme.motion.easing.standard}, transform ${theme.motion.duration.fast} ${theme.motion.easing.emphasized}`};
  ${({ $tone, theme }) =>
    $tone === "accent"
      ? css`
          background-color: ${theme.colors.action.accent.subtle};
          color: ${theme.colors.action.accent.subtleForeground};
          border-color: ${theme.colors.action.accent.outline};
        `
      : undefined}
  ${({ $interactive, theme, $tone }) =>
    $interactive
      ? css`
          cursor: pointer;
          &:hover {
            box-shadow: ${theme.shadows.md};
            background-color:
              ${$tone === "accent"
                ? theme.colors.action.accent.subtleHover
                : theme.colors.surface.surfaceRaised};
          }
          &:active {
            transform: ${theme.motion.reduced ? "none" : "translateY(1px)"};
            background-color:
              ${$tone === "accent"
                ? theme.colors.action.accent.subtleHover
                : theme.colors.surface.surface};
          }
        `
      : undefined}
  &:focus-visible {
    outline: none;
    box-shadow:
      ${({ theme }) => theme.shadows.sm},
      0 0 0 4px ${({ theme }) => theme.colors.states.focusRing};
  }
`;

export const Card = forwardRef<HTMLElement, CardProps>(function Card(
  {
    as = "section",
    interactive = false,
    tone = "neutral",
    padding = "6",
    radius = "lg",
    shadow = "xs",
    border = "subtle",
    tabIndex,
    background,
    role,
    ...rest
  },
  ref,
) {
  const element = as as ElementType;
  const isNativeInteractive =
    typeof element === "string" && INTERACTIVE_HTML_TAGS.has(element);
  const computedTabIndex =
    interactive && !isNativeInteractive && tabIndex === undefined ? 0 : tabIndex;
  const computedRole =
    interactive && !isNativeInteractive && role === undefined ? "button" : role;

  return (
    <StyledCard
      as={as}
      ref={ref as Ref<HTMLElement>}
      padding={padding}
      radius={radius}
      shadow={shadow}
      border={border}
      background={background ?? "surface"}
      tabIndex={computedTabIndex}
      role={computedRole}
      data-tone={tone}
      data-interactive={interactive ? "true" : undefined}
      $interactive={interactive}
      $tone={tone}
      {...rest}
    />
  );
});

Card.displayName = "Card";
