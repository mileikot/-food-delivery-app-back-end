import { Repository } from 'typeorm';

/** Returns all property names in the repository. Useful when using `select` to select all fields including the ones marked as `select: false` in the entity column options */
export function includeAll<T extends object>(
  repository: Repository<T>,
): Array<keyof T> {
  return repository.metadata.columns.map((col) => col.propertyName) as Array<
    keyof T
  >;
}

/** Returns specified property names in the repository. */
export function include<T extends object>(
  repository: Repository<T>,
  unselectedColumnsToAdd: Array<keyof T>,
): Array<keyof T> {
  return repository.metadata.columns
    .filter(
      (col) =>
        col.isSelect ||
        (!col.isSelect &&
          unselectedColumnsToAdd.includes(col.propertyName as keyof T)),
    )
    .map((col) => col.propertyName) as Array<keyof T>;
}
