interface PanelButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  disabledText?: string;
  children: React.ReactNode;
  textClassName?: string;
  className?: string;
}

export const PanelButton = ({
  onClick,
  disabled,
  disabledText,
  children,
  textClassName,
  className,
}: PanelButtonProps) => {
  return (
    <button
      className={`
                cursor-pointer 
                flex items-center justify-center
                select-none 
                touch-none
                bg-no-repeat bg-cover bg-center
                bg-[url('/images/middle/buttons/btn_flip-cta_no-txt.png')]
                active:bg-[url('/images/middle/buttons/btn_flip-cta_pressed_no-txt.png')]
                disabled:opacity-50 ${className ? className : ''}
              `}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {disabled ? (
        <span className={`text-white ${textClassName}`}>{disabledText}</span>
      ) : (
        <span className={`text-white ${textClassName}`}>{children}</span>
      )}
    </button>
  );
};
