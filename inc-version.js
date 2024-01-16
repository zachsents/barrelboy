import fs from "fs/promises"

const packageJson = JSON.parse(await fs.readFile("./package.json", "utf-8"))
const [major, minor, patch] = packageJson.version.split(".")
packageJson.version = `${major}.${minor}.${parseInt(patch) + 1}`
await fs.writeFile("./package.json", JSON.stringify(packageJson, null, 4))

console.log("Incremented version number to", packageJson.version)
