import {
  forwardRef,
  type HTMLAttributes,
  type SyntheticEvent,
  useMemo,
  useState,
} from "react";
import styled, { css } from "styled-components";

const AVATAR_SIZES = {
  sm: "2.25rem",
  md: "2.75rem",
  lg: "3.5rem",
  xl: "4.25rem",
} as const;

export type AvatarSize = keyof typeof AVATAR_SIZES;

export type AvatarStatus = "none" | "online" | "offline" | "busy";

const statusStyles = {
  none: css`
    display: none;
  `,
  online: css`
    background-color: ${({ theme }) => theme.colors.action.success.solid};
  `,
  offline: css`
    background-color: ${({ theme }) => theme.colors.border.subtle};
  `,
  busy: css`
    background-color: ${({ theme }) => theme.colors.action.danger.solid};
  `,
};

const AvatarRoot = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== "$size" && prop !== "$status",
})<{ readonly $size: AvatarSize; readonly $status: AvatarStatus }>`
  position: relative;
  display: inline-flex;
  width: ${({ $size }) => AVATAR_SIZES[$size]};
  height: ${({ $size }) => AVATAR_SIZES[$size]};
  border-radius: ${({ theme }) => theme.radii.pill};
  overflow: hidden;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.surface.surface};
  color: ${({ theme }) => theme.colors.text.muted};
  font-family: ${({ theme }) => theme.typography.fonts.sans};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  font-size: ${({ theme }) => theme.typography.variants.subtitle.fontSize};
  line-height: 1;

  &[data-has-image="true"] {
    background: transparent;
  }

  &::after {
    content: "";
    position: absolute;
    right: 0.125rem;
    bottom: 0.125rem;
    width: ${({ theme }) => theme.space[3]};
    height: ${({ theme }) => theme.space[3]};
    border-radius: ${({ theme }) => theme.radii.pill};
    border: 2px solid ${({ theme }) => theme.colors.surface.background};
    ${({ $status }) => statusStyles[$status]}
  }
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AvatarFallback = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

export interface AvatarProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "onError"> {
  readonly src?: string;
  readonly alt?: string;
  readonly name?: string;
  readonly size?: AvatarSize;
  readonly status?: AvatarStatus;
  readonly onError?: (event: SyntheticEvent<HTMLImageElement>) => void;
}

function getInitials(name?: string): string {
  if (!name) {
    return "";
  }
  const [first, second] = name.trim().split(/\s+/u);
  const initials = [first, second].filter(Boolean).map((part) => part[0]);
  return initials.join(" ").toUpperCase();
}

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { src, alt, name, size = "md", status = "none", children, onError, ...props },
  ref,
) {
  const [failed, setFailed] = useState(false);
  const shouldRenderImage = src && !failed;
  const fallbackContent = useMemo(() => {
    if (children) {
      return children;
    }
    const initials = getInitials(name ?? alt);
    return initials || "?";
  }, [children, name, alt]);

  function handleError(event: SyntheticEvent<HTMLImageElement>) {
    setFailed(true);
    onError?.(event);
  }

  return (
    <AvatarRoot
      ref={ref}
      role="img"
      aria-label={alt ?? name}
      $size={size}
      $status={status}
      data-size={size}
      data-status={status}
      data-has-image={shouldRenderImage ? "true" : undefined}
      {...props}
    >
      {shouldRenderImage ? (
        <AvatarImage
          src={src}
          alt={alt ?? name ?? ""}
          onError={handleError}
          onLoad={() => setFailed(false)}
        />
      ) : (
        <AvatarFallback aria-hidden="true">{fallbackContent}</AvatarFallback>
      )}
    </AvatarRoot>
  );
});

Avatar.displayName = "Avatar";
