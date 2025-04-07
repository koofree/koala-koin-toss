import { Image } from './image';

export const Stars = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, index) => {
        const randomTop = Math.floor(Math.random() * 60);
        const randomLeft = Math.floor(Math.random() * 100);
        const randomSize = Math.floor(Math.random() * 20) + 10; // Between 10px and 30px
        const randomOpacity = Math.random() * 0.5 + 0.5; // Between 0.2 and 0.7

        return (
          <div
            key={index}
            className="absolute"
            style={{
              top: `${randomTop}%`,
              left: `${randomLeft}%`,
              opacity: randomOpacity,
            }}
          >
            <Image
              src={`/images/gif/star${Math.floor(Math.random() * 2) + 1}.gif`}
              alt="Star"
              width={randomSize}
              height={randomSize}
              unoptimized
            />
          </div>
        );
      })}
    </div>
  );
};
