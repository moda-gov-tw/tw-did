## Introduction

This guide aims to establish a consistent coding style and naming conventions among team members throughout the development process. It specifies rules for different directories within the project: `apps/server` adheres to Nest.js conventions, while `apps/web` and `libs` follow React-based conventions.

## Coding Style Guidelines

### Usage of `index.ts`

- Do not place components inside `index.ts`. It should only be used to export components from the same directory.
- If there are other directories on the same level as an `index.ts` file, export the contents of those directories' `index.ts` files.

```typescript
// Good
// src/components/index.ts
export * from './Button';
export * from './Card';

// Bad
// src/components/index.ts
export const Button = ...
```

## Naming Conventions

### General (`apps/web` and `libs`)

- Component files: `<ComponentName>.jsx`
- Class Files: `<ClassName>.ts`
- Utility files: `<utilityName>.js`
- Styles: `<ComponentName>.scss`

### Nest.js (`apps/server`)

- Controller: `<feature>.controller.ts`
- Service: `<feature>.service.ts`
- Module: `<feature>.module.ts`
- Interface: `<feature>.interface.ts`

### Directory Names

- If a single component requires multiple files, use PascalCase for the directory name (e.g., `UserProfile`).
- For directories containing a group of related components, use lowercase with hyphens to separate words (e.g., `action-screen`).

```plaintext
// Good for single component
src/components/UserProfile/

// Good for group of related components
src/components/action-screen/
```

## Pull Request Guidelines

### GitHub Actions and Tests

When submitting a pull request, please make sure that the GitHub Actions job named `test` passes successfully. This job includes unit tests, build checks, and linting.

#### Running Tests Locally

To run the same tests as the `test` job on your local machine, use the following command:

```bash
nx run-many -t lint test build
```

### Note on End-to-End (E2E) Tests

The `e2e` GitHub Actions job is currently unstable. Therefore, if this job doesn't pass, it can be temporarily ignored when submitting a pull request.

#### Running E2E Tests Locally

To run the E2E tests locally, you can use the following command:

```bash
nx run-many -t e2e
```

## Commit Message Conventions

When committing changes, please use the following prefixes to categorize the type of commit:

- `feat`: A new feature that you're adding to the application.
- `fix`: A bug fix.
- `refactor`: Code change that neither fixes a bug nor adds a feature, but improves code quality.
- `chore`: Miscellaneous tasks that don't modify the source code or test files, such as configuration changes.
- `test`: Adding missing tests or correcting existing tests.

Example commit messages:

```plaintext
feat: add login button to navbar
fix: resolve issue with user authentication
refactor: improve code readability in UserProfile component
chore: update build script
test: add unit test for login functionality
```
