# About

## Core concepts

### 5 key data structures you'll get to know:

1. A **Microcosm** is a space where you can collaborate and share with others. They are a bit more like channels (e.g. `#announcements` in a Discord server) rather than documents or files. If you have the right URL, you can join and contribute to the microcosm. Any one who has the same URL can also join add their own Nodes.

    * If you want, you can add a password which means that only people using that same password will be able to view what you add to the microcosm.

2. There is a set of **Collections** in each Microcosm. Each person gets their own collection within a Microcosm when they first join.
    * You can choose to add your name or remain anonymous.

3. A **Node** are the building blocks of content that you can add to your collection in the microcosm. There are different types of Node. 
    * An `HTMLNode` contains `<html>` markup and so is used for displaying text and rich media Nodes.
    * A `ConnectionNode` describes a connection that someone has made between two `HTMLNodes`.
    * An `EmojiNode` is, as you might guess, an emoji that someone can use to react to other content in the Microcosm.
    * An `SVGNode` contains a diagram or drawing.

4. A **View** are how people can interact with Nodes, Collections and Microcosms. For example, the main and most sophisticated one is the spatial view, which is a panning infinite canvas and whiteboard. We hope that as the project matures, you'll be able to choose different views depending on the activities you're doing and the questions you're interested in.

5. An **Identity** is a unique identifier that nodenogg.in uses to identify a user of the app. Each one gets a unique ID and are given their own Collection to go with it.

#### Alternative approaches
In 2024 we'll also be looking at additional strategies for helping
* Creating a minimal desktop app that can optionally persist your content and identity, making sure you always have a safe local copy of your data.
* Creating a browser extension that persists your data as above.
* (Least preferred option) Using a dedicated server to persist encrypted copies of content.

### How does the microcosm work?
Put simply, a microcosm is an API for creating a distributed set of nodes within a namespace.

# Architecture

## Background
The nodenogg.in project has been progressively slowly and steadily for the past few years. The new 2024 codebase reflects a major new effort to create a full implementation of the nodenogg.in concept as envisaged in [Adam Procter's PhD thesis](https://manifold.soton.ac.uk/). However we've noticed some challenging

- Often we found ourselves returning to code that worked at the time but is really hard to refactor or update.
- The Vue 2 to Vue 3 migration was a bit of a battle.
- Without a clear API or schema it's hard to evolve the product without tearing everything down and building it up again.
- With a distributed, local-first architecture, a clear schema and code versioning is a must-have.
- It's great to have a codebase with minimal dependencies. We don't want to rely on an API or functionality that might change or another open-source project that might go stale.
- Resilience: servers without maintenance go down, code goes stale, new security risks go unpatched. We wonder if there is a way to build autonomous software by design. 

From this, we learned that it's great to have a codebase with minimal dependencies, clear versionining, lots of modularity and not tied into a specific framework or build process. 

- Using a monorepo setup with several small packages to isolate functionality, making testing, versioning and scope more logical – even though it adds complexity for development and deployment.
- Use an approach where as much logic as possible is separate from a front-end framework (in our case Vue).
- Be as sparing as possible with dependencies. Often adding a library is inevitable and preferable (e.g. a great example is text editing UI) but we're aiming for a foundation of functionality that is completely bespoke and dependency-free.

### `@nodenogg.in/microcosm`

This is the core API and schema for the microcosm type

### `@nodenogg.in/component`

This module provides all the logic and state for running Nodenogg.in as an app or component. It's
