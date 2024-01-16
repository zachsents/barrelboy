import merge from "lodash.merge"
import path from "path"
import { pathToFileURL } from "url"

/**
 * @return {Promise<BarrelBoyConfig>} 
 */
export async function findConfig() {
    const module = await import(pathToFileURL(path.join(process.cwd(), "barrelboy.config.js")))
    return module.default
}

/**
 * @param {BarrelBoyConfig} config
 * @return {BarrelBoyConfig}
 */
export function createConfig(config) {
    const barrels = config.barrels?.map(barrel => merge({}, defaultBarrel, config.commonBarrelSettings, barrel))
    const accessors = config.accessors?.map(accessor => merge({}, defaultAccessor, accessor))
    return merge({}, defaultConfig, config, { barrels, accessors })
}

/**
 * @typedef {object} BarrelBoyConfig
 * @property {Barrel[]} barrels
 * @property {Accessor[]} accessors
 * @property {Omit<Barrel, "name">} commonBarrelSettings
 * @property {false | string} openAfterCreate Name of a barrel to open after using the create command
 */

/**
 * @typedef {object} Barrel
 * @property {string} name
 * @property {string} extension
 * @property {string} baseDirectory
 * @property {string[]} exclude
 * @property {string} glob Overwrites baseDirectory, name, and extension when doing glob search
 * @property {string} outputDirectory
 * @property {string} template
 */

/**
 * @typedef {object} Accessor
 * @property {string} name
 * @property {string} typePrefix
 * @property {"all" | string[]} barrels
 */

/** @type {BarrelBoyConfig} */
const defaultConfig = {
    barrels: [],
    commonBarrelSettings: {},
    accessors: [],
    openAfterCreate: false,
}

/** @type {Barrel} */
const defaultBarrel = {
    name: "index",
    extension: "js",
    baseDirectory: "*",
    exclude: [],
    glob: undefined,
    outputDirectory: ".",
    template: "",
}

/** @type {Accessor} */
const defaultAccessor = {
    name: "index",
    typePrefix: undefined,
    barrels: "all",
}