#!/usr/bin/env node
import { build, buildAccessors } from "./build.js"
import { create } from "./create.js"

const [command, ...args] = process.argv.slice(2)

switch (command) {
    case "build":
        await build()
        break
    case "build-accessors":
        await buildAccessors()
        break
    case "create":
        await create({
            segments: args,
        })
        break
    default:
        console.error(`Unknown command: ${command}`)
        break
}