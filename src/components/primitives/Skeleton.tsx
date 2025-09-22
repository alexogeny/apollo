import { forwardRef, type CSSProperties, type HTMLAttributes } from "react";
import styled, { css, keyframes } from "styled-components";

import type { RadiusToken } from "../../theme/tokens";

const shimmer = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
`;

const SkeletonRoot = styled.span.withConfig({
  shouldForwardProp: (prop) => !prop.startsWith("$"),
})<{ readonly $radius: RadiusToken }>`
  position: relative;
  display: inline-block;
  background-color: ${({ theme }) => theme.colors.surface.surfaceSunken};
  overflow: hidden;
  border-radius: ${({ theme, $radius }) => theme.radii[$radius]};
  min-height: 0.75rem;
  line-height: 0;
  width: 100%;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    transform: translateX(-100%);
    background: linear-gradient(
      90deg,
      transparent,
      ${({ theme }) => theme.colors.surface.surfaceRaised},
      transparent
    );
    ${({ theme }) =>
      theme.motion.reduced
        ? css`
            animation: none;
          `
        : css`
            animation-name: ${shimmer};
            animation-duration: ${theme.motion.duration.slow};
            animation-timing-function: ${theme.motion.easing.emphasized};
            animation-iteration-count: infinite;
          `};
  }
`;

export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  readonly radius?: RadiusToken;
  readonly width?: string | number;
  readonly height?: string | number;
  readonly inline?: boolean;
}

export const Skeleton = forwardRef<HTMLSpanElement, SkeletonProps>(function Skeleton(
  { radius = "md", width = "100%", height, style, inline = false, ...props },
  ref,
) {
  const dimensionStyle: CSSProperties = {
    width,
    height,
    display: inline ? "inline-block" : "block",
    ...style,
  };

  return <SkeletonRoot ref={ref} $radius={radius} style={dimensionStyle} {...props} />;
});

Skeleton.displayName = "Skeleton";
