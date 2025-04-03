interface PanelButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  disabledText?: string;
  children: React.ReactNode;
  width?: number;
  height?: number;
  fontSize?: number;
  className?: string;
}

export const PanelButton = ({
  onClick,
  disabled,
  disabledText,
  children,
  width,
  height,
  fontSize,
  className,
}: PanelButtonProps) => {
  const Width = width || 140;
  const Height = height || 28;
  const FontSize = fontSize || 9;

  return (
    <button
      className={`w-[${Width}px] h-[${Height}px] 
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
        <span className={`text-white text-[${FontSize}px]`}>{disabledText}</span>
      ) : (
        <span className={`text-white text-[${FontSize}px]`}>{children}</span>
      )}
    </button>
  );
};
