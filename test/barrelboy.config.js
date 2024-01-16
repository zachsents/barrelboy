import { createConfig } from "../config.js"

export default createConfig({
    barrels: [
        {
            name: "def",
            extension: "js",
        }
    ],
    accessors: [
        {
            barrels: "all",
            name: "index",
            typePrefix: "def",
        }
    ],
    openAfterCreate: "def",
})