import { BellIcon, DotsHorizontalIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { forwardRef } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

import { cn } from "../../lib/utils";
import { useTheme } from "../../providers/theme-provider";

export interface DashboardBreadcrumb {
  readonly id: string;
  readonly label: string;
  readonly href?: string;
}

export interface DashboardAction {
  readonly id: string;
  readonly label: string;
  readonly onSelect: () => void;
}

export interface DashboardHeaderProps {
  readonly breadcrumbs?: ReadonlyArray<DashboardBreadcrumb>;
  readonly title: string;
  readonly description?: string;
  readonly lastUpdated?: string;
  readonly onCreateReport?: () => void;
  readonly overflowActions?: ReadonlyArray<DashboardAction>;
  readonly notificationsCount?: number;
  readonly className?: string;
  readonly team?: {
    readonly name: string;
    readonly members: ReadonlyArray<{ name: string; avatar?: string }>;
  };
}

export const DashboardHeader = forwardRef<HTMLDivElement, DashboardHeaderProps>(
  (
    {
      breadcrumbs = [],
      title,
      description,
      lastUpdated,
      onCreateReport,
      overflowActions = [],
      notificationsCount = 0,
      className,
      team,
    },
    ref,
  ) => {
    const { scheme, setSchemePreference } = useTheme();

    return (
      <header
        ref={ref}
        className={cn(
          "flex flex-col gap-6 rounded-3xl border border-border/60 bg-gradient-to-br from-background via-background/95 to-muted/40 p-6 shadow-sm",
          className,
        )}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground">
            {breadcrumbs.map((crumb, index) => (
              <span key={crumb.id} className="flex items-center gap-2">
                {crumb.href ? (
                  <a href={crumb.href} className="hover:text-foreground">
                    {crumb.label}
                  </a>
                ) : (
                  <span aria-current={index === breadcrumbs.length - 1 ? "page" : undefined}>{crumb.label}</span>
                )}
                {index < breadcrumbs.length - 1 ? <span aria-hidden>›</span> : null}
              </span>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={scheme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
                    onClick={() =>
                      setSchemePreference((prev) => (prev === "dark" ? "light" : prev === "light" ? "dark" : scheme === "dark" ? "light" : "dark"))
                    }
                  >
                    {scheme === "dark" ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Toggle theme</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button variant="ghost" size="icon" aria-label="View notifications" className="relative">
              <BellIcon className="h-4 w-4" />
              {notificationsCount > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-[16px] translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
                  {notificationsCount}
                </span>
              ) : null}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open overflow menu">
                  <DotsHorizontalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Quick actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {overflowActions.map((action) => (
                  <DropdownMenuItem key={action.id} onSelect={action.onSelect}>
                    {action.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-semibold text-foreground">{title}</h1>
              {lastUpdated ? <Badge variant="neutral">Updated {lastUpdated}</Badge> : null}
            </div>
            {description ? <p className="max-w-3xl text-base text-muted-foreground">{description}</p> : null}
            {team ? (
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{team.name}</span>
                <div className="flex -space-x-2">
                  {team.members.slice(0, 4).map((member, index) => (
                    <Avatar key={member.name} className="border-2 border-background">
                      {member.avatar ? <AvatarImage src={member.avatar} alt={member.name} /> : null}
                      <AvatarFallback>{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                {team.members.length > 4 ? (
                  <span className="text-xs text-muted-foreground">
                    +{team.members.length - 4} more contributors
                  </span>
                ) : null}
              </div>
            ) : null}
          </div>
          <div className="flex flex-col items-stretch justify-end gap-2 sm:flex-row">
            <Button variant="ghost" className="justify-between gap-2 border border-border/60 bg-background/60">
              Download
            </Button>
            <Button onClick={onCreateReport} className="gap-2">
              Create report
            </Button>
          </div>
        </div>
      </header>
    );
  },
);

DashboardHeader.displayName = "DashboardHeader";
