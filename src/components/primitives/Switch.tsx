import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  useId,
  useState,
} from "react";
import styled from "styled-components";

import { setRef } from "../internal/setRef";

const HiddenSwitch = styled.input.attrs({ type: "checkbox" })`
  position: absolute;
  opacity: 0;
  pointer-events: none;
  width: 1px;
  height: 1px;
  margin: 0;
`;

const SwitchTrack = styled.span`
  position: relative;
  width: 2.5rem;
  height: 1.4rem;
  border-radius: 999px;
  background-color: ${({ theme }) => theme.colors.surface.surfaceSunken};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  transition: ${({ theme }) =>
    theme.motion.reduced
      ? "none"
      : `background-color ${theme.motion.duration.fast} ${theme.motion.easing.standard}, border-color ${theme.motion.duration.fast} ${theme.motion.easing.standard}`};

  &::after {
    content: "";
    position: absolute;
    top: 0.125rem;
    left: 0.125rem;
    width: 1.1rem;
    height: 1.1rem;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.surface.surfaceRaised};
    box-shadow: ${({ theme }) => theme.shadows.sm};
    transition: ${({ theme }) =>
      theme.motion.reduced
        ? "none"
        : `transform ${theme.motion.duration.fast} ${theme.motion.easing.emphasized}, background-color ${theme.motion.duration.fast} ${theme.motion.easing.standard}`};
  }
`;

const SwitchContainer = styled.label`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
  cursor: pointer;

  ${HiddenSwitch}:checked + ${SwitchTrack} {
    background-color: ${({ theme }) => theme.colors.action.accent.solid};
    border-color: ${({ theme }) => theme.colors.action.accent.solid};
  }

  ${HiddenSwitch}:checked + ${SwitchTrack}::after {
    transform: translateX(1.1rem);
    background-color: ${({ theme }) => theme.colors.action.accent.solidForeground};
  }

  ${HiddenSwitch}:focus-visible + ${SwitchTrack} {
    box-shadow:
      0 0 0 1px ${({ theme }) => theme.colors.surface.background},
      0 0 0 4px ${({ theme }) => theme.colors.states.focusRing};
  }

  &[data-disabled="true"] {
    cursor: not-allowed;
    opacity: 0.55;
  }
`;

const SwitchLabel = styled.span`
  font-family: ${({ theme }) => theme.typography.fonts.sans};
  font-size: ${({ theme }) => theme.typography.variants.body.fontSize};
  line-height: ${({ theme }) => theme.typography.variants.body.lineHeight};
  color: ${({ theme }) => theme.colors.text.primary};
`;

export interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  readonly label?: ReactNode;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { id, label, disabled, className, onChange, checked, defaultChecked, ...rest },
  forwardedRef,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const isControlled = typeof checked === "boolean";
  const [internalChecked, setInternalChecked] = useState<boolean>(
    Boolean(defaultChecked),
  );
  const currentChecked = isControlled ? Boolean(checked) : internalChecked;

  return (
    <SwitchContainer
      htmlFor={inputId}
      data-disabled={disabled ? "true" : undefined}
      className={className}
    >
      <HiddenSwitch
        id={inputId}
        role="switch"
        checked={checked}
        defaultChecked={defaultChecked}
        aria-checked={currentChecked}
        disabled={disabled}
        aria-disabled={disabled}
        ref={(node) => setRef(forwardedRef, node)}
        onChange={(event) => {
          if (!isControlled) {
            setInternalChecked(event.currentTarget.checked);
          }
          onChange?.(event);
        }}
        {...rest}
      />
      <SwitchTrack aria-hidden="true" />
      {label ? <SwitchLabel>{label}</SwitchLabel> : null}
    </SwitchContainer>
  );
});

Switch.displayName = "Switch";
