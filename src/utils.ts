export const padLeft = (value: number, length: number = value.toString().length, replacement: string = '0') => {
    return new Array(length - value.toString().length + 1).join(replacement) + value;
}

export const getStringDate = () => {
    const d = new Date(Date.now());
    const date = d.toISOString().substring(0, 10).replace('-', '.')
    const hours = `${padLeft(d.getUTCHours(), 2)}.${padLeft(d.getUTCMinutes(), 2)}.${padLeft(d.getUTCSeconds(), 2)}`
    return `${date}-${hours}`
}