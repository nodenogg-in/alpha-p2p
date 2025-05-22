---
description: An introduction to nodenogg.in's codebase
---

# Codebase

nodenogg.in is a web application written entirely in Typescript/Javascript. The codebase is split up into modules which are all managed in this monorepo. The API documentation for each of the modules is shown here, towards the bottom of the sidebar.

## Monorepo structure

### Microcosm [`./packages/microcosm`](/microcosm/readme)

The schema and base APIs: these describe the structure of data and how it flows through the nodenogg.in application.

### Framework [`./internal/framework`](/framework/readme)

The logic and state for the nodenogg.in app: this manages the nodenogg.in app, loads and makes data available to the front-end.

### IO [`./internal/io`](/io/readme)

Importers/exporters for Microcosms, used for things like processing and validating files, exporting backups or snaphots. Supports bi-directional import and export from JSON, HTML and Markdown.

##### `docs`

Our documentation, which is what you're reading now.
