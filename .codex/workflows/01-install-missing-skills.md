# Workflow: Install Missing Skills

## Source

https://github.com/VoltAgent/awesome-agent-skills

## Target

.codex/skills

## Import these skills

- vercel-labs/react-best-practices
- vercel-labs/composition-patterns
- vercel-labs/next-best-practices
- vercel-labs/web-design-guidelines
- google-labs-code/shadcn-ui
- google-labs-code/design-md
- google-labs-code/react-components
- openai/figma-create-design-system-rules
- openai/figma-generate-library
- openai/figma-implement-design
- anthropics/frontend-design
- callstackincubator/github
- coderabbitai/skills

## Create custom skills if missing

- radix-accessibility-patterns
- storybook-design-system
- storybook-interaction-testing
- tanstack-router-patterns
- tanstack-query-patterns
- tanstack-form-zod-patterns
- tanstack-store-patterns
- ui-package-boundaries
- component-api-governance
- design-token-governance
- github-projects-ticketing
- github-projects-sprint-planning

## Tasks

1. Clone the source repo into `.codex/.tmp/awesome-agent-skills`.
2. Locate each imported skill.
3. Copy each found skill into `.codex/skills/<skill-name>`.
4. For missing/custom skills, create `.codex/skills/<skill-name>/SKILL.md`.
5. Add `Source:` and `Origin:` metadata to each skill.
6. Generate `docs/00-setup/skills-inventory.md`.
7. Report installed, missing and custom-created skills.
