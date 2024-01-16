import * as def from "./def-barrel.js"
import { createAccessors } from "@zachsents/barrelboy"

const { list, object, resolveId, resolve } = createAccessors({
    barrels: [
        def,
    ],
    typePrefix: "def",
})

export { list, object, resolveId, resolve }