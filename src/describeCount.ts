export function describeCount(count: number, singular: string, plural?: string) {
    if (count === 1) {
        return "1 " + singular;
    }

    if (plural === undefined) {
        plural = singular.endsWith("s") ? (singular + "es") : (singular + "s");
    }
    return `${count} ${plural}`;
}
