import { FunnelIcon } from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useId } from "react";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";

import { cn } from "../../lib/utils";

export interface FilterSegment {
  readonly value: string;
  readonly label: string;
  readonly description?: string;
  readonly count?: number;
}

export interface FilterToolbarProps {
  readonly placeholder?: string;
  readonly query?: string;
  readonly onQueryChange?: (next: string) => void;
  readonly segments?: ReadonlyArray<FilterSegment>;
  readonly activeSegment?: string;
  readonly onSegmentChange?: (value: string) => void;
  readonly filters?: ReadonlyArray<{ label: string; value: string; active: boolean; shortcut?: string }>;
  readonly onFilterToggle?: (value: string) => void;
  readonly className?: string;
}

export function FilterToolbar({
  placeholder = "Search reports",
  query = "",
  onQueryChange,
  segments = [],
  activeSegment,
  onSegmentChange,
  filters = [],
  onFilterToggle,
  className,
}: FilterToolbarProps): JSX.Element {
  const searchId = useId();
  const activeFilters = filters.filter((filter) => filter.active).length;

  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-2xl border border-border/60 bg-card/95 p-4 shadow-sm lg:flex-row lg:items-center",
        className,
      )}
    >
      <div className="flex w-full items-center gap-3 rounded-xl border border-border/70 bg-background px-3 py-2">
        <MagnifyingGlassIcon className="h-5 w-5 text-muted-foreground" aria-hidden />
        <Input
          id={searchId}
          type="search"
          value={query}
          onChange={(event) => onQueryChange?.(event.target.value)}
          placeholder={placeholder}
          className="border-0 bg-transparent text-sm focus-visible:ring-0"
          aria-label={placeholder}
        />
      </div>

      {segments.length > 0 ? (
        <div className="flex w-full flex-wrap items-center gap-2">
          {segments.map((segment) => {
            const isActive = segment.value === activeSegment;
            return (
              <Button
                key={segment.value}
                variant={isActive ? "primary" : "ghost"}
                density="relaxed"
                onClick={() => onSegmentChange?.(segment.value)}
                aria-pressed={isActive}
                className={cn(
                  "h-9 rounded-full px-4 text-sm",
                  isActive ? "shadow" : "border border-transparent bg-muted/40",
                )}
              >
                <span>{segment.label}</span>
                {segment.count !== undefined ? (
                  <Badge variant={isActive ? "neutral" : "outline"} className="ml-2">
                    {segment.count}
                  </Badge>
                ) : null}
              </Button>
            );
          })}
        </div>
      ) : null}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full gap-2 bg-background lg:w-auto">
            <FunnelIcon className="h-4 w-4" aria-hidden />
            Filters
            {activeFilters > 0 ? (
              <Badge variant="neutral" className="ml-1">
                {activeFilters}
              </Badge>
            ) : null}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent sideOffset={12} align="end" className="w-64">
          <DropdownMenuLabel>Quick filters</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {filters.map((filter) => (
              <DropdownMenuCheckboxItem
                key={filter.value}
                checked={filter.active}
                onCheckedChange={() => onFilterToggle?.(filter.value)}
              >
                <span className="flex-1 text-sm">{filter.label}</span>
                {filter.shortcut ? <DropdownMenuShortcut>{filter.shortcut}</DropdownMenuShortcut> : null}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem inset className="text-xs text-muted-foreground">
            Tip: Use ⌘K to open the command palette
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
