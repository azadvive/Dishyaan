import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { EXPLORE_TRACKS } from "@/data/catalog";
import { accentBg } from "@/components/cards";
import type { ExploreTrack, ExploreTrackId } from "@/types";

interface CarouselProps {
  items: ReactNode[];
  initialScroll?: number;
}

type CardData = {
  src: string;
  category: string;
  title: string;
  accent: ExploreTrack["accent"];
  content: ReactNode;
};

export const CarouselContext = createContext<{
  onCardClose: (index: number) => void;
  currentIndex: number;
}>({
  onCardClose: () => {},
  currentIndex: 0,
});

/** Field imagery — generic stock photos used as card backdrops. */
const TRACK_IMAGES: Record<ExploreTrackId, string> = {
  "ai-ml":
    "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=3556&auto=format&fit=crop",
  robotics:
    "https://images.unsplash.com/photo-1531554694128-c4c6665f59c2?q=80&w=3387&auto=format&fit=crop",
  drones:
    "https://images.unsplash.com/photo-1713869791518-a770879e60dc?q=80&w=2333&auto=format&fit=crop",
  "computer-science":
    "https://images.unsplash.com/photo-1511984804822-e16ba72f5848?q=80&w=2048&auto=format&fit=crop",
  "stock-market":
    "https://images.unsplash.com/photo-1599202860130-f600f4948364?q=80&w=2515&auto=format&fit=crop",
  biotechnology:
    "https://images.unsplash.com/photo-1602081957921-9137a5d6eaee?q=80&w=2793&auto=format&fit=crop",
  physics:
    "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop",
  engineering:
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop",
  research:
    "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=2070&auto=format&fit=crop",
  entrepreneurship:
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop",
};

const FEATURED_TRACKS: ExploreTrackId[] = [
  "ai-ml",
  "robotics",
  "drones",
  "computer-science",
  "stock-market",
  "biotechnology",
];

/** Content shown inside an opened card — grounded in real DishaYaaN track data. */
function TrackContent({ track }: { track: ExploreTrack }) {
  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold sm:text-base">{track.tagline}</p>
      <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
        {track.summary}
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="border-2 border-ink bg-paper p-4">
          <p className="neo-label text-muted-foreground">Skills you build</p>
          <ul className="mt-3 space-y-1.5 text-sm">
            {track.skills.map((skill) => (
              <li key={skill}>— {skill}</li>
            ))}
          </ul>
        </div>
        <div className="border-2 border-ink bg-paper p-4">
          <p className="neo-label text-muted-foreground">Projects</p>
          <ul className="mt-3 space-y-1.5 text-sm">
            {track.projects.map((project) => (
              <li key={project}>— {project}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-2 border-ink bg-paper p-4">
        <p className="neo-label text-muted-foreground">Possible pathways</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {track.pathways.map((pathway) => (
            <li
              key={pathway}
              className="border border-ink/40 bg-card px-2 py-0.5 text-xs font-medium"
            >
              {pathway}
            </li>
          ))}
        </ul>
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Open for {track.classRange}. DishaYaaN guides exploration here — it does not
        predict a career for you. Take what you find to a human mentor before you
        decide anything.
      </p>
    </div>
  );
}

export const data: CardData[] = FEATURED_TRACKS.map((id) => {
  const track = EXPLORE_TRACKS.find((t) => t.id === id)!;
  return {
    src: TRACK_IMAGES[id],
    category: track.short,
    title: track.name,
    accent: track.accent,
    content: <TrackContent track={track} />,
  };
});

export default function AppleCardsCarouselDemo({
  eyebrow = "Fields to explore",
  title = "Get to know the fields worth exploring.",
  lead = "Ten emerging fields, one honest starting point. Open a card to see the skills, projects and pathways behind it — then take it to a mentor.",
}: {
  eyebrow?: string;
  title?: string;
  lead?: string;
}) {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="w-full">
      <div className="max-w-3xl">
        <span className="inline-flex items-center gap-2 border-2 border-ink bg-neo-cyan px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-deep">
          {eyebrow}
        </span>
        <h2 className="mt-5 text-3xl font-bold leading-[1.05] sm:text-4xl lg:text-5xl">
          {title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {lead}
        </p>
      </div>
      <Carousel items={cards} />
    </div>
  );
}

export const Carousel = ({ items, initialScroll = 0 }: CarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll;
      checkScrollability();
    }
  }, [initialScroll]);

  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  const scrollLeft = () => {
    carouselRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    carouselRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  const handleCardClose = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = isMobile() ? 230 : 384;
      const gap = isMobile() ? 16 : 32;
      const scrollPosition = (cardWidth + gap) * (index + 1);
      carouselRef.current.scrollTo({ left: scrollPosition, behavior: "smooth" });
      setCurrentIndex(index);
    }
  };

  const isMobile = () => typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <CarouselContext.Provider
      value={{ onCardClose: handleCardClose, currentIndex }}
    >
      <div className="relative w-full">
        <div
          ref={carouselRef}
          onScroll={checkScrollability}
          className="flex w-full overflow-x-scroll overscroll-x-auto scroll-smooth py-10 [scrollbar-width:none] md:py-16 [&::-webkit-scrollbar]:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-row justify-start gap-4 pl-4">
            {items.map((item, index) => (
              <motion.div
                key={"card" + index}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, delay: 0.2 * index, ease: "easeOut" },
                }}
                className="last:pr-[5%] md:last:pr-[33%]"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>
        <div className="mr-8 flex justify-end gap-2">
          <button
            type="button"
            aria-label="Scroll carousel left"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className="relative z-40 flex h-11 w-11 items-center justify-center border-2 border-ink bg-card transition-colors hover:bg-neo-cyan hover:text-deep disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Scroll carousel right"
            onClick={scrollRight}
            disabled={!canScrollRight}
            className="relative z-40 flex h-11 w-11 items-center justify-center border-2 border-ink bg-card transition-colors hover:bg-neo-cyan hover:text-deep disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </CarouselContext.Provider>
  );
};

