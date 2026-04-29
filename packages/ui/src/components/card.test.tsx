import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card.js";

describe("Card", () => {
  it("renders the shared composition helpers", () => {
    const markup = renderToStaticMarkup(
      <Card>
        <CardHeader>
          <CardTitle>Shared card</CardTitle>
          <CardDescription>Reusable structure only.</CardDescription>
        </CardHeader>
        <CardContent>Card body</CardContent>
        <CardFooter>Card footer</CardFooter>
      </Card>,
    );

    expect(markup).toContain('data-slot="card"');
    expect(markup).toContain('data-slot="card-header"');
    expect(markup).toContain('data-slot="card-title"');
    expect(markup).toContain('data-slot="card-description"');
    expect(markup).toContain('data-slot="card-content"');
    expect(markup).toContain('data-slot="card-footer"');
  });
});
