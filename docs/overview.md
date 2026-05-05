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

## Core idea

aipm should make agent resources **portable by default**.

The system should:

- install artifacts into a repository
- resolve them into a normalized repository contract
- allow any compatible agent to consume that contract
- optionally generate agent-specific bindings for better UX

## Non-goal

The primary goal is **not** to create a package manager for arbitrary prompts or unchecked scripts.

Instead, aipm should focus on:

- structured manifests
- explicit capabilities
- dependency resolution
- trust and verification
- least-privilege access
- cross-agent interoperability

## Design principles

- **portable core, agent-specific bindings**
- **declarative first**
- **install once, use across agents**
- **repo-local resolution**
- **inspectable permissions**
- **reproducible installs**
- **composable artifacts**
