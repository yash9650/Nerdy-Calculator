import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ICalculation } from "../../Interfaces/common.interface";

const Calculator: React.FC = () => {
  const operatorKeysArr = ["/", "*", "-", "+", "="] as const;
  const digitalKeysArr = [
    "9",
    "8",
    "7",
    "6",
    "5",
    "4",
    "3",
    "2",
    "1",
    "0",
    ".",
  ];

  const [calculationState, setCalculationState] = useState({
    currentValue: "0",
    calculationStr: "",
    lastOperation: "",
    result: "",
    calculationName: "",
  });

  const [calculationList, setCalculationList] = useState<ICalculation[]>([]);

  const handleDigitClick = (digit: string) => {
    if (calculationState.currentValue === "0") {
      setCalculationState((old) => {
        return {
          ...old,
          currentValue: digit,
        };
      });
    } else {
      setCalculationState((old) => {
        let currentValue = old.currentValue + digit;
        return {
          ...old,
          currentValue,
        };
      });
    }
  };

  const handleOperatorClick = (operation: (typeof operatorKeysArr)[number]) => {
    let calculationStr =
      calculationState.calculationStr +
      calculationState.lastOperation +
      calculationState.currentValue;

    if (calculationState.currentValue === "0") {
      calculationStr = calculationState.calculationStr;
    }
    if (operation === "=") {
      let result = eval(calculationStr);
      setCalculationState((old) => {
        return {
          ...old,
          result: calculationState ? `${Math.round(result * 100) / 100}` : "",
          calculationStr,
          currentValue: "0",
          lastOperation: "",
        };
      });
    } else {
      setCalculationState((old) => {
        if (old.currentValue === "0" && !old.calculationStr) {
          return {
            ...old,
          };
        }

        return {
          ...old,
          result: "",
          lastOperation: operation,
          calculationStr,
          currentValue: "0",
        };
      });
    }
  };

  const calculatePercentage = () => {
    setCalculationState((old) => {
      let total = eval(old.calculationStr);
      let result = parseFloat(old.currentValue) / 100;
      if (total) {
        old.calculationStr = total.toString();
        result = (total * parseFloat(old.currentValue)) / 100;
      }

      return {
        ...old,
        currentValue: result.toString(),
      };
    });
  };

  const saveCalculation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!calculationState.calculationStr) {
      toast.error("Please perform a calculation first");
      return;
    }

    if (!calculationState.calculationName) {
      toast.error("Please enter a calculation name");
      return;
    }

    let result = calculationState.result;
    let calculationStr = calculationState.calculationStr;

    if (calculationState.currentValue !== "0") {
      calculationStr =
        calculationState.calculationStr +
        calculationState.lastOperation +
        calculationState.currentValue;

      result = eval(calculationStr);
    }

    // promt confirmation
    const confirm = window.prompt(
      "Are you sure you want to save this calculation?",
      calculationStr
    );

    if (!confirm) {
      return;
    }

    fetch("/calculation/createCalculation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        calculation: calculationStr,
        name: calculationState.calculationName,
        result,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast.success("Calculation saved successfully");
          getUserCalculations();
          setCalculationState({
            currentValue: "0",
            calculationStr: "",
            lastOperation: "",
            result: "",
            calculationName: "",
          });
        }
      })
      .catch((err) => {
        toast.error("Unable to save calculation");
      });
  };

  const getUserCalculations = () => {
    fetch("/calculation/getAllUserCalculations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCalculationList(data.result);
        } else {
          throw new Error(data.errorMessage || "Unable to fetch calculations");
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const deleteCaclulation = (id: number) => {
    fetch("/calculation/deleteCalculationById", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast.success("Calculation deleted successfully");
          getUserCalculations();
        } else {
          throw new Error(data.errorMessage || "Unable to delete caculation");
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  useEffect(() => {
    getUserCalculations();
  }, []);

  return (
    <div className="container">
      {/* code here */}
      <div className="row">
        <div className="col-md-6 col-12">
          <div className="row">
            <div className="col-12">
              <div className="calculator-container my-4">
                {calculationState.calculationStr && (
                  <div className="calculator-display py-0">
                    {`${calculationState.calculationStr}
                      ${calculationState.lastOperation}
                      ${
                        calculationState.currentValue === "0"
                          ? ""
                          : calculationState.currentValue
                      }`}
                  </div>
                )}
                {!calculationState.result ? (
                  <div className="calculator-display result">
                    {calculationState.calculationStr &&
                    calculationState.currentValue !== "0"
                      ? eval(
                          calculationState.calculationStr +
                            calculationState.lastOperation +
                            calculationState.currentValue
                        )
                      : calculationState.currentValue}
                  </div>
                ) : (
                  <div className="calculator-display">
                    Ans= {calculationState.result}
                  </div>
                )}
                <div className="calculator-keypad">
                  <div className="input-keys">
                    <div>
                      <div className="function-keys">
                        <button
                          className="calculator-key key-clear"
                          onClick={() => {
                            setCalculationState((old) => {
                              return {
                                ...old,
                                result: "",
                                currentValue: "0",
                                calculationStr: "",
                                lastOperation: "",
                              };
                            });
                          }}
                        >
                          AC
                        </button>
                        <button
                          className="calculator-key key-sign"
                          onClick={() => {
                            setCalculationState((old) => {
                              return {
                                ...old,
                                currentValue: (
                                  parseFloat(old.currentValue) * -1
                                ).toString(),
                              };
                            });
                          }}
                        >
                          ±
                        </button>
                        <button
                          className="calculator-key key-percent"
                          onClick={calculatePercentage}
                        >
                          %
                        </button>
                      </div>
                      <div className="digit-keys">
                        {digitalKeysArr.map((key) => {
                          return (
                            <button
                              onClick={() => handleDigitClick(key)}
                              className={`key-${key}`}
                              key={key}
                            >
                              {key}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div className="operator-keys">
                      {operatorKeysArr.map((key) => {
                        return (
                          <button
                            onClick={() => {
                              handleOperatorClick(key);
                            }}
                            style={{
                              backgroundColor:
                                calculationState.lastOperation === key
                                  ? "white"
                                  : "orange",
                              color:
                                calculationState.lastOperation === key
                                  ? "orange"
                                  : "black",
                            }}
                            key={key}
                          >
                            {key}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12">
              <label htmlFor="calculationName">Calculation Name</label>
              <form onSubmit={saveCalculation} className="d-flex">
                <input
                  type="text"
                  className="form-control w-75"
                  name="calculationName"
                  id="calculationName"
                  value={calculationState.calculationName}
                  onChange={(e) => {
                    setCalculationState((old) => {
                      return {
                        ...old,
                        calculationName: e.target.value,
                      };
                    });
                  }}
                />
                <button type="submit" className="btn btn-primary btn-sm ms-2">
                  Save
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="col-lg-6 col-12 mt-3">
          <div className="calculation-list-container">
            <div className="calculation-list-heading">
              <h5>Your Previous Calculations</h5>
            </div>
            <div className="calculation-list-table">
              <table>
                <thead>
                  <tr className="border-bottom border-dark">
                    <th>Name</th>
                    <th>Calculation</th>
                    <th>Result</th>
                    <th>actions</th>
                  </tr>
                </thead>
                <tbody>
                  {calculationList.length > 0 ? (
                    <>
                      {calculationList.map((calculation, index) => {
                        return (
                          <tr
                            className="border-bottom"
                            key={`caculation-${index}`}
                          >
                            <td>{calculation.name}</td>
                            <td>{calculation.calculation}</td>
                            <td>{calculation.result}</td>
                            <td>
                              <div>
                                <button className="btn border-0 btn-sm">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-bootstrap-reboot"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M1.161 8a6.84 6.84 0 1 0 6.842-6.84.58.58 0 1 1 0-1.16 8 8 0 1 1-6.556 3.412l-.663-.577a.58.58 0 0 1 .227-.997l2.52-.69a.58.58 0 0 1 .728.633l-.332 2.592a.58.58 0 0 1-.956.364l-.643-.56A6.812 6.812 0 0 0 1.16 8z" />
                                    <path d="M6.641 11.671V8.843h1.57l1.498 2.828h1.314L9.377 8.665c.897-.3 1.427-1.106 1.427-2.1 0-1.37-.943-2.246-2.456-2.246H5.5v7.352h1.141zm0-3.75V5.277h1.57c.881 0 1.416.499 1.416 1.32 0 .84-.504 1.324-1.386 1.324h-1.6z" />
                                  </svg>
                                </button>
                                <button
                                  className="btn btn-sm btn-danger p-1"
                                  onClick={() =>
                                    deleteCaclulation(calculation.id)
                                  }
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-trash"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </>
                  ) : (
                    <tr>
                      <td rowSpan={4}>No Calcutions yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
