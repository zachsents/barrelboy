import merge from "lodash.merge"


/**
 * @param {object} options
 * @param {object} options.barrels
 * @param {string} options.typePrefix
 */
export function createAccessors({
    barrels,
    typePrefix,
} = {}) {

    const combined = merge({}, ...barrels)

    Object.keys(combined).forEach(name => {
        combined[name].id = createId(typePrefix, name)
    })

    const list = Object.values(combined)
    const object = Object.fromEntries(list.map(def => [def[idKey], def]))
    const _resolveId = (...segments) => resolveId(typePrefix, ...segments)
    const resolve = (...segments) => object[resolveId(...segments)]

    return { list, object, resolveId: _resolveId, resolve }
}


function createId(typePrefix, name) {
    return (typePrefix ? `${typePrefix}:` : "") + name.replaceAll("_", ".")
}

function resolveId(typePrefix, ...segments) {
    return (typePrefix ? `${typePrefix}:` : "") + segments.join(".")
}