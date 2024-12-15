// src/components/SearchableDropdown.tsx

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';

interface Option {
  id: string;
  label: string;
}

interface SearchableDropdownProps {
  value: string; // The selected option's id
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  fetchOptions: (searchTerm: string) => Promise<Option[]>;
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  icon,
  fetchOptions,
}) => {
  const [inputValue, setInputValue] = useState(''); // The text in the input field
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside the component to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
        validateInput();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, [value, inputValue]);

  // Fetch options when inputValue changes
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!inputValue) {
        setOptions([]);
        return;
      }

      setLoading(true);
      try {
        const fetchedOptions = await fetchOptions(inputValue);
        if (isMounted) {
          setOptions(fetchedOptions);
        }
      } catch (err) {
        console.error('Error fetching options:', err);
        if (isMounted) {
          setFetchError('Failed to load options.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Debounce the fetch call
    const debounceTimeout = setTimeout(() => {
      fetchData();
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(debounceTimeout);
    };
  }, [inputValue, fetchOptions]);

  // Fetch the selected option's label when the value prop changes
  useEffect(() => {
    let isMounted = true;

    const fetchSelectedOption = async () => {
      if (!value) {
        setInputValue('');
        return;
      }

      try {
        setLoading(true);
        const fetchedOptions = await fetchOptions(value);
        if (isMounted && fetchedOptions.length > 0) {
          const selected = fetchedOptions.find((opt) => opt.id === value);
          if (selected) {
            setInputValue(selected.label);
          }
        }
      } catch (err) {
        console.error('Error fetching selected option:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSelectedOption();

    return () => {
      isMounted = false;
    };
  }, [value, fetchOptions]);

  const handleSelect = (option: Option) => {
    onChange(option.id);
    setInputValue(option.label);
    setIsFocused(false);
    setOptions([]);
  };

  const validateInput = () => {
    // If inputValue matches an option, select it
    const matchedOption = options.find((opt) => opt.label === inputValue);
    if (matchedOption) {
      handleSelect(matchedOption);
    } else {
      // If no match and a value was previously selected, reset to previous value
      if (value) {
        // Fetch the selected option's label
        const fetchSelectedOption = async () => {
          try {
            setLoading(true);
            const fetchedOptions = await fetchOptions(value);
            if (fetchedOptions.length > 0) {
              const selected = fetchedOptions.find((opt) => opt.id === value);
              if (selected) {
                setInputValue(selected.label);
              } else {
                // No previous selection, clear input
                setInputValue('');
                onChange('');
              }
            }
          } catch (err) {
            console.error('Error fetching selected option:', err);
          } finally {
            setLoading(false);
          }
        };

        fetchSelectedOption();
      } else {
        // No previous selection, clear input
        setInputValue('');
        onChange('');
      }
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </span>
        )}
        <input
          type="text"
          value={inputValue}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => {
            setInputValue(e.target.value);
            setIsFocused(true);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            validateInput();
            setIsFocused(false);
          }}
          className={`w-full ${
            icon ? 'pl-10' : 'pl-4'
          } pr-4 py-3 bg-gray-800/50 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#573cff]`}
        />
      </div>

      <AnimatePresence>
        {isFocused && (options.length > 0 || loading || fetchError) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden"
          >
            <div className="max-h-60 overflow-y-auto">
              {options.length > 0 ? (
                options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleSelect(option)}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors ${
                      option.id === value
                        ? 'bg-[#573cff]/10 text-[#573cff]'
                        : 'text-white'
                    }`}
                  >
                    {option.label}
                  </button>
                ))
              ) : !loading ? (
                <div className="px-4 py-2 text-gray-400">No results found</div>
              ) : null}
              {loading && (
                <div className="px-4 py-2 text-gray-400">Loading...</div>
              )}
              {fetchError && (
                <div className="px-4 py-2 text-red-400">{fetchError}</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchableDropdown;
