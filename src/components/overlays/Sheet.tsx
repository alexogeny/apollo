import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
  type DialogContentProps,
} from "./Dialog";

export { Dialog as Sheet, DialogTrigger as SheetTrigger, DialogHeader as SheetHeader, DialogFooter as SheetFooter, DialogTitle as SheetTitle, DialogDescription as SheetDescription, DialogClose as SheetClose };

export interface SheetContentProps extends Omit<DialogContentProps, "variant"> {}

export function SheetContent(props: SheetContentProps): JSX.Element {
  return <DialogContent variant="sheet" {...props} />;
}
