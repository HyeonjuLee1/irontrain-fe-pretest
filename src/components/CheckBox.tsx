import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckSquare, faSquare } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";

export interface CheckBoxProps {
  checked: boolean;
  indeterminate?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  checkedClassName?: string;
  unCheckedClassName?: string;
  disabled?: boolean;
}

const CheckBox = ({
  checked,
  indeterminate,
  onChange,
  handleBlur,
  checkedClassName,
  unCheckedClassName,
  disabled,
}: CheckBoxProps) => {
  return (
    <>
      <label
        className={`flex items-center cursor-pointer h-[20px] w-fit ${clsx({
          "!cursor-default opacity-50": disabled,
        })}`}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => {
            onChange(e);
          }}
          disabled={disabled}
          onBlur={handleBlur}
          className="appearance-none"
        />
        {/* -ml-[4px] */}
        {indeterminate ? (
          <div
            className={`text-primary w-[20px] h-[20px] -mt-[4px] tracking-tighter ${checkedClassName}`}
          >
            <svg
              width="25"
              height="24"
              viewBox="0 0 25 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19.5 3H5.5C4.39 3 3.5 3.9 3.5 5V19C3.5 20.1 4.39 21 5.5 21H19.5C20.61 21 21.5 20.1 21.5 19V5C21.5 3.9 20.61 3 19.5 3Z"
                fill="#1E97F5"
              />
              <rect
                x="6.49023"
                y="11"
                width="12.0195"
                height="2"
                fill="#D9D9D9"
              />
            </svg>
          </div>
        ) : checked ? (
          // -ml-[3px]
          <FontAwesomeIcon
            icon={faCheckSquare}
            className={`text-primary w-[20px] h-[20px] 
              tracking-tighter ${checkedClassName}`}
          />
        ) : (
          <FontAwesomeIcon
            icon={faSquare}
            className={`text-white w-[14px] h-[14px] rounded-sm border-2 border-solid border-check-border ${unCheckedClassName}`}
          />
        )}
      </label>
    </>
  );
};

export default CheckBox;
