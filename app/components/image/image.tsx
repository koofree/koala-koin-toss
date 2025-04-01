import NextImage, { ImageProps } from 'next/image';

export const Image = ({ style, ...props }: ImageProps) => {
  const defaultStyle = { width: 'auto', height: 'auto' };
  if (props.width || props.height) {
    defaultStyle.width = props.width?.toString() ?? 'auto';
    defaultStyle.height = props.height?.toString() ?? 'auto';
  }
  return <NextImage width={0} height={0} style={{ ...defaultStyle, ...style }} {...props} />;
};
