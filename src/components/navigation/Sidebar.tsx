import {
  forwardRef,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
  type Ref,
  type HTMLAttributeAnchorTarget,
} from "react";
import styled, { css } from "styled-components";

import type { ActionTone, ApolloTheme } from "../../theme/tokens";
import { Badge, type BadgeVariant } from "../primitives/Badge";
import { Text } from "../primitives/Text";

interface SidebarContainerProps {
  readonly $width: string;
}

const SidebarContainer = styled.aside.withConfig({
  shouldForwardProp: (prop) => prop !== "$width",
})<SidebarContainerProps>`
  display: flex;
  flex-direction: column;
  width: ${({ $width }) => $width};
  max-width: 100%;
  min-height: 100%;
  background: ${({ theme }) => theme.colors.surface.surface};
  border-right: 1px solid ${({ theme }) => theme.colors.border.subtle};
  padding: ${({ theme }) => `${theme.space["6"]} ${theme.space["5"]}`};
  gap: ${({ theme }) => theme.space["6"]};
  color: ${({ theme }) => theme.colors.text.primary};
  box-shadow: ${({ theme }) => theme.shadows.xs};
  transition: ${({ theme }) =>
    theme.motion.reduced
      ? "none"
      : `box-shadow ${theme.motion.duration.fast} ${theme.motion.easing.standard}`};
  background-image: ${({ theme }) =>
    `radial-gradient(140% 100% at 0% 0%, ${theme.colors.surface.surfaceRaised} 0%, transparent 70%)`};
`;

const SidebarHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space["3"]};
`;

const SidebarFooter = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space["3"]};
`;

const Navigation = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space["6"]};
  flex: 1 1 auto;
  min-height: 0;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space["3"]};
`;

const SectionHeading = styled(Text).attrs({
  as: "h2",
  variant: "detail",
  weight: "semibold",
  color: "secondary",
})`
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 0;
  display: block;
`;

const ItemList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space["1"]};
`;

interface ItemStyleProps {
  readonly $active: boolean;
  readonly $disabled: boolean;
}

const itemStyles = ({ theme, $active, $disabled }: ItemStyleProps & { theme: ApolloTheme }) => css`
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: ${theme.space["3"]};
  width: 100%;
  padding: ${`${theme.space["2"]} ${theme.space["3"]}`};
  border-radius: ${theme.radii.lg};
  background-color: ${$active ? theme.colors.surface.surfaceRaised : "transparent"};
  color: ${$active ? theme.colors.text.primary : theme.colors.text.secondary};
  font-family: ${theme.typography.fonts.sans};
  font-size: ${theme.typography.variants.bodySm.fontSize};
  line-height: ${theme.typography.variants.bodySm.lineHeight};
  letter-spacing: ${theme.typography.variants.bodySm.letterSpacing};
  text-decoration: none;
  text-align: left;
  border: none;
  cursor: ${$disabled ? "not-allowed" : "pointer"};
  pointer-events: ${$disabled ? "none" : "auto"};
  opacity: ${$disabled ? 0.55 : 1};
  transition: ${
    theme.motion.reduced
      ? "none"
      : `background-color ${theme.motion.duration.fast} ${theme.motion.easing.standard}, color ${theme.motion.duration.fast} ${theme.motion.easing.standard}, transform ${theme.motion.duration.fast} ${theme.motion.easing.emphasized}`
  };

  ${!$disabled
    ? css`
        &:hover {
          background-color: ${$active
            ? theme.colors.surface.surfaceRaised
            : theme.colors.surface.surfaceSunken};
          color: ${theme.colors.text.primary};
        }
        &:active {
          background-color: ${theme.colors.surface.surfaceRaised};
        }
      `
    : undefined}

  &:focus-visible {
    outline: none;
    box-shadow:
      0 0 0 1px ${theme.colors.surface.background},
      0 0 0 4px ${theme.colors.states.focusRing};
    ${theme.motion.reduced ? "" : "transform: translateY(-1px);"}
  }
`;

const ItemButton = styled.button<ItemStyleProps>`
  ${itemStyles}
`;

const ItemLink = styled.a<ItemStyleProps>`
  ${itemStyles}
`;

const IconSlot = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: inherit;
  width: 1.5rem;
  height: 1.5rem;
`;

const ItemContent = styled.span`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space["1"]};
  min-width: 0;
