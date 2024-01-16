import fs from "fs/promises"
import { glob } from "glob"
import path from "path"
import { findConfig } from "./config.js"


export async function build() {
    const config = await findConfig()

    await Promise.all(config.barrels.map(async barrel => {
        const globPattern = barrel.glob ?? `${barrel.baseDirectory}/**/${barrel.name}.${barrel.extension}`
        const filePaths = await glob(globPattern, { ignore: barrel.exclude })

        await fs.writeFile(
            path.join(barrel.outputDirectory, `${barrel.name}-barrel.js`),
            filePaths.map(createExport).join("\n")
        )

        console.log(`[${barrel.name}] Barreled ${filePaths.length} files`)
    }))
}



export async function buildAccessors() {

    const config = await findConfig()

    await Promise.all(config.accessors.map(async accessor => {
        const barrels = accessor.barrels === "all"
            ? config.barrels.map(b => b.name)
            : accessor.barrels

        await buildAccessor(config, {
            name: accessor.name,
            barrels,
            typePrefix: accessor.typePrefix,
        })
    }))
}


/**
 * @param {import("./config.js").BarrelBoyConfig} config
 * @param {object} options
 * @param {string} options.name
 * @param {string[]} options.barrels
 * @param {string} options.typePrefix
 */
async function buildAccessor(config, {
    name,
    barrels = [],
    typePrefix,
} = {}) {
    const imports = barrels.map(barrelName => {
        const barrelConfig = config.barrels.find(b => b.name === barrelName)
        const importPath = "./" + path.join(barrelConfig.outputDirectory, `${barrelConfig.name}-barrel.js`).replaceAll("\\", "/")
        return `import * as ${barrelName} from "${importPath}"`
    })

    await fs.writeFile(`./${name}.js`, `${imports.join("\n")}
import { createAccessors } from "@zachsents/barrelboy"

const { list, object, resolveId, resolve } = createAccessors({
    barrels: [
        ${barrels.map(barrelName => `${barrelName},`).join("\n        ")}
    ],
    typePrefix: "${typePrefix}",
})

export { list, object, resolveId, resolve }`)

    console.log(`[${name}] Created accessor comprised of ${barrels.toString()}`)
}


/**
 * @param {string} filePath
 */
function createExport(filePath) {
    const importPath = `./${filePath.replaceAll("\\", "/")}`
    const exportName = path.dirname(filePath).split("\\").map(dashToCamel).join("_")

    return `export { default as ${exportName} } from "${importPath}"`
}


function dashToCamel(str) {
    const segments = str.split("-")
    return segments[0].toLowerCase() + segments.slice(1).map(seg => seg[0].toUpperCase() + seg.slice(1)).join("")
}