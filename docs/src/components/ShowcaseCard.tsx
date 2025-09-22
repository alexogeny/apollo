import { type ReactNode } from "react";

import { Card, Stack, Text } from "@apollo/ui";
import styled from "styled-components";

export interface ShowcaseCardProps {
  readonly title: string;
  readonly description: string;
  readonly children: ReactNode;
  readonly tone?: "neutral" | "accent";
}

const StyledShowcaseCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space["5"]};
  padding: ${({ theme }) => theme.space["6"]};
  border-radius: ${({ theme }) => theme.radii.xl};
  border-color: ${({ theme }) => theme.colors.border.subtle};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  background-color: ${({ theme }) => theme.colors.surface.surfaceRaised};
  transition: ${({ theme }) =>
    theme.motion.reduced
      ? "none"
      : `transform ${theme.motion.duration.fast} ${theme.motion.easing.emphasized}`};

  @media (prefers-reduced-motion: no-preference) {
    &:hover {
      transform: translateY(-2px);
    }
  }

  &[data-tone="accent"] {
    color: ${({ theme }) => theme.colors.action.accent.subtleForeground};
    border-color: ${({ theme }) => theme.colors.action.accent.outline};
    background-color: ${({ theme }) => theme.colors.action.accent.subtle};
    background-image: ${({ theme }) => `radial-gradient(
        120% 140% at 0% 0%,
        color-mix(in srgb, ${theme.colors.action.accent.subtle} 60%, transparent) 0%,
        transparent 70%
      ),
      radial-gradient(
        120% 120% at 100% 0%,
        color-mix(in srgb, ${theme.colors.action.accent.solid} 28%, transparent) 0%,
        transparent 65%
      )`};
  }
`;

export function ShowcaseCard({
  title,
  description,
  children,
  tone = "neutral",
}: ShowcaseCardProps): JSX.Element {
  return (
    <StyledShowcaseCard
      as="article"
      tone={tone}
      radius="xl"
      shadow="sm"
      border={tone === "accent" ? "strong" : "subtle"}
      background={tone === "accent" ? undefined : "surfaceRaised"}
    >
      <Stack gap="4" style={{ flex: "1 1 auto" }}>
        <Stack gap="1">
          <Text as="h3" variant="subtitle" weight="semibold">
            {title}
          </Text>
          <Text as="p" variant="body" color="secondary">
            {description}
          </Text>
        </Stack>
        {children}
      </Stack>
    </StyledShowcaseCard>
  );
}
