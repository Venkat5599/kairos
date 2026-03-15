# Quick Test Commands

## Run All Tests

```bash
cd packages/contracts

# Complete test suite with reports
./run-tests.sh

# Or manually
forge test -vv
```

## Run Specific Tests

```bash
# Intent Registry tests only
forge test --match-contract IntentRegistryTest -vv

# XCM Bridge tests only
forge test --match-contract XCMBridgeTest -vv

# Specific test function
forge test --match-test testCompleteIntent -vvv

# Fuzz tests only
forge test --match-test testFuzz -vv
```

## Gas & Coverage Reports

```bash
# Gas usage report
forge test --gas-report

# Coverage report
forge coverage

# Detailed coverage
forge coverage --report lcov
```

## Expected Results

```
Running 80 tests for test/IntentRegistry.t.sol:IntentRegistryTest
[PASS] testRegisterSolver() (gas: 123456)
[PASS] testCreateIntent() (gas: 145678)
[PASS] testClaimIntent() (gas: 98765)
[PASS] testCompleteIntent() (gas: 87654)
...

Running 35 tests for test/XCMBridge.t.sol:XCMBridgeTest
[PASS] testXtokensPrecompileAddress() (gas: 5432)
[PASS] testSendRealXCMTransfer() (gas: 256789)
[PASS] testStakeOnPolkadot() (gas: 280123)
...

Test result: ok. 80 passed; 0 failed; finished in 2.34s
```

## Troubleshooting

```bash
# Clean and rebuild
forge clean
forge build

# Update dependencies
forge update

# Run with maximum verbosity
forge test -vvvv
```
