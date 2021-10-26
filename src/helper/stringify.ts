function stringify(value: any, replacer?: (this: any, key: string, value: any) => any, space?: string | number): string
function stringify(value: any, replacer?: null | (number | string)[], space?: string | number): string
function stringify(
  value: any,
  replacer?: null | (number | string)[] | ((this: any, key: string, value: any) => any),
  space?: string | number,
): string {
  return JSON.stringify(value, replacer as any, space ?? 2)
}

export default stringify
