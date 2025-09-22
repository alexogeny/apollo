import {
  createContext,
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  useContext,
  useId,
  useMemo,
  useState,
} from "react";
import styled from "styled-components";

import { setRef } from "../internal/setRef";
interface RadioGroupContextValue {
  readonly name: string;
  readonly value: string | null;
  readonly setValue: (value: string) => void;
  readonly disabled?: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

const HiddenRadio = styled.input.attrs({ type: "radio" })`
  position: absolute;
  opacity: 0;
  pointer-events: none;
  width: 1px;
  height: 1px;
  margin: 0;
`;

const RadioIndicator = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.125rem;
  height: 1.125rem;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.border.strong};
  background-color: ${({ theme }) => theme.colors.surface.surfaceSunken};
  transition: ${({ theme }) =>
    theme.motion.reduced
      ? "none"
      : `border-color ${theme.motion.duration.fast} ${theme.motion.easing.standard}`};

  &::after {
    content: "";
    width: 0.55rem;
    height: 0.55rem;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.action.accent.solid};
    transform: scale(0);
    transition: ${({ theme }) =>
      theme.motion.reduced
        ? "none"
        : `transform ${theme.motion.duration.fast} ${theme.motion.easing.emphasized}`};
  }
`;

const RadioLabel = styled.span`
  font-family: ${({ theme }) => theme.typography.fonts.sans};
  font-size: ${({ theme }) => theme.typography.variants.body.fontSize};
  line-height: ${({ theme }) => theme.typography.variants.body.lineHeight};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const RadioItemWrapper = styled.label`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: ${({ theme }) => theme.space[3]};
  align-items: center;
  cursor: pointer;

  ${HiddenRadio}:checked + ${RadioIndicator} {
    border-color: ${({ theme }) => theme.colors.action.accent.solid};
  }

  ${HiddenRadio}:checked + ${RadioIndicator}::after {
    transform: scale(1);
  }

  ${HiddenRadio}:focus-visible + ${RadioIndicator} {
    box-shadow:
      0 0 0 1px ${({ theme }) => theme.colors.surface.background},
      0 0 0 4px ${({ theme }) => theme.colors.states.focusRing};
  }

  &[data-disabled="true"] {
    cursor: not-allowed;
    opacity: 0.55;
  }
`;

const RadioGroupRoot = styled.div<{ readonly $orientation: "horizontal" | "vertical" }>`
  display: flex;
  flex-direction: ${({ $orientation }) => ($orientation === "horizontal" ? "row" : "column")};
  gap: ${({ theme }) => theme.space[3]};
`;

export interface RadioGroupProps {
  readonly name?: string;
  readonly value?: string;
  readonly defaultValue?: string;
  readonly onValueChange?: (value: string) => void;
  readonly children: ReactNode;
  readonly orientation?: "horizontal" | "vertical";
  readonly disabled?: boolean;
  readonly "aria-labelledby"?: string;
  readonly "aria-describedby"?: string;
  readonly className?: string;
}

export function RadioGroup({
  name,
  value,
  defaultValue,
  onValueChange,
  children,
  orientation = "vertical",
  disabled = false,
  "aria-labelledby": ariaLabelledby,
  "aria-describedby": ariaDescribedby,
  className,
}: RadioGroupProps): JSX.Element {
  const generatedName = useId();
  const groupName = name ?? generatedName;
  const isControlled = value != null;
  const [internalValue, setInternalValue] = useState<string | null>(defaultValue ?? null);
  const currentValue = isControlled ? value ?? null : internalValue;

  const contextValue = useMemo<RadioGroupContextValue>(() => ({
    name: groupName,
    value: currentValue,
    setValue: (nextValue: string) => {
      if (!isControlled) {
        setInternalValue(nextValue);
      }
      onValueChange?.(nextValue);
    },
    disabled,
  }), [currentValue, disabled, groupName, isControlled, onValueChange]);

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <RadioGroupRoot
        role="radiogroup"
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
        $orientation={orientation}
        className={className}
      >
        {children}
      </RadioGroupRoot>
    </RadioGroupContext.Provider>
  );
}

export interface RadioGroupItemProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "name" | "value" | "defaultValue" | "checked"> {
  readonly value: string;
  readonly label?: ReactNode;
}

export const RadioGroupItem = forwardRef<HTMLInputElement, RadioGroupItemProps>(
  function RadioGroupItem({ value, label, disabled, onChange, id, className, ...rest }, forwardedRef) {
    const context = useContext(RadioGroupContext);
    if (!context) {
      throw new Error("RadioGroupItem must be used within a RadioGroup");
    }

    const generatedId = useId();
    const inputId = id ?? generatedId;
    const { ["aria-describedby"]: ariaDescribedBy, ...inputProps } = rest;
    const isChecked = context.value === value;
    const isDisabled = disabled || context.disabled;
    return (
      <RadioItemWrapper
        htmlFor={inputId}
        data-disabled={isDisabled ? "true" : undefined}
        className={className}
      >
        <HiddenRadio
          id={inputId}
          name={context.name}
          checked={isChecked}
          onChange={(event) => {
            if (!isDisabled) {
              context.setValue(value);
            }
            onChange?.(event);
          }}
          disabled={isDisabled}
          aria-disabled={isDisabled}
          aria-describedby={ariaDescribedBy}
          value={value}
          ref={(node) => {
            setRef(forwardedRef, node);
          }}
          {...inputProps}
        />
        <RadioIndicator aria-hidden="true" />
        {label ? <RadioLabel>{label}</RadioLabel> : null}
      </RadioItemWrapper>
    );
  },
);

RadioGroupItem.displayName = "RadioGroupItem";
