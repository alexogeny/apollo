import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  useEffect,
  useId,
  useRef,
} from "react";
import styled from "styled-components";

import { setRef } from "../internal/setRef";

const HiddenCheckbox = styled.input.attrs({ type: "checkbox" })`
  position: absolute;
  opacity: 0;
  pointer-events: none;
  width: 1px;
  height: 1px;
  margin: 0;
`;

const CheckboxControl = styled.span`
  position: relative;
  width: 1.125rem;
  height: 1.125rem;
  border-radius: ${({ theme }) => theme.radii.sm};
  border: 1px solid ${({ theme }) => theme.colors.border.strong};
  background-color: ${({ theme }) => theme.colors.surface.surfaceSunken};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: ${({ theme }) =>
    theme.motion.reduced
      ? "none"
      : `background-color ${theme.motion.duration.fast} ${theme.motion.easing.standard}, border-color ${theme.motion.duration.fast} ${theme.motion.easing.standard}`};

  &::after {
    content: "";
    width: 0.5rem;
    height: 0.25rem;
    border-left: 2px solid transparent;
    border-bottom: 2px solid transparent;
    transform: rotate(-45deg) scale(0.25);
    transform-origin: center;
    transition: ${({ theme }) =>
      theme.motion.reduced
        ? "none"
        : `transform ${theme.motion.duration.fast} ${theme.motion.easing.standard}, border-color ${theme.motion.duration.fast} ${theme.motion.easing.standard}`};
  }
`;

const CheckboxLabel = styled.span`
  font-family: ${({ theme }) => theme.typography.fonts.sans};
  font-size: ${({ theme }) => theme.typography.variants.body.fontSize};
  line-height: ${({ theme }) => theme.typography.variants.body.lineHeight};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const CheckboxDescription = styled.span`
  font-family: ${({ theme }) => theme.typography.fonts.sans};
  font-size: ${({ theme }) => theme.typography.variants.detail.fontSize};
  line-height: ${({ theme }) => theme.typography.variants.detail.lineHeight};
  color: ${({ theme }) => theme.colors.text.muted};
`;

const CheckboxContainer = styled.label`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: ${({ theme }) => theme.space[3]};
  align-items: flex-start;
  cursor: pointer;
  position: relative;

  ${HiddenCheckbox}:focus-visible + ${CheckboxControl} {
    box-shadow:
      0 0 0 1px ${({ theme }) => theme.colors.surface.background},
      0 0 0 4px ${({ theme }) => theme.colors.states.focusRing};
  }

  ${HiddenCheckbox}:checked + ${CheckboxControl} {
    background-color: ${({ theme }) => theme.colors.action.accent.solid};
    border-color: ${({ theme }) => theme.colors.action.accent.solid};
  }

  ${HiddenCheckbox}:checked + ${CheckboxControl}::after {
    border-left-color: ${({ theme }) => theme.colors.action.accent.solidForeground};
    border-bottom-color: ${({ theme }) => theme.colors.action.accent.solidForeground};
    transform: rotate(-45deg) scale(1);
  }

  ${HiddenCheckbox}[data-indeterminate="true"] + ${CheckboxControl} {
    background-color: ${({ theme }) => theme.colors.action.accent.subtle};
    border-color: ${({ theme }) => theme.colors.action.accent.solid};
  }

  ${HiddenCheckbox}[data-indeterminate="true"] + ${CheckboxControl}::after {
    width: 0.55rem;
    height: 0;
    border-left: none;
    border-bottom: 2px solid ${({ theme }) => theme.colors.action.accent.solid};
    transform: rotate(0deg) scale(1);
  }

  &[data-disabled="true"] {
    cursor: not-allowed;
    opacity: 0.55;
  }
`;

const CheckboxTextStack = styled.span`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[1]};
`;

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  readonly label?: ReactNode;
  readonly description?: ReactNode;
  readonly indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { id, label, description, indeterminate = false, disabled, className, ...props },
  forwardedRef,
) {
  const internalRef = useRef<HTMLInputElement | null>(null);
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const descriptionId = description ? `${inputId}-description` : undefined;

  useEffect(() => {
    if (internalRef.current) {
      internalRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <CheckboxContainer
      htmlFor={inputId}
      data-disabled={disabled ? "true" : undefined}
      className={className}
    >
      <HiddenCheckbox
        id={inputId}
        ref={(node) => {
          internalRef.current = node;
          setRef(forwardedRef, node);
        }}
        disabled={disabled}
        aria-disabled={disabled}
        aria-describedby={descriptionId}
        data-indeterminate={indeterminate ? "true" : undefined}
        aria-checked={indeterminate ? "mixed" : undefined}
        {...props}
      />
      <CheckboxControl aria-hidden="true" data-state={indeterminate ? "indeterminate" : undefined} />
      {(label || description) && (
        <CheckboxTextStack>
          {label ? <CheckboxLabel>{label}</CheckboxLabel> : null}
          {description ? (
            <CheckboxDescription id={descriptionId}>{description}</CheckboxDescription>
          ) : null}
        </CheckboxTextStack>
      )}
    </CheckboxContainer>
  );
});

Checkbox.displayName = "Checkbox";
