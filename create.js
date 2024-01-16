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

    const wholePath = name => path.join(dir, `${name}.js`)

    await Promise.all(
        config.barrels
            .filter(barrel => typeof barrel.template === "string")
            .map(barrel => fs.writeFile(wholePath(barrel.name), barrel.template, {
                flag: "wx"
            }).catch(() => { }))
    )

    if (config.openAfterCreate) {
        await new Promise((resolve, reject) => {
            exec(`code ${wholePath(config.openAfterCreate)}`, (error) => {
                if (error) {
                    reject(error)
                } else {
                    resolve()
                }
            })
        })
    }
}
