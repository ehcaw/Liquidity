"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ChevronDown } from "lucide-react";
import { Database } from "@/types/db";
import { Control } from "react-hook-form";

type Account = Database["public"]["Tables"]["accounts"]["Row"];

interface AccountComboBoxProps {
  accounts: Account[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const AccountComboBox = ({
  accounts,
  value,
  onChange,
  placeholder = "Enter Account"
}: AccountComboBoxProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Update input value when selected value changes
  useEffect(() => {
    if (value) {
      const selectedAccount = accounts.find(acc => acc.account_number === value);
      if (selectedAccount) {
        // Format the account number when it's set from outside
        setInputValue(formatAccountNumber(value));
      }
    } else {
      setInputValue("");
    }
  }, [value, accounts]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const formatAccountNumber = (value: string): string => {
    // Remove any non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Start building the formatted result
    let formatted = '';
    
    // Apply formatting pattern, with dashes after every 4 digits
    for (let i = 0; i < digits.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += '-';
      }
      formatted += digits[i];
    }
    
    return formatted;
  };

  const parseAccountNumber = (formattedValue: string): string => {
    return formattedValue.replace(/\D/g, '');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cursorPosition = e.target.selectionStart || 0;
    const rawInput = e.target.value.replace(/[^\d-]/g, '');
    const digits = parseAccountNumber(rawInput);
  
    // Enforce max 12 digits
    if (digits.length > 12) {
      return;
    }
  
    const formattedValue = formatAccountNumber(digits);
    setInputValue(formattedValue);
  
    onChange(digits);
  
    setTimeout(() => {
      let newPosition = cursorPosition;
  
      if (digits.length === 4 && cursorPosition === 4) {
        newPosition = 5;
      } else if (digits.length === 8 && cursorPosition === 9) {
        newPosition = 10;
      }
  
      if (
        e.target.value.length < inputValue.length &&
        (cursorPosition === 5 || cursorPosition === 10)
      ) {
        newPosition = cursorPosition - 1;
      }
  
      newPosition = Math.min(newPosition, formattedValue.length);
      e.target.setSelectionRange(newPosition, newPosition);
    }, 0);
  };
  

  const handleSelect = (accountNumber: string) => {
    onChange(accountNumber);
    setInputValue(accountNumber);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="pr-10 rounded-md border border-input"
          onClick={() => setIsOpen(true)}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full"
          onClick={() => setIsOpen(!isOpen)}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
      
      {isOpen && (
        <div 
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-popover rounded-md border shadow-md"
        >
          <div className="max-h-60 overflow-auto p-1">
            {accounts.map((account) => (
              <div
                key={account.account_number}
                className="relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                onClick={() => handleSelect(account.account_number)}
              >
                {account.name} {formatAccountNumber(account.account_number)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper component to use with react-hook-form
export const AccountFormField = ({ 
  control, 
  name, 
  accounts, 
  label 
}: {
  control: Control<Record<string, unknown>>;
  name: string;
  accounts: Account[];
  label: string;
}) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <AccountComboBox
            accounts={accounts}
            value={field.value as string}
            onChange={field.onChange}
            placeholder="Enter Account"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);