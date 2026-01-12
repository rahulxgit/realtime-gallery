import { memo, useState, useCallback } from "react";
import { MessageCircle, Eye, User } from "lucide-react";
import ImageModal from "./ImageModal";
import EmojiBar from "../interactions/EmojiBar";
import { useUserStore } from "../../store/useUserStore";

const ImageCard = memo(function ImageCard({ image }) {
  const [open, setOpen] = useState(false);
  const { user } = useUserStore();

  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);

  return (
    <>
      {/* Card */}
      <div
        className="group relative bg-white rounded-xl lg:rounded-2xl overflow-hidden border border-gray-200
                   transition-all duration-300 hover:shadow-lg lg:hover:shadow-2xl hover:-translate-y-1"
        onClick={openModal}
      >
        {/* Image */}
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          <img
            src={image.urls.small}
            alt={image.alt_description || "Unsplash image"}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.png";
            }}
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent
                          opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Author */}
          <div className="absolute bottom-2 left-2 right-2 flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-400 to-purple-500
                            flex items-center justify-center shrink-0">
              <User className="w-3 h-3 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">
                {image.user.name}
              </p>
              {image.user.location && (
                <p className="text-white/80 text-[10px] truncate hidden sm:block">
                  {image.user.location}
                </p>
              )}
            </div>
            <Eye className="w-3 h-3 text-white/80 shrink-0" />
          </div>
        </div>

        {/* Content */}
        <div className="p-3 lg:p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-900 text-sm line-clamp-1">
              {image.alt_description || "Beautiful image"}
            </h3>
            <div className="flex items-center gap-1 text-gray-500 text-xs">
              <MessageCircle className="w-3 h-3" />
              <span>0</span>
            </div>
          </div>

          <div
            onClick={(e) => e.stopPropagation()}
            className="pt-1"
          >
            <EmojiBar imageId={image.id} compact />
          </div>
        </div>
      </div>

      {/* Modal (lazy mount) */}
      {open && (
        <ImageModal
          image={image}
          onClose={closeModal}
          currentUser={user}
        />
      )}
    </>
  );
});

export default ImageCard;
