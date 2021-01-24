import React, { useState, useEffect } from "react";
import { useToasts } from "react-toast-notifications";

const Calc = () => {
  const { addToast } = useToasts();
  const inputControls = [
    { key: "key-ac", value: "AC", displayValue: "AC" },
    { key: "key-plus-minus", value: "+/-", displayValue: "±" },
    { key: "key-percent", value: "%", displayValue: "%" },
    { key: "key-7", value: "7", displayValue: "7" },
    { key: "key-8", value: "8", displayValue: "8" },
    { key: "key-9", value: "9", displayValue: "9" },
    { key: "key-4", value: "4", displayValue: "4" },
    { key: "key-5", value: "5", displayValue: "5" },
    { key: "key-6", value: "6", displayValue: "6" },
    { key: "key-1", value: "1", displayValue: "1" },
    { key: "key-2", value: "2", displayValue: "2" },
    { key: "key-3", value: "3", displayValue: "3" },
    { key: "key-0", value: "0", displayValue: "0" },
    { key: "key-dot", value: ".", displayValue: "." },
    { key: "key-erase", value: "erase", displayValue: "\u232b" },
  ];
  const actionControls = [
    { key: "divide", value: "/", displayValue: "÷" },
    { key: "multiply", value: "*", displayValue: "×" },
    { key: "minus", value: "-", displayValue: "-" },
    { key: "plus", value: "+", displayValue: "+" },
    { key: "equal", value: "=", displayValue: "=" },
  ];

  const [inputVal, setInputVal] = useState(0);
  const [currentInput, setCurrentInput] = useState(0);

  const handleInputClickEvent = (e, value) => {
    e.preventDefault();
    const valueDownCase = value.toLowerCase();

    switch (valueDownCase) {
      case "erase":
        eraseValue();
        break;
      case "ac":
        setInputVal(0);
        break;
      case "%":
        calcPercentage();
        break;
      case "+/-":
        calcPlusMinus();
        break;
      case "/":
      case "*":
      case "-":
      case "+":
        setInputValue(value, 1);
        break;
      case "=":
        calcResult();
        break;
      default:
        setInputValue(value, 0);
    }
  };

  const eraseValue = () => {
    let inputValue = inputVal.toString();
    if (inputValue && inputValue !== "") {
      inputValue = inputValue.slice(0, -1);
      setInputVal(inputValue);
    }
  };

  const validateInputStr = (inputStr) => {
    let inputValue = inputStr.toString();
    let lastChar = inputValue.slice(inputValue.length - 1);

    if ("+-*/".includes(lastChar) && "+-*/".includes(currentInput)) {
      inputValue = inputValue.slice(0, -1);
    }
    return inputValue;
  };

  const setInputValue = (value, isActionTrigger) => {
    console.log(value);
    if (value) {
      let inputValue = inputVal.toString();
      if (inputValue.slice(0, 1) === "0") {
        inputValue = inputValue.slice(1);
        if (inputValue === "") {
          inputValue = value;
          value = "";
        }
      }
      if (isActionTrigger) {
        inputValue = validateInputStr(inputValue);
        if (inputValue === "0") {
          return false;
        }
      }
      if (inputValue !== "") {
        inputValue += value;
        console.log(inputValue);
        if (inputValue === "." || inputValue < 1) {
          inputValue = "0" + inputValue;
        }
        if (inputValue.indexOf("..") > -1) {
          inputValue = inputValue.slice(0, -1);
        }
        setCurrentInput(value);
        setInputVal(inputValue);
      }
    }
  };

  const calcPercentage = () => {
    let inputValue = inputVal;
    inputValue = validateInputStr(inputValue);
    const result = inputValue / 100;
    setInputVal(result);
  };

  const calcPlusMinus = () => {
    let inputValue = inputVal;
    inputValue = validateInputStr(inputValue);
    try {
      let result = eval(inputValue);
      if (result) {
        if (result < 0) {
          result = Math.abs(result);
        } else {
          result = result * -1;
        }
        setInputVal(`${result}`);
      }
    } catch (err) {
      console.error(err);
      addToast("Invalid input. Please check the input value.", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  const calcResult = () => {
    if (inputVal && inputVal !== "") {
      const inputValue = validateInputStr(inputVal);
      try {
        const result = eval(inputValue);
        if (result) {
          setInputVal(`${result}`);
        }
      } catch (err) {
        console.error(err);
        addToast("Invalid input. Please check the input value.", {
          appearance: "error",
          autoDismiss: true,
        });
      }
    }
  };

  const handleKeyboardEvent = (event) => {
    const {code, key, keyCode} = event;

    if (key === "d" || key === "D") {
      document.body.classList.toggle("mode-dark");
    }
    if (code.includes("Digit") || code.includes("Numpad")) {
      if (
        (keyCode >= 48 && keyCode <= 57) ||
        (keyCode >= 96 && keyCode <= 105)
      ) {
        setInputValue(key.toString());
      }
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyboardEvent);
    return () => {
        document.removeEventListener("keydown", handleKeyboardEvent);
    };
  }, []);

  const inputControlsElem = inputControls.map((el, index) => (
    <li key={el.key} onClick={(e) => handleInputClickEvent(e, el.value)}>
      {el.displayValue}
    </li>
  ));
  const actionControlsElem = actionControls.map((el, index) => (
    <li key={el.key} onClick={(e) => handleInputClickEvent(e, el.value)}>
      {el.displayValue}
    </li>
  ));

  return (
    <div className="app">
      <h1 className="app--title">React Calculator</h1>
      <div className="app-wrapper">
        <input
          type="text"
          className="app-wrapper--input"
          name="calcinput"
          value={inputVal}
          readOnly
        />
        <div className="app-wrapper-input-action-btn">
          <ul className="calc-btn-list">{inputControlsElem}</ul>
          <ul className="calc-btn-list">{actionControlsElem}</ul>
        </div>
      </div>
    </div>
  );
};

export default Calc;
