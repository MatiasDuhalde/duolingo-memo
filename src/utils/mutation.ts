export const getAllAddedNodes = (mutations: MutationRecord[]): Node[] => {
  return mutations.map((mutation) => Array.from(mutation.addedNodes)).flat();
};

export const getAllDeletedNodes = (mutations: MutationRecord[]): Node[] => {
  return mutations.map((mutation) => Array.from(mutation.removedNodes)).flat();
};
