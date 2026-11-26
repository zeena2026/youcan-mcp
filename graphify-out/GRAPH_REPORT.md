# Graph Report - youcan-mcp  (2026-11-26)

## Corpus Check
- 3 files · ~1,324 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 2)

## Summary
- 33 nodes · 54 edges · 7 communities (4 shown, 3 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `cdfabf5c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- YouCanClient
- index.js
- package.json
- dependencies
- scripts
- @modelcontextprotocol/sdk
- engines

## God Nodes (most connected - your core abstractions)
1. `YouCanClient` - 10 edges
2. `createServer()` - 5 edges
3. `scripts` - 3 edges
4. `@modelcontextprotocol/sdk` - 3 edges
5. `express` - 3 edges
6. `node-fetch` - 3 edges
7. `@modelcontextprotocol/sdk@^1.0.0` - 2 edges
8. `express@^4.18.2` - 2 edges
9. `node-fetch@^3.3.2` - 2 edges
10. `engines` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (7 total, 3 thin omitted)

### Community 1 - "index.js"
Cohesion: 0.29
Nodes (4): app, client, node-fetch@^3.3.2, node-fetch

### Community 2 - "package.json"
Cohesion: 0.33
Nodes (5): description, main, name, type, version

### Community 3 - "dependencies"
Cohesion: 0.67
Nodes (3): dependencies, express@^4.18.2, express

### Community 4 - "scripts"
Cohesion: 0.67
Nodes (3): scripts, dev, start

## Knowledge Gaps
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `YouCanClient` connect `YouCanClient` to `index.js`?**
  _High betweenness centrality (0.320) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `createServer()` (e.g. with `.delete()` and `.get()`) actually correct?**
  _`createServer()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Why does `@modelcontextprotocol/sdk` connect `@modelcontextprotocol/sdk` to `index.js`, `package.json`?**
  _High betweenness centrality (0.183) - this node is a cross-community bridge._
- **Why does `express` connect `dependencies` to `index.js`, `package.json`?**
  _High betweenness centrality (0.183) - this node is a cross-community bridge._