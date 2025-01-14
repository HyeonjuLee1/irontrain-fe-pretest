import React, { useState } from "react";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface SearchInputProps {
  placeholder: string;
  onClick: () => void;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
}

export const SearchInput = (props: SearchInputProps) => {
  const { placeholder, onClick, value, onChange, className, onKeyDown } = props;

  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className="flex flex-row">
      <div className="relative">
        <div className="relative">
          <input
            type="text"
            value={value}
            onChange={onChange}
            className={`w-[275px] px-3 py-[10px] placeholder-input-grey text-dark-grey text-[12px] rounded-md focus:outline-none border-gray-300 border bg-white ${className}`}
            placeholder={isFocused ? "" : placeholder}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={onKeyDown}
          />
        </div>
      </div>
      <div
        onClick={onClick}
        className={`cursor-pointer flex flex-row justify-center items-center rounded-md bg-primary w-[50px] h-[40px] !text-white ml-[10px]`}
      >
        <button>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </div>
    </div>
  );
};
