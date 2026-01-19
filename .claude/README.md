# Claude Code Configuration

This directory contains Claude Code configuration and custom prompts for the Cypress test automation project.

## Structure

- `prompts/` - Custom prompts for different use cases
  - `cypress-test-helper.md` - General Cypress assistance
  - `test-generator.md` - Test case generation
- `settings.local.json` - Local Claude Code settings

## How to Use

See the main project's `CLAUDE-CODE-GUIDE.md` for complete usage instructions.

## Custom Prompts

### @cypress-test-helper
Use for:
- Debugging test failures
- Understanding project structure
- Best practices guidance
- Database integration help

### @test-generator
Use for:
- Creating new test suites
- Generating test cases
- Following project patterns
- Test data creation

## Quick Examples

```
@cypress-test-helper Fix this failing test
@test-generator Create login tests
Help me add a custom command for search functionality
```
