import * as AccordionPrimitive from '@radix-ui/react-accordion';

import { createStyled } from '../styled';
import type { EmptyVariants } from '../styled';

type AccordionRootPrimitive = typeof AccordionPrimitive.Root;
type AccordionRootAdditionalProps = {
  collapsible?: boolean;
};

const AccordionRoot = createStyled<
  AccordionRootPrimitive,
  EmptyVariants,
  AccordionRootAdditionalProps
>(AccordionPrimitive.Root, {
  base: {
    display: 'grid',
    gap: 'var(--apollo-space-3)',
  },
  dataAttributes: () => ({
    component: 'accordion-root',
  }),
});

const AccordionItem = createStyled(AccordionPrimitive.Item, {
  base: {
    borderRadius: 'var(--apollo-radius-lg)',
    border: '1px solid color-mix(in srgb, var(--apollo-color-border) 65%, transparent)',
    backgroundColor: 'var(--apollo-color-surface)',
    boxShadow: 'var(--apollo-shadow-low)',
    overflow: 'hidden',
    transition:
      'border-color var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard), box-shadow var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard)',
    '&[data-state="open"]': {
      borderColor: 'color-mix(in srgb, var(--apollo-color-accent) 40%, transparent)',
      boxShadow: 'var(--apollo-shadow-medium)',
    },
  },
  dataAttributes: () => ({
    component: 'accordion-item',
  }),
});

const AccordionHeader = createStyled(AccordionPrimitive.Header, {
  base: {
    margin: 0,
  },
});

const AccordionTrigger = createStyled(AccordionPrimitive.Trigger, {
  base: {
    all: 'unset',
    position: 'relative',
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 'var(--apollo-space-3)',
    paddingInline: 'calc(var(--apollo-space-4) - 2px)',
    paddingBlock: 'calc(var(--apollo-space-3) + 2px)',
    fontFamily: 'var(--apollo-typography-font-family-base)',
    fontSize: 'var(--apollo-typography-size-md)',
    fontWeight: 'var(--apollo-typography-weight-medium)',
    letterSpacing: 'var(--apollo-typography-letter-spacing-tight)',
    color: 'var(--apollo-color-text)',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    transition:
      'background-color var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard), color var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard)',
    '&::after': {
      content: "''",
      width: '12px',
      height: '12px',
      borderRight: '2px solid currentColor',
      borderBottom: '2px solid currentColor',
      transform: 'rotate(45deg)',
      transition: 'transform var(--apollo-motion-duration-fast) var(--apollo-motion-easing-standard)',
    },
    '&[data-state="open"]': {
      color: 'var(--apollo-color-accent)',
      backgroundColor: 'color-mix(in srgb, var(--apollo-color-accent-subtle) 60%, transparent)',
    },
    '&[data-state="open"]::after': {
      transform: 'rotate(225deg)',
    },
    '&:focus-visible': {
      outline: 'none',
      boxShadow: 'var(--apollo-shadow-focus)',
    },
  },
  dataAttributes: () => ({
    component: 'accordion-trigger',
  }),
});

const AccordionContent = createStyled(AccordionPrimitive.Content, {
  base: {
    overflow: 'hidden',
    color: 'var(--apollo-color-text-muted)',
    fontSize: 'var(--apollo-typography-size-sm)',
    lineHeight: 'var(--apollo-typography-line-height-normal)',
    borderTop: '1px solid color-mix(in srgb, var(--apollo-color-border) 60%, transparent)',
    backgroundColor: 'color-mix(in srgb, var(--apollo-color-bg-subtle) 70%, transparent)',
    paddingInline: 'calc(var(--apollo-space-4) - 2px)',
    paddingBlock: 'calc(var(--apollo-space-4) - 2px)',
  },
  dataAttributes: () => ({
    component: 'accordion-content',
  }),
});

export const Accordion = Object.assign(AccordionRoot, {
  Root: AccordionRoot,
  Item: AccordionItem,
  Header: AccordionHeader,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
});

export { AccordionContent, AccordionHeader, AccordionItem, AccordionRoot, AccordionTrigger };
