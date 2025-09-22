import { type ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

export interface PortalProps {
  readonly children: ReactNode;
  readonly container?: HTMLElement | null;
}

function getDefaultContainer(): HTMLElement | null {
  if (typeof document === "undefined") {
    return null;
  }
  return document.body;
}

export function Portal({ children, container }: PortalProps): JSX.Element | null {
  const [mountNode, setMountNode] = useState<HTMLElement | null>(() =>
    container ?? getDefaultContainer(),
  );

  useEffect(() => {
    setMountNode(container ?? getDefaultContainer());
  }, [container]);

  if (mountNode == null) {
    return null;
  }

  return createPortal(children, mountNode);
}
