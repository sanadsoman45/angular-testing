import { CalculatorService } from "./calculator.service";
import { LoggerService } from "./logger.service";
import { TestBed } from "@angular/core/testing";

describe("calculator service", () => {
  let loggerSpy: LoggerService;
  let calculator: CalculatorService;

  beforeEach(() => {
    loggerSpy = jasmine.createSpyObj("LoggerService", ["log"]);
    TestBed.configureTestingModule({
      providers: [
        CalculatorService,
        { provide: LoggerService, useValue: loggerSpy },
      ],
    });

    calculator = TestBed.inject(CalculatorService);
  });

  it("add two numbers", () => {
    expect(calculator.add(2, 2)).toBe(4);
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  });

  it("it should subtract two numbers", () => {
    expect(calculator.subtract(2, 2)).toBe(0, "unexpected subtraction result");
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  });
});
