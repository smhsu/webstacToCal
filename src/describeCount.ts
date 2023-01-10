/**
 * Utility method.
 *
 * @param count
 * @param singular
 * @param plural
 */
export function describeCount(count: number, singular: string, plural?: string) {
    if (count === 1) {
        return "1 " + singular;
    }

    return `${count} ${plural || getPlural(singular)}`;
}


export function getPlural(singular: string) {
    return singular.endsWith("s") ? (singular + "es") : (singular + "s");
}
