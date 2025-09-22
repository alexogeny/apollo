import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type ElementType,
  type ForwardedRef,
  type ReactElement,
} from "react";
import styled, { css } from "styled-components";

import type {
  ActionTone,
  ApolloTheme,
  SpacingScale,
  TextVariant,
} from "../../theme/tokens";

export type ButtonVariant = "solid" | "outline" | "ghost" | "subtle";
export type ButtonSize = "xs" | "sm" | "md" | "lg";

interface StyledButtonProps {
  readonly $variant: ButtonVariant;
  readonly $tone: ActionTone;
  readonly $size: ButtonSize;
  readonly $fullWidth: boolean;
}

interface ButtonSizeConfig {
  readonly paddingX: SpacingScale;
  readonly paddingY: SpacingScale;
  readonly gap: SpacingScale;
  readonly text: TextVariant;
}

const BUTTON_SIZES: Record<ButtonSize, ButtonSizeConfig> = {
  xs: { paddingX: "2", paddingY: "1", gap: "1", text: "bodySm" },
  sm: { paddingX: "3", paddingY: "2", gap: "2", text: "bodySm" },
  md: { paddingX: "4", paddingY: "3", gap: "2", text: "body" },
  lg: { paddingX: "5", paddingY: "4", gap: "3", text: "subtitle" },
};

const focusRing = css`
  &:focus-visible {
    outline: none;
    box-shadow:
      0 0 0 1px ${({ theme }) => theme.colors.surface.background},
      0 0 0 4px ${({ theme }) => theme.colors.states.focusRing};
  }
`;

const sizeStyles = ({ theme, $size }: StyledButtonProps & { theme: ApolloTheme }) => {
  const config = BUTTON_SIZES[$size];
  const text = theme.typography.variants[config.text];
  return css`
    padding: ${theme.space[config.paddingY]} ${theme.space[config.paddingX]};
    gap: ${theme.space[config.gap]};
    font-size: ${text.fontSize};
    line-height: ${text.lineHeight};
    letter-spacing: ${text.letterSpacing};
  `;
};

const variantStyles = ({ theme, $variant, $tone }: StyledButtonProps & { theme: ApolloTheme }) => {
  const palette = theme.colors.action[$tone];
  switch ($variant) {
    case "solid":
      return css`
        background-color: ${palette.solid};
        color: ${palette.solidForeground};
        border-color: transparent;
        &:hover:not([disabled]):not([data-disabled="true"]) {
          background-color: ${palette.solidHover};
        }
        &:active:not([disabled]):not([data-disabled="true"]) {
          background-color: ${palette.solidActive};
        }
      `;
    case "outline":
      return css`
        background-color: transparent;
        color: ${$tone === "neutral" ? theme.colors.text.primary : palette.solid};
        border-color: ${palette.outline};
        &:hover:not([disabled]):not([data-disabled="true"]) {
          background-color: ${palette.subtle};
        }
        &:active:not([disabled]):not([data-disabled="true"]) {
          background-color: ${palette.subtleHover};
        }
      `;
    case "subtle":
      return css`
        background-color: ${palette.subtle};
        color: ${palette.subtleForeground};
        border-color: transparent;
        &:hover:not([disabled]):not([data-disabled="true"]) {
          background-color: ${palette.subtleHover};
        }
        &:active:not([disabled]):not([data-disabled="true"]) {
          background-color: ${palette.solidHover};
          color: ${palette.solidForeground};
        }
      `;
    case "ghost":
    default:
      return css`
        background-color: transparent;
        color: ${$tone === "neutral" ? theme.colors.text.primary : palette.solid};
        border-color: transparent;
        &:hover:not([disabled]):not([data-disabled="true"]) {
          background-color: ${palette.subtle};
        }
        &:active:not([disabled]):not([data-disabled="true"]) {
          background-color: ${palette.subtleHover};
        }
      `;
  }
};

const StyledButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !prop.startsWith("$"),
})<StyledButtonProps>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.typography.fonts.sans};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  border-radius: ${({ theme }) => theme.radii.md};
  border-width: 1px;
  border-style: solid;
  cursor: pointer;
  width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "auto")};
  min-width: max-content;
  transition: ${({ theme }) =>
    theme.motion.reduced
      ? "none"
      : `background-color ${theme.motion.duration.fast} ${theme.motion.easing.standard}, color ${theme.motion.duration.fast} ${theme.motion.easing.standard}, border-color ${theme.motion.duration.fast} ${theme.motion.easing.standard}, transform ${theme.motion.duration.fast} ${theme.motion.easing.emphasized}`};
  text-decoration: none;
  ${sizeStyles}
  ${variantStyles}
  ${focusRing}
  &:focus-visible {
    transform: ${({ theme }) => (theme.motion.reduced ? "none" : "translateY(-1px)")};
  }
  &:disabled,
  &[data-disabled="true"] {
    cursor: not-allowed;
    opacity: 0.55;
    box-shadow: none;
    transform: none;
  }
`;

type ButtonOwnProps = {
  readonly variant?: ButtonVariant;
  readonly tone?: ActionTone;
  readonly size?: ButtonSize;
  readonly fullWidth?: boolean;
};

type PolymorphicButtonProps<E extends ElementType> = ButtonOwnProps &
  Omit<ComponentPropsWithoutRef<E>, keyof ButtonOwnProps | "color"> & {
    readonly as?: E;
  };

export type ButtonProps<E extends ElementType = "button"> = PolymorphicButtonProps<E>;

type ButtonComponent = <E extends ElementType = "button">(
  props: ButtonProps<E> & { ref?: ForwardedRef<ElementRef<E>> },
) => ReactElement | null;

export const Button = forwardRef(function Button<E extends ElementType = "button">(
  {
    as,
    variant = "solid",
    tone = "accent",
    size = "md",
    fullWidth = false,
    type,
    disabled,
    ...rest
  }: ButtonProps<E>,
  forwardedRef: ForwardedRef<unknown>,
) {
  const Component = as ?? "button";
  const isNativeButton = Component === "button";
  const buttonType: ButtonHTMLAttributes<HTMLButtonElement>["type"] | undefined =
    isNativeButton
      ? (type as ButtonHTMLAttributes<HTMLButtonElement>["type"] | undefined) ?? "button"
      : undefined;

  return (
    <StyledButton
      as={Component}
      ref={forwardedRef as ForwardedRef<ElementRef<E>>}
      type={buttonType}
      $variant={variant}
      $tone={tone}
      $size={size}
      $fullWidth={fullWidth}
      aria-disabled={disabled}
      data-variant={variant}
      data-tone={tone}
      data-disabled={disabled ? "true" : undefined}
      disabled={isNativeButton ? disabled : undefined}
      {...(rest as ComponentPropsWithoutRef<E>)}
    />
  );
}) as ButtonComponent;

(Button as ButtonComponent & { displayName?: string }).displayName = "Button";
