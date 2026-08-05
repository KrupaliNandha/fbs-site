"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/app/lib/utils";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  placeholder?: string;
};

type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

function getOptions(children: React.ReactNode): SelectOption[] {
  return React.Children.toArray(children)
    .filter(React.isValidElement)
    .map((child) => {
      const element = child as React.ReactElement<
        React.OptionHTMLAttributes<HTMLOptionElement>
      >;

      return {
        value: String(element.props.value ?? element.props.children ?? ""),
        label: String(element.props.children ?? element.props.value ?? ""),
        disabled: element.props.disabled,
      };
    });
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      children,
      value,
      defaultValue,
      onChange,
      disabled,
      placeholder,
      name,
      id,
      required,
      ...props
    },
    ref,
  ) => {
    const options = React.useMemo(() => getOptions(children), [children]);
    const [open, setOpen] = React.useState(false);
    const [internalValue, setInternalValue] = React.useState(
      String(defaultValue ?? value ?? options[0]?.value ?? ""),
    );
    const rootRef = React.useRef<HTMLDivElement>(null);
    const selectedValue = String(value ?? internalValue);
    const selectedIndex = Math.max(
      0,
      options.findIndex((option) => option.value === selectedValue),
    );
    const selectedOption = options[selectedIndex];

    React.useEffect(() => {
      function handlePointerDown(event: PointerEvent) {
        if (!rootRef.current?.contains(event.target as Node)) {
          setOpen(false);
        }
      }

      document.addEventListener("pointerdown", handlePointerDown);
      return () => document.removeEventListener("pointerdown", handlePointerDown);
    }, []);

    React.useEffect(() => {
      if (value !== undefined) {
        setInternalValue(String(value));
      }
    }, [value]);

    function choose(option: SelectOption) {
      if (option.disabled || disabled) return;

      setInternalValue(option.value);
      setOpen(false);

      onChange?.({
        target: { value: option.value, name },
        currentTarget: { value: option.value, name },
      } as React.ChangeEvent<HTMLSelectElement>);
    }

    function moveSelection(direction: 1 | -1) {
      if (options.length === 0) return;

      let nextIndex = selectedIndex;
      for (let step = 0; step < options.length; step += 1) {
        nextIndex =
          (nextIndex + direction + options.length) % options.length;
        if (!options[nextIndex]?.disabled) {
          choose(options[nextIndex]);
          return;
        }
      }
    }

    return (
      <div ref={rootRef} className="relative w-full">
        <select
          ref={ref}
          name={name}
          id={id}
          required={required}
          disabled={disabled}
          value={selectedValue}
          onChange={() => undefined}
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
          {...props}
        >
          {children}
        </select>

        <button
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              if (!open) setOpen(true);
              moveSelection(1);
            }

            if (event.key === "ArrowUp") {
              event.preventDefault();
              if (!open) setOpen(true);
              moveSelection(-1);
            }

            if (event.key === "Escape") {
              setOpen(false);
            }
          }}
          className={cn(
            "flex h-10 w-full items-center justify-between gap-3 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-left text-sm font-medium text-slate-900 shadow-sm transition hover:border-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/25 focus-visible:border-slate-500 disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
        >
          <span className="truncate">
            {selectedOption?.label || placeholder || "Select option"}
          </span>
          <ChevronDown
            size={17}
            className={cn(
              "shrink-0 text-slate-500 transition-transform",
              open && "rotate-180",
            )}
          />
        </button>

        {open && (
          <div
            role="listbox"
            className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-lg border border-slate-300 bg-white py-1 shadow-xl"
          >
            {options.map((option) => {
              const isSelected = option.value === selectedValue;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  disabled={option.disabled}
                  onClick={() => choose(option)}
                  className={cn(
                    "flex min-h-9 w-full items-center justify-between gap-3 px-3.5 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-50",
                    isSelected && "bg-slate-900 text-white hover:bg-slate-900 hover:text-white",
                  )}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected && <Check size={15} className="shrink-0" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";

export { Select };
