/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 * See LICENSE file in root directory for full license.
 */
import KEYS from "./visitor-keys.js";

/**
 * @typedef {import('./visitor-keys.js').VisitorKeys} VisitorKeys
 */

// List to ignore keys.
const KEY_BLACKLIST = new Set([
    "parent",
    "leadingComments",
    "trailingComments"
]);

/**
 * Check whether a given key should be used or not.
 * @param {string} key The key to check.
 * @return {boolean} `true` if the key should be used.
 */
function filterKey(key) {
    return !KEY_BLACKLIST.has(key) && key[0] !== "_";
}

/**
 * Get visitor keys of a given node.
 * @param {object} node The AST node to get keys.
 * @return {readonly string[]} Visitor keys of the node.
 */
export function getKeys(node) {
    return Object.keys(node).filter(filterKey);
}

// Disable valid-jsdoc rule because it reports syntax error on the type of @return.
// eslint-disable-next-line valid-jsdoc
/**
 * Make the union set with `KEYS` and given keys.
 * @param {VisitorKeys} additionalKeys The additional keys.
 * @return {VisitorKeys} The union set.
 */
export function unionWith(additionalKeys) {
    const retv = /** @type {{
        [type: string]: ReadonlyArray<string>
    }} */ (Object.assign({}, KEYS));

    for (const type of Object.keys(additionalKeys)) {
        if (Object.prototype.hasOwnProperty.call(retv, type)) {
            const keys = new Set(additionalKeys[type]);

            for (const key of retv[type]) {
                keys.add(key);
            }

            retv[type] = Object.freeze(Array.from(keys));
        } else {
            retv[type] = Object.freeze(Array.from(additionalKeys[type]));
        }
    }

    return Object.freeze(retv);
}

export { KEYS };
