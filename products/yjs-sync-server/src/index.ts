#!/usr/bin/env node
import { createApp } from "./hocuspocus.js";

const app = createApp();

process.on("SIGINT", app.stop);
process.on("SIGTERM", app.stop);