export const Card = ({
  card,
  index,
  layout = false,
}: {
  card: CardData;
  index: number;
  layout?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { onCardClose } = useContext(CarouselContext);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handleClose();
      }
    }

    document.body.style.overflow = open ? "hidden" : "auto";
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useOutsideClick(containerRef, () => handleClose());

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    onCardClose(index);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 h-screen overflow-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 h-full w-full bg-deep/85 backdrop-blur-lg"
            />
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              ref={containerRef}
              layoutId={layout ? `card-${card.title}` : undefined}
              className="relative z-[60] mx-auto my-10 h-fit max-w-5xl border-2 border-ink bg-panel p-4 shadow-neo-lg md:p-10"
            >
              <button
                type="button"
                aria-label="Close card"
                onClick={handleClose}
                className="sticky top-0 right-0 z-10 ml-auto flex h-9 w-9 items-center justify-center border-2 border-ink bg-neo-cyan text-deep transition-colors hover:bg-neo-yellow"
              >
                <X className="h-5 w-5" />
              </button>
              <span
                className={cn(
                  "mt-4 inline-flex border-2 border-ink px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.16em]",
                  accentBg[card.accent],
                )}
              >
                {card.category}
              </span>
              <h3 className="mt-4 text-2xl font-bold md:text-4xl">{card.title}</h3>
              <div className="py-8">{card.content}</div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        layoutId={layout ? `card-${card.title}` : undefined}
        onClick={handleOpen}
        className="relative z-10 flex h-80 w-56 flex-col items-start justify-start overflow-hidden border-2 border-ink bg-card text-left transition-transform hover:-translate-y-1 md:h-[34rem] md:w-80"
      >
        <div className="pointer-events-none absolute inset-0 z-30 bg-gradient-to-b from-deep/85 via-deep/20 to-transparent" />
        <div className="relative z-40 p-6">
          <p
            className={cn(
              "inline-flex border-2 border-ink px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em]",
              accentBg[card.accent],
            )}
          >
            {card.category}
          </p>
          <p className="mt-3 max-w-xs text-xl font-bold leading-tight [text-wrap:balance] text-ink md:text-2xl">
            {card.title}
          </p>
        </div>
        <BlurImage
          src={card.src}
          alt={card.title}
          className="absolute inset-0 z-10 object-cover"
        />
        <span className="absolute bottom-4 left-6 z-40 inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-ink">
          Open card <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </motion.button>
    </>
  );
};

export const BlurImage = ({
  height,
  width,
  src,
  className,
  alt,
  fill,
  ...rest
}: {
  height?: number;
  width?: number;
  src: string;
  className?: string;
  alt?: string;
  fill?: boolean;
}) => {
  const [isLoading, setLoading] = useState(true);
  return (
    <img
      className={cn(
        "h-full w-full transition duration-300",
        isLoading ? "blur-sm" : "blur-0",
        className,
      )}
      onLoad={() => setLoading(false)}
      src={src}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      alt={alt ? alt : "Background of a beautiful view"}
      data-fill={fill ? "true" : undefined}
      {...rest}
    />
  );
};

export const useOutsideClick = (
  ref: RefObject<HTMLDivElement | null>,
  callback: (event: MouseEvent | TouchEvent) => void,
) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      callback(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, callback]);
};
