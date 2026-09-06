'use client';
import React from 'react';

interface BoxSelectProps {
  title: string;
  boxSize: number;
  items: { value: string; selected: boolean }[];
  onChange?: (value: string) => void;
}

const BoxSelect = ({
  title = 'Default Title',
  boxSize = 50,
  items = [],
  onChange,
}: Readonly<BoxSelectProps>) => {
  const [selectedValue, setSelectedValue] = React.useState<string>(
    items.length > 0 ? items.find((item) => item.selected)?.value ?? '' : ''
  );

  const handleChange = (value: string) => {
    setSelectedValue(value);
    onChange?.(value);
  };

  return (
    <div>
      <p className="subtitle-1 pb-1">
        {title}:{' '}
        {selectedValue && <span className="text-caption">{selectedValue}</span>}
      </p>
      <div className="flex gap-3">
        {items.map((item) => (
          <button
            key={item.value}
            style={{ width: boxSize, height: boxSize }}
            className={`flex items-center justify-center pt-0.5 border ${
              selectedValue === item.value
                ? 'border-wearit-red text-wearit-red'
                : 'border-wearit-grey-dark text-wearit-grey-dark dark:border-zinc-400 dark:text-zinc-400'
            } hover:border-wearit-red hover:text-wearit-red hover:cursor-pointer`}
            onClick={() => handleChange(item.value)}
          >
            {item.value}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BoxSelect;
