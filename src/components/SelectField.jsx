import React from 'react';
import GoogleIcon from './GoogleIcon';

export default function SelectField({
  value,
  onChange,
  children,
  variant = 'form', // 'form' | 'filter'
  className = '',
  ariaLabel,
}) {
  const isFilter = variant === 'filter';

  return (
    <div className={`relative ${isFilter ? 'inline-block' : 'w-full'} ${className}`}>
      <select
        value={value}
        onChange={onChange}
        aria-label={ariaLabel}
        className={`w-full cursor-pointer appearance-none rounded-full border outline-none transition focus:border-[#1D4ED8] ${
          isFilter
            ? 'border-[#E2E8F0] bg-[#F8FAFC] py-2.5 pr-10 pl-4 text-xs font-semibold text-[#334155] hover:border-[#CBD5E1]'
            : 'border-[#E2E8F0] bg-white py-2.5 pr-10 pl-4 text-sm text-[#1E293B]'
        }`}
      >
        {children}
      </select>
      <GoogleIcon
        name="keyboard_arrow_down"
        size={18}
        className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-[#475569]"
      />
    </div>
  );
}
