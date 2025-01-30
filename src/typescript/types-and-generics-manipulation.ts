const nonExistentKeyErrorMessage = (key: string) =>
  `Key "${key}" does not exists on some entries`;

//TODO: ADD CONSOLE SPU TO SOURCE ARRAY IS EMPTY
function extractValues<
  SourceEntry extends Record<string, any>,
  KeyType extends keyof SourceEntry,
>(source: SourceEntry[], key: KeyType) {
  if (source.length === 0) {
    console.warn("The source array is empty");
    return [];
  }

  return source
    .filter(
      (entry): entry is SourceEntry =>
        typeof entry === "object" && entry !== null,
    )
    .map((entry) => {
      if (key in entry) {
        return entry[key];
      }

      throw new Error(nonExistentKeyErrorMessage(String(key)));
    });
}

export const typesAndGenerics = {
  nonExistentKeyErrorMessage,
  extractValues,
};
