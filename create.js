import fs from "fs/promises"
import path from "path"
import { exec } from "child_process"
import { findConfig } from "./config.js"


export async function create({
    segments = [],
} = {}) {
    const config = await findConfig()

    const dir = ".\\" + segments.join("\\")
    await fs.mkdir(dir, { recursive: true })

    const wholePath = barrel => path.join(dir, `${barrel.name}.${barrel.extension}`)

    await Promise.all(
        config.barrels
            .filter(barrel => typeof barrel.template === "string")
            .map(barrel => fs.writeFile(wholePath(barrel), barrel.template, {
                flag: "wx"
            }).catch(() => { }))
    )

    if (config.openAfterCreate) {
        await new Promise((resolve, reject) => {
            const barrel = config.barrels.find(barrel => barrel.name === config.openAfterCreate)

            exec(`code ${wholePath(barrel)}`, (error) => {
                if (error) {
                    reject(error)
                } else {
                    resolve()
                }
            })
        })
    }
}
