# Contributing to IntentFlow

Thank you for your interest in contributing to IntentFlow! This document provides guidelines and instructions for contributing.

## Code of Conduct

Be respectful, inclusive, and professional. We're building something great together.

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0
- Foundry (for smart contracts)
- PostgreSQL (for backend)
- Git

### Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/your-org/intentflow.git
cd intentflow

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration

# Start local services
docker-compose up -d

# Run tests
npm test
```

## Project Structure

```
intentflow/
├── packages/
│   ├── contracts/      # Solidity smart contracts
│   ├── backend/        # NestJS API server
│   ├── frontend/       # Next.js UI
│   ├── solver-bot/     # Solver bot workers
│   ├── indexer/        # Subsquid event indexer
│   └── shared/         # Shared types and utilities
├── docs/               # Documentation
└── scripts/            # Utility scripts
```

## Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions/updates

### 2. Make Changes

Follow the coding standards for each package:

#### Smart Contracts (Solidity)
- Use Solidity 0.8.24
- Follow OpenZeppelin patterns
- Add NatSpec comments
- Write tests for all functions
- Run `forge fmt` before committing

```solidity
/**
 * @notice Brief description
 * @param paramName Parameter description
 * @return returnName Return value description
 */
function myFunction(uint256 paramName) external returns (uint256 returnName) {
    // Implementation
}
```

#### Backend (TypeScript/NestJS)
- Use TypeScript strict mode
- Follow NestJS conventions
- Add JSDoc comments
- Write unit and integration tests
- Use Prettier for formatting

```typescript
/**
 * Service description
 */
@Injectable()
export class MyService {
  /**
   * Method description
   * @param param Parameter description
   * @returns Return value description
   */
  async myMethod(param: string): Promise<Result> {
    // Implementation
  }
}
```

#### Frontend (TypeScript/React)
- Use TypeScript
- Follow React best practices
- Use functional components with hooks
- Add prop types
- Write component tests

```typescript
interface MyComponentProps {
  /** Prop description */
  title: string;
  /** Callback description */
  onAction: () => void;
}

export function MyComponent({ title, onAction }: MyComponentProps) {
  // Implementation
}
```

### 3. Write Tests

All code changes must include tests:

```bash
# Smart contracts
cd packages/contracts
forge test

# Backend
cd packages/backend
npm test

# Frontend
cd packages/frontend
npm test

# Solver bot
cd packages/solver-bot
npm test
```

### 4. Run Linters

```bash
# Format code
npm run format

# Lint code
npm run lint

# Type check
npm run type-check
```

### 5. Commit Changes

Use conventional commits:

```bash
git commit -m "feat: add solver bidding system"
git commit -m "fix: resolve reentrancy vulnerability"
git commit -m "docs: update API documentation"
git commit -m "test: add integration tests for XCM bridge"
```

Commit message format:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Test additions/updates
- `chore:` - Build process or auxiliary tool changes

### 6. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with:
- Clear title and description
- Link to related issues
- Screenshots (for UI changes)
- Test results
- Breaking changes (if any)

## Pull Request Guidelines

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Tests added/updated and passing
- [ ] Documentation updated
- [ ] No console.log or debugging code
- [ ] No commented-out code
- [ ] Commit messages follow conventions
- [ ] PR description is clear and complete

### PR Review Process

1. Automated checks must pass (CI/CD)
2. At least one maintainer approval required
3. All review comments addressed
4. No merge conflicts
5. Squash and merge (maintainers will handle)

## Testing Guidelines

### Smart Contract Tests

```solidity
// Test naming: test<FunctionName><Scenario>
function testCreateIntentSuccess() public {
    // Arrange
    // Act
    // Assert
}

function testFailCreateIntentInsufficientReward() public {
    // Should revert
}

function testFuzzCreateIntent(uint256 reward) public {
    // Fuzz testing
}
```

### Backend Tests

```typescript
describe('IntentsService', () => {
  it('should create intent successfully', async () => {
    // Arrange
    // Act
    // Assert
  });

  it('should throw error for invalid intent', async () => {
    // Test error cases
  });
});
```

### Frontend Tests

```typescript
describe('IntentForm', () => {
  it('renders form correctly', () => {
    render(<IntentForm />);
    expect(screen.getByText('Create Intent')).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    // Test form submission
  });
});
```

## Documentation

### Code Documentation

- Add JSDoc/NatSpec comments for all public functions
- Explain complex logic with inline comments
- Update README.md when adding features
- Add examples for new APIs

### API Documentation

Update `docs/API.md` when adding/modifying endpoints:

```markdown
## POST /intents

Create a new intent.

**Request:**
\`\`\`json
{
  "description": "Send 20 USDC to Alice",
  "reward": "1000000000000000000",
  "deadline": 1234567890
}
\`\`\`

**Response:**
\`\`\`json
{
  "id": "0x123...",
  "status": "PENDING"
}
\`\`\`
```

## Issue Reporting

### Bug Reports

Include:
- Clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Screenshots/logs
- Minimal reproduction code

### Feature Requests

Include:
- Clear use case
- Proposed solution
- Alternative solutions considered
- Impact on existing features

## Community

- Discord: [Your Discord Server]
- Twitter: @IntentFlow
- GitHub Discussions: For questions and ideas

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Eligible for contributor NFTs (future)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to IntentFlow! 🚀
