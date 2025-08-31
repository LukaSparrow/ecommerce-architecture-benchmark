"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface ProductsPerPageProps {
  value: number;
  onChange: (value: number) => void;
}

const PRESET_OPTIONS = [12, 24, 48, 96];
const MIN_PRODUCTS = 1;
const MAX_PRODUCTS = 200;

export function ProductsPerPage({ value, onChange }: ProductsPerPageProps) {
  const [isCustom, setIsCustom] = useState(false);
  const [customValue, setCustomValue] = useState(value.toString());
  const [tempValue, setTempValue] = useState(value.toString());

  // Check if current value is a preset or custom
  useEffect(() => {
    const isPreset = PRESET_OPTIONS.includes(value);
    setIsCustom(!isPreset);
    setCustomValue(value.toString());
    setTempValue(value.toString());
  }, [value]);

  const handlePresetChange = (newValue: string) => {
    if (newValue === "custom") {
      setIsCustom(true);
      setTempValue(customValue);
    } else {
      const numValue = Number.parseInt(newValue);
      setIsCustom(false);
      onChange(numValue);
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("productsPerPage", numValue.toString());
      }
    }
  };

  const handleCustomSubmit = () => {
    const numValue = Number.parseInt(tempValue);
    if (numValue >= MIN_PRODUCTS && numValue <= MAX_PRODUCTS) {
      setCustomValue(tempValue);
      onChange(numValue);
      setIsCustom(false);
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("productsPerPage", numValue.toString());
      }
    }
  };

  const handleCustomCancel = () => {
    setTempValue(customValue);
    setIsCustom(false);
  };

  const isValidCustomValue = () => {
    const numValue = Number.parseInt(tempValue);
    return (
      !isNaN(numValue) && numValue >= MIN_PRODUCTS && numValue <= MAX_PRODUCTS
    );
  };

  const getCurrentSelectValue = () => {
    if (isCustom) return "custom";
    return PRESET_OPTIONS.includes(value) ? value.toString() : "custom";
  };

  return (
    <div className="flex items-center gap-2">
      <Label
        htmlFor="products-per-page"
        className="text-sm font-medium whitespace-nowrap"
      >
        Show:
      </Label>

      {!isCustom ? (
        <Select
          value={getCurrentSelectValue()}
          onValueChange={handlePresetChange}
        >
          <SelectTrigger className="w-24" id="products-per-page">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PRESET_OPTIONS.map((option) => (
              <SelectItem key={option} value={option.toString()}>
                {option}
              </SelectItem>
            ))}
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      ) : (
        <div className="flex items-center gap-1">
          <Input
            type="number"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className="w-20 h-10"
            min={MIN_PRODUCTS}
            max={MAX_PRODUCTS}
            placeholder="24"
          />
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={handleCustomSubmit}
            disabled={!isValidCustomValue()}
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={handleCustomCancel}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <span className="text-sm text-muted-foreground whitespace-nowrap">
        per page
      </span>
    </div>
  );
}
