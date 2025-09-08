import React, {
  useState,
  useRef,
  useEffect,
  ReactNode,
  forwardRef,
  KeyboardEvent,
} from "react";

interface CarouselProps {
  children: ReactNode;
  opts?: {
    align?: "start" | "center";
    loop?: boolean;
  };
  className?: string;
}

const Carousel: React.FC<CarouselProps> = ({
  children,
  opts = {},
  className = "",
}) => {
  const { align = "start", loop = false } = opts;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Превращаем children в массив, чтобы корректно рабоать с ними
  const childrenArray = React.Children.toArray(children);
  const itemsCount = childrenArray.length;

  const scrollToIndex = (index: number) => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const childrenElements = Array.from(container.children) as HTMLElement[];
    if (!childrenElements[index]) return;

    const target = childrenElements[index];
    if (align === "start") {
      container.scrollTo({
        left: target.offsetLeft,
        behavior: "smooth",
      });
    } else if (align === "center") {
      const offset =
        target.offsetLeft - container.offsetWidth / 2 + target.offsetWidth / 2;
      container.scrollTo({ left: offset, behavior: "smooth" });
    }
  };

  const next = () => {
    let nextIndex = currentIndex + 1;
    if (nextIndex >= itemsCount) {
      if (loop) nextIndex = 0;
      else nextIndex = itemsCount - 1;
    }
    setCurrentIndex(nextIndex);
  };

  const prev = () => {
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
      if (loop) prevIndex = itemsCount - 1;
      else prevIndex = 0;
    }
    setCurrentIndex(prevIndex);
  };

  // Навигация с клавиатуры (стрелки влево/вправо)
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      prev();
    } else if (e.key === "ArrowRight") {
      next();
    }
  };

  useEffect(() => {
    scrollToIndex(currentIndex);
  }, [currentIndex]);

  return (
    <div
      className={`relative ${className}`}
      tabIndex={0}
      onKeyDown={onKeyDown}
      role="region"
      aria-roledescription="carousel"
      aria-label="Carousel"
    >
      <div
        ref={containerRef}
        className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory"
      >
        {childrenArray}
      </div>
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition"
      >
        ‹
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition"
      >
        ›
      </button>
    </div>
  );
};

interface CarouselContentProps {
  children: ReactNode;
  className?: string;
}

const CarouselContent = forwardRef<HTMLDivElement, CarouselContentProps>(
  ({ children, className = "" }, ref) => (
    <div
      ref={ref}
      className={`flex snap-x snap-mandatory overflow-x-auto scroll-smooth ${className}`}
    >
      {children}
    </div>
  )
);
CarouselContent.displayName = "CarouselContent";

interface CarouselItemProps {
  children: ReactNode;
  className?: string;
}

const CarouselItem: React.FC<CarouselItemProps> = ({
  children,
  className = "",
}) => (
  <div className={`snap-start flex-shrink-0 ${className}`}>{children}</div>
);

interface CarouselButtonProps {
  className?: string;
  onClick?: () => void;
}

const CarouselPrevious: React.FC<CarouselButtonProps> = ({
  className = "",
  onClick,
}) => (
  <button
    onClick={onClick}
    aria-label="Previous slide"
    className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition ${className}`}
  >
    ‹
  </button>
);

const CarouselNext: React.FC<CarouselButtonProps> = ({
  className = "",
  onClick,
}) => (
  <button
    onClick={onClick}
    aria-label="Next slide"
    className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition ${className}`}
  >
    ›
  </button>
);

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
};
