import { typesAndGenerics } from "./../types-and-generics-manipulation";

const { extractValues, nonExistentKeyErrorMessage } = typesAndGenerics;

describe("1.1 Manipulação de Tipos e Generics", () => {
  test("throws non-existent key error", () => {
    const data = [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
      { id: 3, person_name: "Charles" },
    ];

    const key = "name";

    expect(() => extractValues(data, key)).toThrow(
      nonExistentKeyErrorMessage(key),
    );
  });

  test("extracts desired values by the given key name", () => {
    const data = [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
    ];

    const result = extractValues(data, "name");

    expect(result).toStrictEqual(["Alice", "Bob"]);
  });
});
