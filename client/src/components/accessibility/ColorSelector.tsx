import React from 'react';
import { ColorOption } from '@/contexts/AccessibilityContext';

interface ColorSelectorProps {
  title: string;
  selectedColor: ColorOption;
  onSelectColor: (color: ColorOption) => void;
}

const colorOptions: Array<{ value: ColorOption; label: string; bgColor: string; textColor: string }> = [
  { value: 'blue', label: 'Blue', bgColor: '#0077cc', textColor: 'white' },
  { value: 'purple', label: 'Purple', bgColor: '#8e44ad', textColor: 'white' },
  { value: 'red', label: 'Red', bgColor: '#e74c3c', textColor: 'white' },
  { value: 'orange', label: 'Orange', bgColor: '#e67e22', textColor: 'white' },
  { value: 'teal', label: 'Teal', bgColor: '#16a085', textColor: 'white' },
  { value: 'green', label: 'Green', bgColor: '#558b2f', textColor: 'white' },
  { value: 'white', label: 'White', bgColor: '#ffffff', textColor: 'black' },
  { value: 'black', label: 'Black', bgColor: '#000000', textColor: 'white' },
];

export function ColorSelector({ title, selectedColor, onSelectColor }: ColorSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="mb-3">
      <button
        className="w-full flex items-center justify-between bg-gray-100 hover:bg-gray-200 rounded-md px-4 py-2 text-sm text-gray-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        <div 
          className="w-6 h-6 rounded-full border border-gray-300"
          style={{ 
            backgroundColor: selectedColor === 'default' 
              ? 'transparent' 
              : colorOptions.find(opt => opt.value === selectedColor)?.bgColor 
          }}
        />
      </button>

      {isOpen && (
        <div className="mt-2 p-2 bg-white rounded-md shadow-lg border border-gray-200">
          <div className="grid grid-cols-4 gap-2">
            {colorOptions.map((option) => (
              <button
                key={option.value}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  selectedColor === option.value ? 'ring-2 ring-offset-2 ring-primary' : ''
                }`}
                style={{ backgroundColor: option.bgColor, color: option.textColor }}
                onClick={() => {
                  onSelectColor(option.value);
                  setIsOpen(false);
                }}
                title={option.label}
                aria-label={`${option.label} color`}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-end">
            <button 
              className="px-3 py-1 text-xs text-gray-700 hover:bg-gray-100 rounded"
              onClick={() => {
                onSelectColor('default');
                setIsOpen(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}