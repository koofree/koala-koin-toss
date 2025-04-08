import NextImage, { ImageProps } from 'next/image';

export const Image = ({ style, ...props }: ImageProps) => {
  const defaultStyle: { width?: string; height?: string } = { width: 'auto', height: 'auto' };

  if (props.width === undefined || props.height === undefined) {
    props.width = props.width || 0;
    props.height = props.height || 0;
  }

  if (props.width || props.height) {
    defaultStyle.width = props.width ? `${props.width}px` : 'auto';
    defaultStyle.height = props.height ? `${props.height}px` : 'auto';
  }
  return <NextImage style={{ ...defaultStyle, ...style }} {...props} unoptimized />;
};
