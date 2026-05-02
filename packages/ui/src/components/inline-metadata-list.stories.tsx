import type { Meta, StoryObj } from "@storybook/react";
import { InlineMetadataList } from "./inline-metadata-list.js";

const meta: Meta<typeof InlineMetadataList> = {
  title: "Shared/Data Display/Inline Metadata List",
  component: InlineMetadataList,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Compact operational facts for competition and review surfaces. Keep the component focused on concise metadata rather than turning it into a full workflow panel.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <InlineMetadataList
      className="w-[760px] max-w-full"
      items={[
        { label: "Format", value: "Round robin", emphasize: true },
        { label: "Registration window", value: "May 4 to May 19" },
        { label: "Court cluster", value: "North club" },
        { label: "Organizer", value: "Damian Medina" },
      ]}
    />
  ),
};

export const DenseAdminRow: Story = {
  render: () => (
    <InlineMetadataList
      className="w-[860px] max-w-full"
      items={[
        { label: "Competition", value: "Autumn League A", emphasize: true },
        { label: "Pairs approved", value: "18 of 24", tone: "success" },
        { label: "Needs review", value: "3 registrations", tone: "warning" },
        { label: "Results pending", value: "2 matches", tone: "danger" },
        { label: "Last sync", value: "4 minutes ago", tone: "muted" },
      ]}
    />
  ),
};

export const WithFallbackValues: Story = {
  render: () => (
    <InlineMetadataList
      className="w-[720px] max-w-full"
      items={[
        { label: "Lead referee", value: "Marina Costa" },
        { label: "Weather plan" },
        {
          label: "Player notes",
          hint: "No note is better than ambiguous note text in dense admin UI.",
        },
      ]}
    />
  ),
};
