import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Separator,
  type SeparatorProps,
  Skeleton,
  badgeVariants,
  buttonVariants,
} from "../src/index.js";

describe("ui package button", () => {
  it("renders a button with the shared default styles", () => {
    const markup = renderToStaticMarkup(<Button>Save changes</Button>);

    expect(markup).toContain("Save changes");
    expect(markup).toContain('type="button"');
    expect(markup).toContain("bg-primary");
  });

  it("supports variant composition and asChild rendering", () => {
    const buttonClassName = buttonVariants({ size: "lg", variant: "outline" });
    const linkMarkup = renderToStaticMarkup(
      <Button asChild>
        <a href="/docs">Read docs</a>
      </Button>,
    );

    expect(buttonClassName).toContain("border");
    expect(linkMarkup).toContain("<a");
    expect(linkMarkup).toContain("Read docs");
  });
});

describe("ui package layout and feedback primitives", () => {
  it("renders card composition helpers from the package entrypoint", () => {
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
    expect(markup).toContain("Shared card");
    expect(markup).toContain("Card footer");
  });

  it("supports badge variants without introducing domain-specific naming", () => {
    const defaultBadgeClassName = badgeVariants({ variant: "default" });
    const outlineBadgeMarkup = renderToStaticMarkup(
      <Badge variant="outline">Shared label</Badge>,
    );

    expect(defaultBadgeClassName).toContain("bg-primary/12");
    expect(outlineBadgeMarkup).toContain('data-slot="badge"');
    expect(outlineBadgeMarkup).toContain("Shared label");
  });

  it("renders decorative skeleton placeholders and semantic separators", () => {
    const skeletonMarkup = renderToStaticMarkup(
      <Skeleton aria-hidden="true" className="h-4 w-24" />,
    );
    const separatorProps: SeparatorProps = {
      decorative: false,
      orientation: "vertical",
    };
    const separatorMarkup = renderToStaticMarkup(
      <Separator {...separatorProps} />,
    );

    expect(skeletonMarkup).toContain("animate-pulse");
    expect(skeletonMarkup).toContain('data-slot="skeleton"');
    expect(separatorMarkup).toContain('data-orientation="vertical"');
    expect(separatorMarkup).toContain('role="separator"');
  });
});
