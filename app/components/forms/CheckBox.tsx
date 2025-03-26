interface CheckBoxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export const CheckBox = ({
  checked,
  onChange,
  label,
  disabled = false,
  className,
}: CheckBoxProps) => {
  return (
    <div className="relative flex items-center">
      <div className="flex flex-col items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className={`appearance-none w-4 h-4 mr-2 cursor-pointer
                    bg-[url('/images/middle/checkbox/ic_checkbox_none.png')] bg-contain bg-no-repeat
                    checked:bg-[url('/images/middle/checkbox/ic_checkbox_checked.png')]
                    active:bg-[url('/images/middle/checkbox/ic_checkbox_${checked ? 'checked_pressed' : 'pressed'}.png')]
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                    ${className}`}
        />
        {label && (
          <label className="block text-left mb-2 absolute -top-6 left-10 right-0 text-gray-300 text-xs">
            {label}
          </label>
        )}
      </div>
    </div>
  );
};
