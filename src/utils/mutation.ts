/**
 * Returns a list of all nodes added across all mutations in the provided list
 *
 * @param mutations Mutations list
 * @returns All added nodes across all the mutations in the provided list
 */
export const getAllAddedNodes = (mutations: MutationRecord[]): Node[] => {
  return mutations.map((mutation) => Array.from(mutation.addedNodes)).flat();
};

/**
 * Returns a list of all nodes deleted across all mutations in the provided list
 *
 * @param mutations Mutations list
 * @returns All deleted nodes across all the mutations in the provided list
 */
export const getAllDeletedNodes = (mutations: MutationRecord[]): Node[] => {
  return mutations.map((mutation) => Array.from(mutation.removedNodes)).flat();
};
