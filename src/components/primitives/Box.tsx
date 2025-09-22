import {
  forwardRef,
  type CSSProperties,
  type ElementType,
  type Ref,
  type HTMLAttributes,
} from "react";
import styled, { css } from "styled-components";

import type {
  ApolloTheme,
  BorderToken,
  RadiusToken,
  ShadowToken,
  SpacingScale,
  SurfaceColorToken,
} from "../../theme/tokens";

interface StyledBoxProps {
  readonly $padding?: SpacingScale;
  readonly $paddingX?: SpacingScale;
  readonly $paddingY?: SpacingScale;
  readonly $margin?: SpacingScale;
  readonly $marginX?: SpacingScale;
  readonly $marginY?: SpacingScale;
  readonly $gap?: SpacingScale;
  readonly $radius?: RadiusToken;
  readonly $shadow?: ShadowToken;
  readonly $border?: BorderToken | "none";
  readonly $background?: SurfaceColorToken;
  readonly $display?: CSSProperties["display"];
  readonly $direction?: CSSProperties["flexDirection"];
  readonly $wrap?: CSSProperties["flexWrap"];
  readonly $align?: CSSProperties["alignItems"];
  readonly $justify?: CSSProperties["justifyContent"];
}

export interface BoxProps extends HTMLAttributes<HTMLElement> {
  readonly padding?: SpacingScale;
  readonly paddingX?: SpacingScale;
  readonly paddingY?: SpacingScale;
  readonly margin?: SpacingScale;
  readonly marginX?: SpacingScale;
  readonly marginY?: SpacingScale;
  readonly gap?: SpacingScale;
  readonly radius?: RadiusToken;
  readonly shadow?: ShadowToken;
  readonly border?: BorderToken | "none";
  readonly background?: SurfaceColorToken;
  readonly display?: CSSProperties["display"];
  readonly direction?: CSSProperties["flexDirection"];
  readonly wrap?: CSSProperties["flexWrap"];
  readonly align?: CSSProperties["alignItems"];
  readonly justify?: CSSProperties["justifyContent"];
  readonly as?: ElementType;
}

const spacingValue = (theme: ApolloTheme, token?: SpacingScale): string | undefined => {
  if (!token) {
    return undefined;
  }
  return theme.space[token];
};

const StyledBox = styled.div<StyledBoxProps>`
  box-sizing: border-box;
  min-width: 0;
  min-height: 0;
  display: ${({ $display }) => $display ?? "block"};
  ${({ theme, $padding }) =>
    $padding
      ? css`
          padding: ${spacingValue(theme, $padding)};
        `
      : undefined}
  ${({ theme, $paddingX }) =>
    $paddingX
      ? css`
          padding-left: ${spacingValue(theme, $paddingX)};
          padding-right: ${spacingValue(theme, $paddingX)};
        `
      : undefined}
  ${({ theme, $paddingY }) =>
    $paddingY
      ? css`
          padding-top: ${spacingValue(theme, $paddingY)};
          padding-bottom: ${spacingValue(theme, $paddingY)};
        `
      : undefined}
  ${({ theme, $margin }) =>
    $margin
      ? css`
          margin: ${spacingValue(theme, $margin)};
        `
      : undefined}
  ${({ theme, $marginX }) =>
    $marginX
      ? css`
          margin-left: ${spacingValue(theme, $marginX)};
          margin-right: ${spacingValue(theme, $marginX)};
        `
      : undefined}
  ${({ theme, $marginY }) =>
    $marginY
      ? css`
          margin-top: ${spacingValue(theme, $marginY)};
          margin-bottom: ${spacingValue(theme, $marginY)};
        `
      : undefined}
  ${({ theme, $gap }) =>
    $gap
      ? css`
          gap: ${spacingValue(theme, $gap)};
        `
      : undefined}
  ${({ $direction }) =>
    $direction
      ? css`
          flex-direction: ${$direction};
        `
      : undefined}
  ${({ $wrap }) =>
    $wrap
      ? css`
          flex-wrap: ${$wrap};
        `
      : undefined}
  ${({ $align }) =>
    $align
      ? css`
          align-items: ${$align};
        `
      : undefined}
  ${({ $justify }) =>
    $justify
      ? css`
          justify-content: ${$justify};
        `
      : undefined}
  border-style: solid;
  border-width: ${({ $border }) => ($border && $border !== "none" ? "1px" : "0")};
  border-color: ${({ theme, $border }) => {
    if (!$border || $border === "none") {
      return "transparent";
    }
    return $border === "strong"
      ? theme.colors.border.strong
      : theme.colors.border.subtle;
  }};
  border-radius: ${({ theme, $radius }) => ($radius ? theme.radii[$radius] : "inherit")};
  box-shadow: ${({ theme, $shadow }) => ($shadow ? theme.shadows[$shadow] : "none")};
  background-color: ${({ theme, $background }) =>
    $background ? theme.colors.surface[$background] : "transparent"};
  transition: ${({ theme }) =>
    theme.motion.reduced
      ? "none"
      : `background-color ${theme.motion.duration.base} ${theme.motion.easing.standard}, box-shadow ${theme.motion.duration.base} ${theme.motion.easing.standard}`};
`;

export const Box = forwardRef<HTMLElement, BoxProps>(function Box(
  {
    padding,
    paddingX,
    paddingY,
    margin,
    marginX,
    marginY,
    gap,
    radius,
    shadow,
    border = "none",
    background,
    display,
    direction,
    wrap,
    align,
    justify,
    ...rest
  },
  ref,
) {
  return (
    <StyledBox
      ref={ref as Ref<HTMLDivElement>}
      $padding={padding}
      $paddingX={paddingX}
      $paddingY={paddingY}
      $margin={margin}
      $marginX={marginX}
      $marginY={marginY}
      $gap={gap}
      $radius={radius}
      $shadow={shadow}
      $border={border}
      $background={background}
      $display={display}
      $direction={direction}
      $wrap={wrap}
      $align={align}
      $justify={justify}
      data-apollo-padding={padding ?? undefined}
      data-apollo-gap={gap ?? undefined}
      data-apollo-display={display ?? undefined}
      data-apollo-direction={direction ?? undefined}
      {...rest}
    />
  );
});

Box.displayName = "Box";
