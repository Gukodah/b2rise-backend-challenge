import {
  isEven,
  doubleNumber,
  getDoubledEvens,
} from "../enhancing-names-and-structure/basic";
import { PipelineBuilder } from "../enhancing-names-and-structure/enterprise/pipeline-builder";
import { transformNumbers } from "../enhancing-names-and-structure/generic";
import { executeOperationChain } from "../enhancing-names-and-structure/improved/execute-operation-chain";
import { processNumberPipeline } from "../enhancing-names-and-structure/improved/process-number-pipeline";
import { FilterFn } from "../enhancing-names-and-structure/improved/types/filter-fn.types";
import { MapFn } from "../enhancing-names-and-structure/improved/types/map-fn.type";
import { PipelineOp } from "../enhancing-names-and-structure/improved/types/pipeline-operation.type";

describe("3.3 Melhorando Nomes e Estrutura", () => {
  describe("Basic", () => {
    describe("isEven", () => {
      test("should return true for an even number", () => {
        expect(isEven(2)).toBe(true);
        expect(isEven(100)).toBe(true);
      });

      test("should return false for an odd number", () => {
        expect(isEven(3)).toBe(false);
        expect(isEven(101)).toBe(false);
      });

      test("should handle negative numbers correctly", () => {
        expect(isEven(-2)).toBe(true);
        expect(isEven(-3)).toBe(false);
      });
    });

    describe("doubleNumber", () => {
      test("should return the double of a positive number", () => {
        expect(doubleNumber(2)).toBe(4);
        expect(doubleNumber(10)).toBe(20);
      });

      test("should return the double of a negative number", () => {
        expect(doubleNumber(-2)).toBe(-4);
        expect(doubleNumber(-5)).toBe(-10);
      });

      test("should return 0 if the number is 0", () => {
        expect(doubleNumber(0)).toBe(0);
      });
    });

    describe("getDoubledEvens", () => {
      test("should return an empty array if given an empty array", () => {
        expect(getDoubledEvens([])).toEqual([]);
      });

      test("should return only doubled values for even numbers", () => {
        const input = [1, 2, 3, 4, 5, 6];
        // Even numbers: 2, 4, 6
        // Doubled: 4, 8, 12
        expect(getDoubledEvens(input)).toEqual([4, 8, 12]);
      });

      test("should return an empty array if there are no even numbers", () => {
        const input = [1, 3, 5, 7];
        expect(getDoubledEvens(input)).toEqual([]);
      });

      test("should handle negative even numbers correctly", () => {
        // Even numbers here: -4, 2, -6
        // Doubled: -8, 4, -12
        const input = [-4, 1, 2, 3, -6];
        expect(getDoubledEvens(input)).toEqual([-8, 4, -12]);
      });
    });
  });

  describe("Generic", () => {
    const isOdd = (num: number) => num % 2 !== 0;
    const increment = (num: number) => num + 1;

    describe("transformNumbers", () => {
      it("should filter numbers based on a custom predicate", () => {
        const input = [1, 2, 3, 4, 5];
        const result = transformNumbers(input, isOdd, doubleNumber);

        expect(result).toEqual([2, 6, 10]);
      });

      it("should transform numbers based on a custom transform function", () => {
        const input = [1, 2, 3, 4];
        const result = transformNumbers(input, isEven, increment);

        expect(result).toEqual([3, 5]);
      });

      it("should handle both custom filter and custom transform", () => {
        const input = [1, 2, 3, 4, 5, 6];
        const result = transformNumbers(input, isOdd, increment);

        expect(result).toEqual([2, 4, 6]);
      });

      it("should return an empty array if the filter removes all numbers", () => {
        const input = [2, 4, 6];
        const result = transformNumbers(input, isOdd, doubleNumber);

        expect(result).toEqual([]);
      });

      it("should return an empty array when provided an empty array", () => {
        const result = transformNumbers([]);
        expect(result).toEqual([]);
      });
    });
  });

  describe("Improved", () => {
    describe("processNumberPipeline func", () => {
      //custom filter functions for testing
      const isOdd: FilterFn = (num) => num % 2 !== 0;
      const greaterThanZero: FilterFn = (num) => num > 0;

      //custom map functions
      const increment: MapFn = (num) => num + 1;
      const triple: MapFn = (num) => num * 3;

      it("should return the original array when no filters and no mappers are provided", () => {
        const numbers = [1, 2, 3];
        const result = processNumberPipeline(numbers);

        expect(result).toEqual([1, 2, 3]);
      });

      it("should apply a single filter function correctly", () => {
        const numbers = [1, 2, 3, 4, 5, 6];
        const result = processNumberPipeline(numbers, [isEven]);

        expect(result).toEqual([2, 4, 6]);
      });

      it("should apply multiple filter functions in sequence", () => {
        const numbers = [-3, -2, -1, 0, 1, 2, 3, 4];

        const result = processNumberPipeline(numbers, [
          isEven,
          greaterThanZero,
        ]);
        expect(result).toEqual([2, 4]);
      });

      it("should apply a single map function correctly", () => {
        const numbers = [1, 2, 3];
        const result = processNumberPipeline(numbers, [], [doubleNumber]);

        expect(result).toEqual([2, 4, 6]);
      });

      it("should apply multiple map functions in sequence", () => {
        const numbers = [1, 2];

        const result = processNumberPipeline(
          numbers,
          [],
          [doubleNumber, increment, triple],
        );
        expect(result).toEqual([9, 15]);
      });

      it("should apply both filters and maps in sequence", () => {
        const numbers = [1, 2, 3, 4, 5];

        const result = processNumberPipeline(
          numbers,
          [isEven],
          [doubleNumber, increment],
        );
        expect(result).toEqual([5, 9]);
      });

      it("should return an empty array if the final filter excludes all numbers", () => {
        const numbers = [2, 4, 6];

        const result = processNumberPipeline(numbers, [isOdd]);
        expect(result).toEqual([]);
      });

      it("should return an empty array when the input is empty, regardless of filters or maps", () => {
        const numbers: number[] = [];
        const result = processNumberPipeline(numbers, [isEven], [doubleNumber]);
        expect(result).toEqual([]);
      });

      it("should handle negative numbers correctly through filters and mappers", () => {
        const numbers = [-4, -3, -2, -1, 0, 1];

        const result = processNumberPipeline(
          numbers,
          [isEven, greaterThanZero],
          [doubleNumber],
        );
        expect(result).toEqual([]);
      });
    });

    describe("executeOperationChain func", () => {
      it("should return the original array if no operations are provided", () => {
        const numbers = [1, 2, 3];
        const operations: PipelineOp[] = [];

        const result = executeOperationChain(numbers, operations);
        expect(result).toEqual(numbers);
      });

      it("should apply a single filter operation correctly", () => {
        const numbers = [1, 2, 3, 4, 5];
        const operations: PipelineOp[] = [
          {
            type: "filter",
            fn: (num: number) => num % 2 === 0,
          },
        ];

        const result = executeOperationChain(numbers, operations);
        expect(result).toEqual([2, 4]);
      });

      it("should apply a single map operation correctly", () => {
        const numbers = [1, 2, 3];
        const operations: PipelineOp[] = [
          {
            type: "map",
            fn: (num: number) => num * 2,
          },
        ];

        const result = executeOperationChain(numbers, operations);
        expect(result).toEqual([2, 4, 6]);
      });

      it("should apply multiple filter and map operations in sequence", () => {
        const numbers = [1, 2, 3, 4, 5, 6];
        const operations: PipelineOp[] = [
          {
            type: "filter",
            fn: (num: number) => num % 2 === 0,
          },
          {
            type: "map",
            fn: (num: number) => num / 2,
          },
          {
            type: "filter",
            fn: (num: number) => num >= 2,
          },
          {
            type: "map",
            fn: (num: number) => num * 10,
          },
        ];

        const result = executeOperationChain(numbers, operations);
        expect(result).toEqual([20, 30]);
      });

      it("should return an empty array if a filter operation filters out everything", () => {
        const numbers = [1, 2, 3];
        const operations: PipelineOp[] = [
          {
            type: "filter",
            fn: (num: number) => num > 5,
          },
        ];

        const result = executeOperationChain(numbers, operations);
        expect(result).toEqual([]);
      });

      it("should handle an empty input array regardless of operations", () => {
        const numbers: number[] = [];
        const operations: PipelineOp[] = [
          {
            type: "filter",
            fn: (num: number) => num % 2 === 0,
          },
          {
            type: "map",
            fn: (num: number) => num * 3,
          },
        ];
        const result = executeOperationChain(numbers, operations);

        expect(result).toEqual([]);
      });

      it("should handle operations on negative numbers correctly", () => {
        const numbers = [-2, -1, 0, 1, 2];
        const operations: PipelineOp[] = [
          {
            type: "filter",
            fn: (num: number) => num < 0,
          },
          {
            type: "map",
            fn: (num: number) => Math.abs(num),
          },
          {
            type: "filter",
            fn: (num: number) => num > 1,
          },
        ];

        const result = executeOperationChain(numbers, operations);
        expect(result).toEqual([2]);
      });
    });
  });

  describe("Enterprise", () => {
    describe("PipelineBuilder", () => {
      beforeEach(() => {
        // Reset operation registry before each test
        (PipelineBuilder as any).operationRegistry = {};
      });

      describe("Operation Registration", () => {
        test("should register valid operations", () => {
          PipelineBuilder.registerOperation({
            name: "testFilter",
            type: "filter",
            fn: (n) => n > 5,
          });
          PipelineBuilder.registerOperation({
            name: "testMap",
            type: "map",
            fn: (n) => n * 2,
          });

          expect(
            PipelineBuilder["operationRegistry"]["testFilter"],
          ).toBeDefined();
          expect(PipelineBuilder["operationRegistry"]["testMap"]).toBeDefined();
        });

        test("should throw on duplicate registration", () => {
          PipelineBuilder.registerOperation({
            name: "duplicate",
            type: "filter",
            fn: () => true,
          });

          expect(() => {
            PipelineBuilder.registerOperation({
              name: "duplicate",
              type: "map",
              fn: (n) => n * 2,
            });
          }).toThrow(/already registered/);
        });
      });

      describe("Pipeline Construction", () => {
        test("should throw when using unregistered operations", () => {
          expect(() => {
            new PipelineBuilder([1, 2, 3]).addOperation("unknown");
          }).toThrow(/not registered/);
        });

        test("should maintain operation order", () => {
          PipelineBuilder.registerOperation({
            name: "op1",
            type: "filter",
            fn: () => true,
          });
          PipelineBuilder.registerOperation({
            name: "op2",
            type: "map",
            fn: (n) => n,
          });

          const pipeline = new PipelineBuilder([1])
            .addOperation("op1")
            .addOperation("op2");

          expect(pipeline["operations"].map((op) => op.name)).toEqual([
            "op1",
            "op2",
          ]);
        });
      });

      describe("Pipeline Execution", () => {
        beforeEach(() => {
          PipelineBuilder.registerOperation({
            name: "isEven",
            type: "filter",
            fn: (n) => n % 2 === 0,
          });
          PipelineBuilder.registerOperation({
            name: "double",
            type: "map",
            fn: (n) => n * 2,
          });
          PipelineBuilder.registerOperation({
            name: "errorOp",
            type: "map",
            fn: () => {
              throw new Error("test error");
            },
          });
        });

        test("should execute basic pipeline", async () => {
          const { result } = await new PipelineBuilder([1, 2, 3, 4])
            .addOperation("isEven")
            .addOperation("double")
            .execute();

          expect(result).toEqual([4, 8]);
        });

        test("should handle empty input", async () => {
          const { result, metrics } = await new PipelineBuilder([])
            .addOperation("isEven")
            .execute();

          expect(result).toEqual([]);
          expect(metrics.operationMetrics[0].inputCount).toBe(0);
        });

        test("should collect performance metrics", async () => {
          const mockNow = jest
            .spyOn(performance, "now")
            .mockImplementationOnce(() => 1000) //Initial start time
            .mockImplementationOnce(() => 1001) //Filter start
            .mockImplementationOnce(() => 1002) //Filter end
            .mockImplementationOnce(() => 1003) //Map start
            .mockImplementationOnce(() => 1004) //Map end
            .mockImplementationOnce(() => 1005); //Final end time

          const { metrics } = await new PipelineBuilder([1, 2])
            .addOperation("isEven")
            .addOperation("double")
            .execute();

          expect(metrics.totalTime).toBe(5);
          expect(metrics.operationMetrics).toEqual([
            {
              name: "isEven",
              type: "filter",
              duration: 1, // 1002 - 1001
              inputCount: 2,
              outputCount: 1,
            },
            {
              name: "double",
              type: "map",
              duration: 1,
              inputCount: 1,
              outputCount: 1,
            },
          ]);

          mockNow.mockRestore();
        });

        test("should collect performance metrics (dynamic)", async () => {
          let callCount = 0;
          const mockNow = jest
            .spyOn(performance, "now")
            .mockImplementation(() => 1000 + callCount++);

          const { metrics } = await new PipelineBuilder([1, 2])
            .addOperation("isEven")
            .addOperation("double")
            .execute();

          //Total calls = 1 (start) + 2 ops * 2 (start/end) + 1 (final) = 6
          expect(metrics.totalTime).toBe(5); //Call 5 (1005) - Call 0 (1000) = 5
          expect(metrics.operationMetrics[0].duration).toBe(1); // 1002 - 1001
          expect(metrics.operationMetrics[1].duration).toBe(1); // 1004 - 1003

          mockNow.mockRestore();
        });
      });

      describe("Error Handling", () => {
        let errorHandler: jest.Mock;

        beforeEach(() => {
          (PipelineBuilder as any).operationRegistry = {};

          PipelineBuilder.registerOperation({
            name: "errorOp",
            type: "map",
            fn: () => {
              throw new Error("test error");
            },
          });

          PipelineBuilder.registerOperation({
            name: "safeOp",
            type: "map",
            fn: (n) => n,
          });

          errorHandler = jest.fn().mockReturnValue("continue");
        });

        test("should stop pipeline on break signal", async () => {
          const handler = jest
            .fn()
            .mockReturnValueOnce("break")
            .mockReturnValueOnce("continue");

          const { result } = await new PipelineBuilder([1, 2, 3])
            .addOperation("errorOp")
            .addOperation("safeOp")
            .withErrorHandler(handler)
            .execute();

          expect(result).toEqual([1, 2, 3]);
          expect(handler).toHaveBeenCalledTimes(1);
        });

        test("should continue execution on continue signal", async () => {
          const { result } = await new PipelineBuilder([1])
            .addOperation("errorOp")
            .addOperation("safeOp")
            .withErrorHandler(() => "continue")
            .execute();

          expect(result).toEqual([1]);
        });
      });

      describe("Edge Cases", () => {
        test("should handle complete filtering", async () => {
          PipelineBuilder.registerOperation({
            name: "removeAll",
            type: "filter",
            fn: () => false,
          });

          const { result } = await new PipelineBuilder([1, 2, 3])
            .addOperation("removeAll")
            .execute();

          expect(result).toEqual([]);
        });

        test("should maintain intermediate states", async () => {
          PipelineBuilder.registerOperation({
            name: "addOne",
            type: "map",
            fn: (n) => n + 1,
          });
          PipelineBuilder.registerOperation({
            name: "gt3",
            type: "filter",
            fn: (n) => n > 3,
          });

          const { result } = await new PipelineBuilder([1, 2, 3])
            .addOperation("addOne")
            .addOperation("gt3")
            .execute();

          expect(result).toEqual([4]);
        });
      });
    });
  });
});
