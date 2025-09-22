import { type ReactNode } from "react";

import { Card, Stack, Text } from "@apollo/ui";

export interface ShowcaseCardProps {
  readonly title: string;
  readonly description: string;
  readonly children: ReactNode;
  readonly tone?: "neutral" | "accent";
}

export function ShowcaseCard({
  title,
  description,
  children,
  tone = "neutral",
}: ShowcaseCardProps): JSX.Element {
  return (
    <Card
      as="article"
      tone={tone}
      padding="6"
      radius="xl"
      shadow="sm"
      border={tone === "accent" ? "strong" : "subtle"}
      style={{ flex: "1 1 300px" }}
    >
      <Stack gap="4">
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
    </Card>
  );
}
