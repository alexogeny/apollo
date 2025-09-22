import { type MutableRefObject, type Ref } from "react";

export function setRef<T>(ref: Ref<T> | null | undefined, value: T | null): void {
  if (!ref) {
    return;
  }
  if (typeof ref === "function") {
    ref(value);
  } else {
    (ref as MutableRefObject<T | null>).current = value;
  }
}
