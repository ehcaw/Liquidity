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
        setInputValue(`${selectedAccount.name} ${formatAccountNumber(value)}`);
      } else {
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
    const rawInput = e.target.value;
    
    // Check if we're dealing with an account name + number format already
    const isDisplayingAccountName = 
      accounts.some(acc => rawInput.includes(acc.name) && rawInput.includes(formatAccountNumber(acc.account_number)));
    
    // If we're in account name display mode and user is trying to delete
    if (isDisplayingAccountName) {
      // Reset to just the formatted account number to allow editing
      const accountNumber = parseAccountNumber(rawInput);
      const formattedNumber = formatAccountNumber(accountNumber);
      setInputValue(formattedNumber);
      onChange(accountNumber);
      return;
    }
    
    const digits = parseAccountNumber(rawInput);
    
    // Enforce max 12 digits
    if (digits.length > 12) {
      return;
    }
    
    // Format the value with dashes
    const formattedValue = formatAccountNumber(digits);
    setInputValue(formattedValue);
    onChange(digits);
    
    // Only convert to account name format when:
    // 1. The account number is EXACTLY 12 digits AND
    // 2. It EXACTLY matches one of our accounts
    if (digits.length === 12) {
      const exactMatch = accounts.find(acc => acc.account_number === digits);
      if (exactMatch) {
        // Check if the dropdown is open - only convert when it's closed
        // This gives user a chance to select from dropdown first
        if (!isOpen) {
          setInputValue(`${exactMatch.name} ${formatAccountNumber(exactMatch.account_number)}`);
        }
      }
    }
    
    setTimeout(() => {
      // Only adjust cursor if we didn't switch to account name format
      if (!isDisplayingAccountName) {
        // Count digits up to cursor position
        const cursorDigitPosition = parseAccountNumber(rawInput.substring(0, cursorPosition)).length;
        
        // Find where to place cursor in formatted string
        let newPosition = 0;
        let digitCount = 0;
        
        for (let i = 0; i < formattedValue.length; i++) {
          if (/\d/.test(formattedValue[i])) {
            digitCount++;
          }
          if (digitCount > cursorDigitPosition) {
            break;
          }
          newPosition = i + 1;
        }
        
        newPosition = Math.min(newPosition, formattedValue.length);
        e.target.setSelectionRange(newPosition, newPosition);
      }
    }, 0);
  };
  
  const findMatchingAccount = (input: string) => {
    // Remove any non-digit characters to compare just the numbers
    const cleanInput = input.replace(/\D/g, '');
    
    // Only try to find matches if we have a substantial input (e.g., at least 8 digits)
    if (cleanInput.length >= 8) {
      return accounts.find(acc => acc.account_number.includes(cleanInput));
    }
    return null;
  };

  const handleSelect = (accountNumber: string, accountName?: string) => {
    onChange(accountNumber);
    
    // Instead of setting just the account number:
    // setInputValue(accountNumber);
    
    // Find the selected account to get its name
    const selectedAccount = accounts.find(acc => acc.account_number === accountNumber);
    if (selectedAccount) {
      // Format the display value to include the account name
      setInputValue(`${selectedAccount.name} ${formatAccountNumber(accountNumber)}`);
    } else {
      setInputValue(formatAccountNumber(accountNumber));
    }
    
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