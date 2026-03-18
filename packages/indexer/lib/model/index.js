"use strict";
// Placeholder models for indexer (Work in Progress)
// This indexer is not required for the hackathon demo
Object.defineProperty(exports, "__esModule", { value: true });
exports.Execution = exports.Solver = exports.Intent = void 0;
class Intent {
    id;
    chainId;
    creator;
    description;
    reward;
    deadline;
    status;
    createdAt;
    blockNumber;
    txHash;
    solverId;
    executedAt;
    constructor(data) {
        Object.assign(this, data);
    }
}
exports.Intent = Intent;
class Solver {
    id;
    address;
    stake;
    completedIntents;
    failedIntents;
    createdAt;
    constructor(data) {
        Object.assign(this, data);
    }
}
exports.Solver = Solver;
class Execution {
    id;
    intentId;
    solverId;
    success;
    result;
    createdAt;
    constructor(data) {
        Object.assign(this, data);
    }
}
exports.Execution = Execution;
