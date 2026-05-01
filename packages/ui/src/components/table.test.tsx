import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableContainer,
  TableEmptyState,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  TableRowHeader,
} from "./table.js";

describe("Table", () => {
  it("renders semantic structure for shared dense admin views", () => {
    const markup = renderToStaticMarkup(
      <TableContainer>
        <Table aria-label="Competition review table">
          <TableCaption>Presentational table foundations only.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Competition</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow state="selected">
              <TableRowHeader>Autumn League</TableRowHeader>
              <TableCell>Selected for bulk publish</TableCell>
              <TableCell>Today, 14:10</TableCell>
            </TableRow>
            <TableRow state="warning">
              <TableRowHeader>Junior Open</TableRowHeader>
              <TableCell>2 waivers missing</TableCell>
              <TableCell>8 minutes ago</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>2 competitions shown</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>,
    );

    expect(markup).toContain('data-slot="table-container"');
    expect(markup).toContain('data-slot="table"');
    expect(markup).toContain('data-slot="table-caption"');
    expect(markup).toContain('data-slot="table-header"');
    expect(markup).toContain('data-slot="table-body"');
    expect(markup).toContain('data-slot="table-footer"');
    expect(markup).toContain('data-state="selected"');
    expect(markup).toContain('aria-selected="true"');
    expect(markup).toContain('scope="col"');
    expect(markup).toContain('scope="row"');
  });

  it("supports a reusable empty-state row without workflow-specific behavior", () => {
    const markup = renderToStaticMarkup(
      <Table>
        <TableBody>
          <TableRow>
            <TableEmptyState
              colSpan={4}
              description="Add filters or load data in app space before promoting more behavior."
              eyebrow="Empty table"
              title="No registrations need review"
            />
          </TableRow>
        </TableBody>
      </Table>,
    );

    expect(markup).toContain('data-slot="table-empty-state"');
    expect(markup).toContain('colSpan="4"');
    expect(markup).toContain("No registrations need review");
    expect(markup).toContain("Add filters or load data in app space");
  });

  it("marks invalid rows without relying on color-only signaling", () => {
    const markup = renderToStaticMarkup(
      <Table>
        <TableBody>
          <TableRow aria-label="Invalid registration row" state="invalid">
            <TableRowHeader>Pair 18</TableRowHeader>
            <TableCell>Invalid medical certificate</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    expect(markup).toContain('data-state="invalid"');
    expect(markup).toContain("Invalid medical certificate");
    expect(markup).toContain('aria-label="Invalid registration row"');
  });
});
