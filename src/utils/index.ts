import { TrueBasedMap } from '@/types';

/**
 * This function is useful for creating a map object to omit nested loops
 * @param list a list of objects, number or strings that will be turned to a map object
 * @param field only if your list has an object - any key in an object from the list parameter which will be used
 * as a key in the true based map
 * @returns an object that has following structure: { [field]: true }
 */
export const createTrueBasedMap = <T extends number | string | object>(
  list: T[],
  field?: T extends object ? keyof T : void,
): TrueBasedMap => {
  return list.reduce<TrueBasedMap>((accumulator, current) => {
    if (typeof current === 'object') {
      if (field && current[field]) {
        accumulator[current[field]] = true;
      }
    } else if (typeof current === 'string') {
      accumulator[current] = true;
    } else if (typeof current === 'number') {
      accumulator[current] = true;
    }

    return accumulator;
  }, {});
};

/**
 * Deletes specified keys from the given object
 * @param obj An object from which the fields will be deleted
 * @param fields A list of fields to delete
 * @returns A copy of the initial object without deleted fields
 */
export const deleteProperties = <T extends object>(
  obj: T,
  fields: (keyof T)[],
) => {
  const copyObj = { ...obj };

  for (let i = 0; i < fields.length; i++) {
    delete copyObj[fields[i]];
  }

  return copyObj;
};
