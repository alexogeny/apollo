import { type ReactNode } from "react";

import { Stack, Text } from "@apollo/ui";

export interface SectionProps {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly children: ReactNode;
}

export function Section({ id, title, description, children }: SectionProps): JSX.Element {
  return (
    <Stack
      as="section"
      id={id}
      gap="5"
      aria-labelledby={`${id}-title`}
      style={{ scrollMarginTop: "96px" }}
    >
      <Stack gap="1">
        <Text as="h2" id={`${id}-title`} variant="title" weight="semibold">
          {title}
        </Text>
        <Text as="p" variant="body" color="secondary">
          {description}
        </Text>
      </Stack>
      {children}
    </Stack>
  );
}
