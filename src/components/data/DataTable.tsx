import { type ReactNode, useMemo, useState } from "react";
import styled from "styled-components";

export type DataTableAlign = "left" | "center" | "right";

export interface DataTableColumn<T> {
  readonly id?: string;
  readonly header: ReactNode;
  readonly accessor: keyof T | ((row: T) => ReactNode);
  readonly sortable?: boolean;
  readonly align?: DataTableAlign;
  readonly cell?: (row: T) => ReactNode;
}

export type SortDirection = "asc" | "desc";

export interface DataTableSortState {
  readonly columnId: string;
  readonly direction: SortDirection;
}

export interface DataTableProps<T> {
  readonly data: readonly T[];
  readonly columns: readonly DataTableColumn<T>[];
  readonly caption?: ReactNode;
  readonly getRowId?: (row: T, index: number) => string;
  readonly sortState?: DataTableSortState | null;
  readonly onSortChange?: (state: DataTableSortState | null) => void;
}

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
`;

const Caption = styled.caption`
  text-align: left;
  padding: ${({ theme }) => theme.space[3]};
  font-family: ${({ theme }) => theme.typography.fonts.sans};
  font-size: ${({ theme }) => theme.typography.variants.detail.fontSize};
  color: ${({ theme }) => theme.colors.text.muted};
`;

const HeaderCell = styled.th<{ readonly $align: DataTableAlign }>`
  text-align: ${({ $align }) => $align};
  padding: ${({ theme }) => `${theme.space[3]} ${theme.space[4]}`};
  background: ${({ theme }) => theme.colors.surface.surfaceRaised};
  font-family: ${({ theme }) => theme.typography.fonts.sans};
  font-size: ${({ theme }) => theme.typography.variants.bodySm.fontSize};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.subtle};
  position: relative;
  user-select: none;
`;

const SortIndicator = styled.span`
  margin-left: ${({ theme }) => theme.space[2]};
  font-size: 0.75rem;
`;

const BodyRow = styled.tr`
  &:nth-child(even) {
    background: ${({ theme }) => theme.colors.surface.surfaceSunken};
  }
`;

const Cell = styled.td<{ readonly $align: DataTableAlign }>`
  text-align: ${({ $align }) => $align};
  padding: ${({ theme }) => `${theme.space[3]} ${theme.space[4]}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.subtle};
  font-family: ${({ theme }) => theme.typography.fonts.sans};
  font-size: ${({ theme }) => theme.typography.variants.body.fontSize};
  line-height: ${({ theme }) => theme.typography.variants.body.lineHeight};
`;

function resolveColumnId<T>(column: DataTableColumn<T>, index: number): string {
  if (column.id) {
    return column.id;
  }
  if (typeof column.accessor === "string") {
    return column.accessor as string;
  }
  return `column-${index}`;
}

function resolveValue<T>(column: DataTableColumn<T>, row: T): unknown {
  if (column.cell) {
    return column.cell(row);
  }
  if (typeof column.accessor === "function") {
    return column.accessor(row);
  }
  return row[column.accessor];
}

function getCellValue<T>(column: DataTableColumn<T>, row: T): ReactNode {
  const value = resolveValue(column, row);
  return value as ReactNode;
}

export function DataTable<T>({
  data,
  columns,
  caption,
  getRowId,
  sortState,
  onSortChange,
}: DataTableProps<T>): JSX.Element {
  const [internalSort, setInternalSort] = useState<DataTableSortState | null>(null);
  const activeSort = sortState ?? internalSort;

  const sortedData = useMemo(() => {
    if (!activeSort) {
      return data;
    }
    const columnIndex = columns.findIndex((column, index) => resolveColumnId(column, index) === activeSort.columnId);
    if (columnIndex === -1) {
      return data;
    }
    const column = columns[columnIndex];
    if (!column.sortable) {
      return data;
    }
    return [...data].sort((a, b) => {
      const aValue = resolveValue(column, a);
      const bValue = resolveValue(column, b);
      const aText = typeof aValue === "number" ? aValue : String(aValue ?? "");
      const bText = typeof bValue === "number" ? bValue : String(bValue ?? "");
      if (aText < bText) {
        return activeSort.direction === "asc" ? -1 : 1;
      }
      if (aText > bText) {
        return activeSort.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [activeSort, columns, data]);

  const handleSort = (column: DataTableColumn<T>, columnId: string) => {
    if (!column.sortable) {
      return;
    }
    const nextSort: DataTableSortState | null = activeSort?.columnId === columnId
      ? activeSort.direction === "asc"
        ? { columnId, direction: "desc" }
        : null
      : { columnId, direction: "asc" };
    if (sortState === undefined) {
      setInternalSort(nextSort);
    }
    onSortChange?.(nextSort);
  };

  return (
    <Table role="table">
      {caption ? <Caption>{caption}</Caption> : null}
      <thead>
        <tr>
          {columns.map((column, index) => {
            const columnId = resolveColumnId(column, index);
            const align = column.align ?? "left";
            const isSorted = activeSort?.columnId === columnId;
            const direction = activeSort?.direction ?? "asc";
            return (
              <HeaderCell key={columnId} scope="col" $align={align} aria-sort={isSorted ? `${direction}ending` : "none"}>
                {column.sortable ? (
                  <button
                    type="button"
                    onClick={() => handleSort(column, columnId)}
                    style={{
                      all: "unset",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                    }}
                  >
                    {column.header}
                    {isSorted ? <SortIndicator>{direction === "asc" ? "▲" : "▼"}</SortIndicator> : null}
                  </button>
                ) : (
                  column.header
                )}
              </HeaderCell>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {sortedData.map((row, rowIndex) => {
          const key = getRowId ? getRowId(row, rowIndex) : String(rowIndex);
          return (
            <BodyRow key={key}>
              {columns.map((column, columnIndex) => {
                const columnId = resolveColumnId(column, columnIndex);
                const align = column.align ?? "left";
                const cell = getCellValue(column, row);
                return (
                  <Cell key={columnId} $align={align} role="cell">
                    {cell}
                  </Cell>
                );
              })}
            </BodyRow>
          );
        })}
      </tbody>
    </Table>
  );
}
