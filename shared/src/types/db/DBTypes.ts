export const collectionNames = ['_test_collection', 'ticket'] as const;
export type collectionName = (typeof collectionNames)[number];
export type DBObj = {
  id: string
};