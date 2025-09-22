import "./setup-dom";
import { afterEach, describe, expect, it } from "bun:test";
import { cleanup, fireEvent, render, waitFor, within } from "@testing-library/react";

import {
  ApolloThemeProvider,
  Avatar,
  Badge,
  Checkbox,
  CommandPalette,
  CommandPaletteTrigger,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  DataTable,
  DatePicker,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
  Progress,
  RadioGroup,
  RadioGroupItem,
  Skeleton,
  Spinner,
  Switch,
  ToastProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useToast,
} from "../src";

afterEach(() => cleanup());

function renderWithProvider(ui: JSX.Element) {
  return render(<ApolloThemeProvider>{ui}</ApolloThemeProvider>);
}

describe("Form primitives", () => {
  it("toggles checkbox state", () => {
    const { getByLabelText } = renderWithProvider(<Checkbox label="Accept" />);
    const checkbox = getByLabelText("Accept") as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
  });

  it("updates radio group selection", () => {
    const { getByLabelText } = renderWithProvider(
      <RadioGroup defaultValue="a">
        <RadioGroupItem value="a" label="Option A" />
        <RadioGroupItem value="b" label="Option B" />
      </RadioGroup>
    );
    const optionB = getByLabelText("Option B") as HTMLInputElement;
    expect(optionB.checked).toBe(false);
    fireEvent.click(optionB);
    expect(optionB.checked).toBe(true);
  });

  it("reflects switch aria state", () => {
    const { getByRole } = renderWithProvider(<Switch label="Notifications" defaultChecked />);
    const toggle = getByRole("switch");
    expect(toggle.getAttribute("aria-checked")).toBe("true");
    fireEvent.click(toggle);
    expect(toggle.getAttribute("aria-checked")).toBe("false");
  });
});

describe("Feedback primitives", () => {
  it("renders skeleton placeholder", () => {
    const { getByTestId } = renderWithProvider(
      <Skeleton data-testid="skeleton" width="120px" />
    );
    expect(getByTestId("skeleton")).toBeTruthy();
  });

  it("shows avatar fallback when image missing", () => {
    const { getByRole } = renderWithProvider(<Avatar name="Ada Lovelace" />);
    const avatar = getByRole("img");
    expect(avatar.textContent?.trim()).toBe("A L");
  });

  it("renders badge tone", () => {
    const { getByText } = renderWithProvider(<Badge tone="accent">Beta</Badge>);
    expect(getByText("Beta").getAttribute("data-tone")).toBe("accent");
  });

  it("displays toast via hook", async () => {
    function Demo(): JSX.Element {
      const { publish } = useToast();
      return (
        <button
          type="button"
          onClick={() => publish({ title: "Saved", description: "Profile updated" })}
        >
          Trigger Toast
        </button>
      );
    }

    const utils = renderWithProvider(
      <ToastProvider>
        <Demo />
      </ToastProvider>
    );

    fireEvent.click(utils.getByText("Trigger Toast"));
    await waitFor(() => {
      expect(utils.getByText("Saved")).toBeTruthy();
      expect(utils.getByText("Profile updated")).toBeTruthy();
    });
  });
});

describe("Overlay components", () => {
  it("opens and closes dialog", () => {
    const utils = renderWithProvider(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Confirm</DialogTitle>
          <DialogDescription>Are you sure?</DialogDescription>
        </DialogContent>
      </Dialog>
    );

    fireEvent.click(utils.getByText("Open"));
    const bodyQueries = within(utils.baseElement);
    expect(bodyQueries.getByRole("dialog")).toBeTruthy();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(bodyQueries.queryByRole("dialog")).toBeNull();
  });

  it("supports dropdown item selection", () => {
    let count = 0;
    const onSelect = () => {
      count += 1;
    };
    const utils = renderWithProvider(
      <Dropdown>
        <DropdownTrigger>Menu</DropdownTrigger>
        <DropdownContent>
          <DropdownItem onClick={onSelect}>Profile</DropdownItem>
        </DropdownContent>
      </Dropdown>
    );

    fireEvent.click(utils.getByText("Menu"));
    const item = within(utils.baseElement).getByRole("menuitem", { name: "Profile" });
    fireEvent.click(item);
    expect(count).toBe(1);
  });

  it("shows tooltip content on focus", async () => {
    const utils = renderWithProvider(
      <Tooltip>
        <TooltipTrigger>
          <button type="button">Hint</button>
        </TooltipTrigger>
        <TooltipContent>Helpful text</TooltipContent>
      </Tooltip>
    );

    fireEvent.focus(utils.getByText("Hint"));
    await waitFor(() =>
      expect(within(utils.baseElement).getByRole("tooltip")).toBeTruthy()
    );
  });

  it("renders context menu on right click", () => {
    const utils = renderWithProvider(
      <ContextMenu>
        <ContextMenuTrigger>
          <button type="button">Target</button>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Copy</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );

    fireEvent.contextMenu(utils.getByText("Target"));
    expect(within(utils.baseElement).getByRole("menuitem", { name: "Copy" })).toBeTruthy();
  });
});

describe("Data components", () => {
  interface Row {
    readonly id: number;
    readonly name: string;
  }

  const rows: Row[] = [
    { id: 1, name: "Zelda" },
    { id: 2, name: "Alfred" },
  ];

  it("sorts data table rows", () => {
    const utils = renderWithProvider(
      <DataTable
        data={rows}
        columns={[
          { id: "name", header: "Name", accessor: (row) => row.name, sortable: true },
        ]}
      />
    );

    const headerButton = utils
      .getByRole("columnheader", { name: /name/i })
      .querySelector("button");
    expect(headerButton).not.toBeNull();
    fireEvent.click(headerButton!);
    const cells = utils.getAllByRole("cell");
    expect(cells[0].textContent).toBe("Alfred");
  });
});

describe("Utilities", () => {
  it("updates progress aria attributes", () => {
    const utils = renderWithProvider(<Progress value={40} label="Uploading" />);
    const progress = utils.getByRole("progressbar");
    expect(progress.getAttribute("aria-valuenow")).toBe("40");
    expect(progress.getAttribute("aria-label")).toBe("Uploading");
  });

  it("announces spinner status", () => {
    const utils = renderWithProvider(<Spinner label="Loading" />);
    expect(utils.getByRole("status")).toBeTruthy();
  });
});

describe("Date picker", () => {
  it("selects a date and closes", async () => {
    const utils = renderWithProvider(<DatePicker />);
    const trigger = utils.getByRole("button", { name: /select a date/i });
    fireEvent.click(trigger);
    const dayButton = await within(utils.baseElement).findByRole("gridcell", { name: "15" });
    fireEvent.click(dayButton);
    await waitFor(() => {
      expect(trigger.textContent ?? "").toMatch(/\d{4}/);
    });
  });
});

describe("Command palette", () => {
  it("opens via keyboard shortcut", async () => {
    function Palette(): JSX.Element {
      const commands = [
        { id: "one", title: "Open", onSelect: () => undefined, shortcut: ["Enter"] },
      ];
      return (
        <CommandPalette commands={commands}>
          <CommandPaletteTrigger>Launch</CommandPaletteTrigger>
        </CommandPalette>
      );
    }

    const utils = renderWithProvider(<Palette />);
    fireEvent.keyDown(window, { key: "k", metaKey: true });
    await waitFor(() => expect(within(utils.baseElement).getByRole("dialog")).toBeTruthy());
  });
});
