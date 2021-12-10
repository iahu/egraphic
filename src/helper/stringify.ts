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

/**
 * 显示将不可渲染的值转成对应字符串
 */
export const replacer = (value: any) => {
  const type = Object.prototype.toString.call(value).slice(8, -1)
  switch (type) {
    case 'string':
      return value || '-'
    case 'Undefined':
    case 'Null':
      return type.toLowerCase()
    case 'Number':
      return isNaN(value) ? 'NaN' : value
    default:
      return value
  }
}