`;

const ItemLabel = styled(Text).attrs({
  as: "span",
  variant: "bodySm",
  weight: "semibold",
})`
  color: inherit;
`;

const ItemDescription = styled(Text).attrs({
  as: "span",
  variant: "detail",
  color: "muted",
})`
  display: block;
`;

export interface SidebarItemBadge {
  readonly label: string;
  readonly tone?: ActionTone;
  readonly variant?: BadgeVariant;
}

export interface SidebarNavItem {
  readonly id: string;
  readonly label: string;
  readonly description?: string;
  readonly icon?: ReactNode;
  readonly badge?: SidebarItemBadge;
  readonly href?: string;
  readonly target?: HTMLAttributeAnchorTarget;
  readonly rel?: string;
  readonly disabled?: boolean;
  readonly onSelect?: (itemId: string) => void;
}

export interface SidebarSection {
  readonly id: string;
  readonly title?: string;
  readonly items: ReadonlyArray<SidebarNavItem>;
}

export interface SidebarProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  readonly header?: ReactNode;
  readonly footer?: ReactNode;
  readonly sections: ReadonlyArray<SidebarSection>;
  readonly activeItemId?: string;
  readonly onItemSelect?: (itemId: string) => void;
  readonly ariaLabel?: string;
  readonly width?: string;
}

export const Sidebar = forwardRef<HTMLElement, SidebarProps>(function Sidebar(
  {
    header,
    footer,
    sections,
    activeItemId,
    onItemSelect,
    ariaLabel = "Primary navigation",
    width = "280px",
    className,
    ...rest
  },
  ref,
) {
  const handleClick = (event: MouseEvent<HTMLElement>, item: SidebarNavItem) => {
    if (item.disabled) {
      event.preventDefault();
      return;
    }
    onItemSelect?.(item.id);
    item.onSelect?.(item.id);
  };

  return (
    <SidebarContainer ref={ref as Ref<HTMLElement>} className={className} $width={width} {...rest}>
      {header ? <SidebarHeader>{header}</SidebarHeader> : null}
      <Navigation aria-label={ariaLabel}>
        {sections.map((section) => (
          <Section key={section.id} aria-labelledby={`${section.id}-heading`}>
            {section.title ? (
              <SectionHeading id={`${section.id}-heading`}>
                {section.title}
              </SectionHeading>
            ) : null}
            <ItemList role="list">
              {section.items.map((item) => {
                const isActive = activeItemId === item.id;
                const badge = item.badge;
                const content = (
                  <>
                    <IconSlot aria-hidden={item.icon ? "true" : undefined}>
                      {item.icon ?? null}
                    </IconSlot>
                    <ItemContent>
                      <ItemLabel>{item.label}</ItemLabel>
                      {item.description ? (
                        <ItemDescription>{item.description}</ItemDescription>
                      ) : null}
                    </ItemContent>
                    {badge ? (
                      <Badge variant={badge.variant ?? "subtle"} tone={badge.tone ?? "accent"}>
                        {badge.label}
                      </Badge>
                    ) : null}
                  </>
                );

                if (item.href) {
                  return (
                    <li key={item.id} role="listitem">
                      <ItemLink
                        href={item.href}
                        target={item.target}
                        rel={item.rel}
                        $active={isActive}
                        $disabled={item.disabled ?? false}
                        aria-current={isActive ? "page" : undefined}
                        aria-disabled={item.disabled ? "true" : undefined}
                        data-active={isActive ? "true" : undefined}
                        tabIndex={item.disabled ? -1 : undefined}
                        onClick={(event) => handleClick(event, item)}
                      >
                        {content}
                      </ItemLink>
                    </li>
                  );
                }

                return (
                  <li key={item.id} role="listitem">
                    <ItemButton
                      type="button"
                      $active={isActive}
                      $disabled={item.disabled ?? false}
                      aria-pressed={isActive ? true : undefined}
                      aria-disabled={item.disabled ? "true" : undefined}
                      data-active={isActive ? "true" : undefined}
                      disabled={item.disabled}
                      onClick={(event) => {
                        handleClick(event, item);
                      }}
                    >
                      {content}
                    </ItemButton>
                  </li>
                );
              })}
            </ItemList>
          </Section>
        ))}
      </Navigation>
      {footer ? <SidebarFooter>{footer}</SidebarFooter> : null}
    </SidebarContainer>
  );
});

Sidebar.displayName = "Sidebar";
