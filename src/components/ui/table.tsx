import { type HTMLAttributes } from "react";

import { cn } from "../../lib/utils";

export function Table({ className, ...props }: HTMLAttributes<HTMLTableElement>): JSX.Element {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-border/60 bg-card">
      <table className={cn("w-full caption-bottom text-sm", className)} {...props} />
    </div>
  );
}

export function TableHeader({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>): JSX.Element {
  return <thead className={cn("[&_tr]:border-b", className)} {...props} />;
}

export function TableBody({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>): JSX.Element {
  return <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />;
}

export function TableFooter({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>): JSX.Element {
  return <tfoot className={cn("bg-muted/80 font-medium text-muted-foreground", className)} {...props} />;
}

export function TableRow({ className, ...props }: HTMLAttributes<HTMLTableRowElement>): JSX.Element {
  return (
    <tr
      className={cn(
        "border-b border-border/60 transition-colors hover:bg-muted/60 data-[state=selected]:bg-muted",
        className,
      )}
      {...props}
    />
  );
}

export function TableHead({ className, ...props }: HTMLAttributes<HTMLTableCellElement>): JSX.Element {
  return (
    <th
      className={cn(
        "h-12 px-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground align-middle",
        className,
      )}
      scope="col"
      {...props}
    />
  );
}

export function TableCell({ className, ...props }: HTMLAttributes<HTMLTableCellElement>): JSX.Element {
  return (
    <td className={cn("p-4 align-middle text-sm text-foreground", className)} {...props} />
  );
}

export function TableCaption({ className, ...props }: HTMLAttributes<HTMLTableCaptionElement>): JSX.Element {
  return (
    <caption className={cn("mt-4 text-sm text-muted-foreground", className)} {...props} />
  );
}
