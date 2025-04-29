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
        setInputValue(value);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits in the input
    const newValue = e.target.value.replace(/[^\d]/g, '');
    
    // Update input only if it's empty or contains only digits
    if (newValue === '' || /^\d+$/.test(newValue)) {
      setInputValue(newValue);
      
      // Only update the form value when a full account number is entered (12 digits)
      if (newValue.length === 12) {
        onChange(newValue);
      }
    }
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
                {account.name} - {account.account_number}
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