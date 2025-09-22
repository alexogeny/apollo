import {
  forwardRef,
  type CSSProperties,
  type MutableRefObject,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styled from "styled-components";

import { Portal } from "../internal/Portal";
import { useControllableState } from "../internal/useControllableState";
import { Button } from "../primitives/Button";

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, amount: number): Date {
  const next = new Date(date);
  next.setMonth(next.getMonth() + amount);
  return next;
}

interface CalendarDay {
  readonly date: Date;
  readonly inMonth: boolean;
}

function getCalendarDays(month: Date): CalendarDay[] {
  const firstDay = startOfMonth(month);
  const firstWeekday = firstDay.getDay();
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const days: CalendarDay[] = [];
  let dayCounter = 1 - firstWeekday;
  for (let week = 0; week < 6; week += 1) {
    for (let weekday = 0; weekday < 7; weekday += 1) {
      const dayDate = new Date(month.getFullYear(), month.getMonth(), dayCounter);
      days.push({ date: dayDate, inMonth: dayDate.getMonth() === month.getMonth() });
      dayCounter += 1;
    }
  }
  return days;
}

const PickerContainer = styled.div`
  position: relative;
  display: inline-flex;
`;

const CalendarPopover = styled.div`
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  z-index: 1000;
  background: ${({ theme }) => theme.colors.surface.surfaceRaised};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  padding: ${({ theme }) => theme.space[4]};
  min-width: 18rem;
`;

const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.space[3]};
`;

const MonthLabel = styled.span`
  font-family: ${({ theme }) => theme.typography.fonts.sans};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: ${({ theme }) => theme.space[1]};
`;

const Weekday = styled.span`
  font-size: ${({ theme }) => theme.typography.variants.detail.fontSize};
  text-align: center;
  color: ${({ theme }) => theme.colors.text.muted};
`;

const DayButton = styled.button<{ readonly $inMonth: boolean; readonly $isSelected: boolean }>`
  all: unset;
  cursor: pointer;
  border-radius: ${({ theme }) => theme.radii.md};
  text-align: center;
  padding: ${({ theme }) => theme.space[2]};
  font-family: ${({ theme }) => theme.typography.fonts.sans};
  font-size: ${({ theme }) => theme.typography.variants.bodySm.fontSize};
  color: ${({ theme, $inMonth, $isSelected }) =>
    $isSelected
      ? theme.colors.action.accent.solidForeground
      : $inMonth
        ? theme.colors.text.primary
        : theme.colors.text.muted};
  background-color: ${({ theme, $isSelected }) =>
    $isSelected ? theme.colors.action.accent.solid : "transparent"};
  opacity: ${({ $inMonth }) => ($inMonth ? 1 : 0.45)};
  pointer-events: ${({ $inMonth }) => ($inMonth ? "auto" : "none")};

  &:hover,
  &:focus-visible {
    background-color: ${({ theme, $isSelected }) =>
      $isSelected ? theme.colors.action.accent.solid : theme.colors.action.accent.subtle};
    outline: none;
  }
`;

export interface DatePickerProps {
  readonly value?: Date | null;
  readonly defaultValue?: Date | null;
  readonly onChange?: (date: Date | null) => void;
  readonly placeholder?: string;
  readonly formatDate?: (date: Date) => string;
  readonly label?: ReactNode;
  readonly className?: string;
  readonly style?: CSSProperties;
}

function formatReadableDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(function DatePicker(
  {
    value,
    defaultValue = null,
    onChange,
    placeholder = "Select a date",
    formatDate = formatReadableDate,
    label,
    className,
    style,
  },
  ref,
) {
  const [selected, setSelected] = useControllableState<Date | null>({
    value,
    defaultValue,
    onChange,
  });
  const [open, setOpen] = useState(false);
  const initialMonth = selected ?? new Date();
  const [currentMonth, setCurrentMonth] = useState<Date>(startOfMonth(initialMonth));
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const weeks = useMemo(() => getCalendarDays(currentMonth), [currentMonth]);
  const formattedValue = selected ? formatDate(selected) : placeholder;

  useEffect(() => {
    if (!open) {
      return;
    }
    const handleClick = (event: MouseEvent) => {
      if (
        containerRef.current?.contains(event.target as Node) ||
        contentRef.current?.contains(event.target as Node)
      ) {
        return;
      }
      setOpen(false);
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  useEffect(() => {
    if (selected) {
      setCurrentMonth(startOfMonth(selected));
    }
  }, [selected]);

  const weekdays = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) =>
        new Date(2020, 10, index + 1).toLocaleDateString(undefined, { weekday: "short" }),
      ),
    [],
  );

  return (
    <PickerContainer
      ref={(node) => {
        containerRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as MutableRefObject<HTMLDivElement | null>).current = node;
        }
      }}
      className={className}
      style={style}
    >
      <Button
        type="button"
        variant="outline"
        tone="neutral"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        {label ? <span style={{ marginRight: "0.5rem" }}>{label}</span> : null}
        {formattedValue}
      </Button>
      {open ? (
        <Portal>
          <CalendarPopover
            role="dialog"
            aria-modal="true"
            ref={contentRef}
            style={{
              top: `${
                (containerRef.current?.getBoundingClientRect().bottom ?? 0) +
                (typeof window !== "undefined" ? window.scrollY : 0) +
                8
              }px`,
              left: `${
                (containerRef.current?.getBoundingClientRect().left ?? 0) +
                (typeof window !== "undefined" ? window.scrollX : 0)
              }px`,
            }}
          >
            <CalendarHeader>
              <Button
                size="sm"
                variant="ghost"
                tone="neutral"
                onClick={() => setCurrentMonth((month) => addMonths(month, -1))}
                aria-label="Previous month"
              >
                ←
              </Button>
              <MonthLabel>
                {currentMonth.toLocaleDateString(undefined, {
                  month: "long",
                  year: "numeric",
                })}
              </MonthLabel>
              <Button
                size="sm"
                variant="ghost"
                tone="neutral"
                onClick={() => setCurrentMonth((month) => addMonths(month, 1))}
                aria-label="Next month"
              >
                →
              </Button>
            </CalendarHeader>
            <Grid>
              {weekdays.map((weekday) => (
                <Weekday key={weekday}>{weekday}</Weekday>
              ))}
            </Grid>
            <Grid role="grid" aria-readonly="true">
              {weeks.map((day) => {
                const isSelected = selected
                  ? day.date.toDateString() === selected.toDateString()
                  : false;
                return (
                  <DayButton
                    type="button"
                    key={day.date.toISOString()}
                    $inMonth={day.inMonth}
                    $isSelected={isSelected}
                    role="gridcell"
                    aria-selected={isSelected}
                    disabled={!day.inMonth}
                    onClick={() => {
                      setSelected(day.inMonth ? day.date : selected ?? day.date);
                      setOpen(false);
                    }}
                  >
                    {day.date.getDate()}
                  </DayButton>
                );
              })}
            </Grid>
          </CalendarPopover>
        </Portal>
      ) : null}
    </PickerContainer>
  );
});

DatePicker.displayName = "DatePicker";
