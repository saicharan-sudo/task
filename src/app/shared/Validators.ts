export class ValidationUtils {
    static isObjectExists(obj: any): boolean {
      return obj !== null && obj !== undefined;
    }
  
    static isListExists(list: any[]): boolean {
      return Array.isArray(list) && list.length > 0;
    }
  
    static isStringNull(str: string): boolean {
      return str === null || str === undefined || str.trim() === '';
    }
        static isNumberNull(str: number): boolean {
      return str != null || str != undefined;
    }
  }