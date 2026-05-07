# Overview

## What is aipm?

**aipm** is a package manager for agentic AI artifacts.

The project aims to provide a standard way to define, publish, install, resolve, and use portable AI artifacts inside a repository. These artifacts may include:

- skills
- MCP servers
- workflows
- evals
- policies
- reusable instruction bundles

## Problem statement

Today, agent ecosystems are fragmented.

A skill or workflow prepared for one agent platform is often tightly coupled to:

- that vendor's prompt format
- that runtime's tool model
- that ecosystem's file conventions
- proprietary configuration structures

That makes reuse difficult. A repository owner may want to install a capability once and then use it from multiple agent environments such as Claude, Copilot, or custom local agents.

## Vision

aipm should become the standard way to install and reuse agent capabilities across tools and vendors. Its long-term value is giving repositories one portable, inspectable contract for AI artifacts so teams can adopt or switch agent runtimes without re-authoring their automation.

## Non-goals

aipm will **not**:

- be a package manager for arbitrary prompts, raw scripts, or unchecked execution bundles
- require artifact authors to target only one agent vendor/runtime
- hide permissions, capabilities, or dependency behavior behind opaque defaults
- replace runtime-specific UX; instead it provides a portable core that runtimes can bind to
- optimize for one-off local hacks over reproducible, reviewable repository state

## Terminology

- **artifact**: a versioned AI resource package (for example a skill, MCP server, workflow, policy, or eval)
- **manifest**: the declarative metadata that defines an artifact's identity, capabilities, dependencies, and requirements
- **repository contract**: the normalized, repo-local resolved state of installed artifacts
- **binding**: runtime-specific integration generated from the portable repository contract
- **capability**: an explicit function or permission surface an artifact provides or requires
- **resolution**: the process of selecting artifact versions and dependencies into deterministic installed state

## Design principles

- **portable core, agent-specific bindings**
- **declarative first**
- **install once, use across agents**
- **repo-local resolution**
- **inspectable permissions**
- **reproducible installs**
- **composable artifacts**
