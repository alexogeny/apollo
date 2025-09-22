import {
  forwardRef,
  type ElementType,
  type HTMLAttributes,
  type Ref,
} from "react";
import styled, { css } from "styled-components";

import { Box, type BoxProps } from "./Box";
import type {
  FontWeightToken,
  TextColorToken,
  TextVariant,
} from "../../theme/tokens";

export type TextAlign = "start" | "center" | "end" | "justify";
export type TextWrap = "wrap" | "nowrap" | "balance" | "pretty";

interface StyledTextProps {
  readonly $variant: TextVariant;
  readonly $weight: FontWeightToken;
  readonly $color: TextColorToken;
  readonly $align: TextAlign;
  readonly $wrap: TextWrap;
}

export interface TextProps
  extends Omit<BoxProps, "color" | "wrap">,
    Omit<HTMLAttributes<HTMLElement>, "color"> {
  readonly as?: ElementType;
  readonly variant?: TextVariant;
  readonly weight?: FontWeightToken;
  readonly color?: TextColorToken;
  readonly align?: TextAlign;
  readonly wrap?: TextWrap;
  readonly htmlFor?: string;
}

const StyledText = styled(Box)<StyledTextProps>`
  display: inline;
  font-family: ${({ theme, $variant }) => {
    const variant = theme.typography.variants[$variant];
    if (variant.fontFamily) {
      return theme.typography.fonts[variant.fontFamily];
    }
    return theme.typography.fonts.sans;
  }};
  font-size: ${({ theme, $variant }) => theme.typography.variants[$variant].fontSize};
  line-height: ${({ theme, $variant }) => theme.typography.variants[$variant].lineHeight};
  letter-spacing: ${({ theme, $variant }) => theme.typography.variants[$variant].letterSpacing};
  color: ${({ theme, $color }) => theme.colors.text[$color]};
  font-weight: ${({ theme, $weight }) => theme.typography.weights[$weight]};
  text-align: ${({ $align }) => $align};
  ${({ theme, $variant }) => {
    const transform = theme.typography.variants[$variant].textTransform;
    if (!transform) {
      return undefined;
    }
    return css`
      text-transform: ${transform};
    `;
  }}
  ${({ $wrap }) => {
    switch ($wrap) {
      case "nowrap":
        return css`
          white-space: nowrap;
          overflow-wrap: normal;
        `;
      case "balance":
        return css`
          text-wrap: balance;
          overflow-wrap: anywhere;
        `;
      case "pretty":
        return css`
          text-wrap: pretty;
          overflow-wrap: anywhere;
        `;
      default:
        return css`
          text-wrap: wrap;
          overflow-wrap: anywhere;
        `;
    }
  }}
`;

export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  {
    as = "span",
    variant = "body",
    weight = "regular",
    color = "primary",
    align = "start",
    wrap = "wrap",
    display,
    ...rest
  },
  ref,
) {
  return (
    <StyledText
      as={as}
      ref={ref as Ref<HTMLElement>}
      $variant={variant}
      $weight={weight}
      $color={color}
      $align={align}
      $wrap={wrap}
      display={display ?? "inline"}
      {...rest}
    />
  );
});

Text.displayName = "Text";
