import { useLayoutEffect, useRef, useState } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";

// Renders only the rows near the screen. The page itself scrolls (window),
// so rows are positioned inside one tall box. Each row is measured after it
// renders, so rows can have different heights.
const VirtualList = ({
  items,
  getKey,
  renderItem,
  estimateSize = 160,
  gap = 16,
  overscan = 4,
}) => {
  const listRef = useRef(null);
  // Distance from the top of the page to the list (header, search box, ...)
  const [scrollMargin, setScrollMargin] = useState(0);

  useLayoutEffect(() => {
    const updateMargin = () => {
      if (!listRef.current) return;
      setScrollMargin(
        listRef.current.getBoundingClientRect().top + window.scrollY,
      );
    };
    updateMargin();
    window.addEventListener("resize", updateMargin);
    return () => window.removeEventListener("resize", updateMargin);
  }, []);

  const virtualizer = useWindowVirtualizer({
    count: items.length,
    estimateSize: () => estimateSize,
    overscan,
    gap,
    scrollMargin,
    getItemKey: (index) => getKey(items[index]),
  });

  return (
    <div
      ref={listRef}
      style={{ height: virtualizer.getTotalSize(), position: "relative" }}
    >
      {virtualizer.getVirtualItems().map((row) => (
        <div
          key={row.key}
          data-index={row.index}
          ref={virtualizer.measureElement}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            transform: `translateY(${row.start - scrollMargin}px)`,
          }}
        >
          {renderItem(items[row.index], row.index)}
        </div>
      ))}
    </div>
  );
};

export default VirtualList;
