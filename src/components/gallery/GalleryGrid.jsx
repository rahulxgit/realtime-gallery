import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useEffect, useMemo } from "react";
import { fetchImages } from "../../api/unsplash";
import ImageCard from "./ImageCard";
import { Loader2, Sparkles, AlertTriangle } from "lucide-react";

/**
 * @param {string} category - e.g. "latest", "nature", "technology"
 */
export default function GalleryGrid({ category = "latest" }) {
  /* ---------------- Intersection Observer ---------------- */
  const { ref, inView } = useInView({
    rootMargin: "200px",
    triggerOnce: false,
  });

  /* ---------------- Data Fetch ---------------- */
  const {
    data,
    error,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["images", category], // 🔑 cache per category
    queryFn: ({ pageParam = 1 }) =>
      fetchImages({ pageParam, query: category }),
    getNextPageParam: (lastPage, pages) =>
      lastPage?.length ? pages.length + 1 : undefined,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  /* ---------------- Infinite Scroll Guard ---------------- */
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  /* ---------------- Safe Image List ---------------- */
 const images = useMemo(() => {
  const map = new Map();

  data?.pages?.flat()?.forEach((img) => {
    map.set(img.id, img);
  });

  return Array.from(map.values());
}, [data]);


  /* ---------------- Loading State ---------------- */
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
      </div>
    );
  }

  /* ---------------- Error State (Mobile Safe) ---------------- */
  if (isError) {
    console.error("Gallery load error:", error);
    return (
      <div className="min-h-[50vh] flex items-center justify-center px-4">
        <div className="bg-white border rounded-xl p-6 text-center max-w-md shadow-sm">
          <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <h3 className="font-bold text-lg text-gray-900">
            Failed to load gallery
          </h3>
          <p className="text-gray-600 text-sm mt-2">
            Please check your connection or try again later.
          </p>
        </div>
      </div>
    );
  }

  /* ---------------- Empty State ---------------- */
  if (images.length === 0) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-gray-500">No images found.</p>
      </div>
    );
  }

  /* ---------------- Main Render ---------------- */
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 px-2">
        <h1 className="text-xl lg:text-3xl font-bold flex items-center gap-2">
          <Sparkles className="text-yellow-500" />
          {category === "latest"
            ? "Image Gallery"
            : `${category.charAt(0).toUpperCase() + category.slice(1)} Photos`}
        </h1>
        <p className="text-gray-600 text-sm lg:text-base mt-1">
           Interactions with beautiful images
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-6 px-2">
        {images.map((image, index) => (
          <div
            key={image.id}
            className={index < 2 ? "sm:col-span-2 lg:col-span-1" : ""}
          >
            <ImageCard image={image} />
          </div>
        ))}
      </div>

      {/* Infinite Scroll Trigger */}
      <div ref={ref} className="py-8 text-center">
        {isFetchingNextPage ? (
          <Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto" />
        ) : hasNextPage ? (
          <p className="text-gray-500">Scroll to load more</p>
        ) : (
          <p className="text-gray-400">You've reached the end 🎉</p>
        )}
      </div>
    </div>
  );
}
