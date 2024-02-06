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
            name: "access",
            barrels: "all",
            typePrefix: "def",
        }
    ],
    openAfterCreate: "def",
    commonBarrelSettings: {
        outputDirectory: "_barrels",
    }
})