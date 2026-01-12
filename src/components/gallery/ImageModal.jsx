import { memo, useEffect, useState, useCallback } from "react";
import {
  X,
  Download,
  ExternalLink,
  User,
  Clock,
  Heart,
  ChevronLeft,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import EmojiBar from "../interactions/EmojiBar";
import CommentBox from "../interactions/CommentBox";
import { useUserStore } from "../../store/useUserStore";

const ImageModal = memo(function ImageModal({ image, onClose }) {
  const { user } = useUserStore();
  const [isDesktop, setIsDesktop] = useState(false);

  /* ---------------- Viewport detection ---------------- */
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ---------------- Body scroll lock ---------------- */
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  /* ---------------- ESC key close ---------------- */
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const stop = useCallback((e) => e.stopPropagation(), []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        onClick={stop}
        className="relative bg-white w-full max-w-6xl max-h-[90dvh]

                   rounded-2xl lg:rounded-3xl shadow-2xl
                   flex flex-col overflow-hidden"
      >
        {/* ---------------- Header ---------------- */}
        <header className="flex items-center justify-between p-4 lg:p-6 border-b">
          <div className="flex items-center gap-3">
            {!isDesktop && (
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 lg:w-12 lg:h-12 rounded-full overflow-hidden bg-gradient-to-r from-blue-400 to-purple-500">
                <img
                  src={image.user.profile_image.medium}
                  alt={image.user.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-bold text-sm lg:text-lg">
                  {image.user.name}
                </h3>
                <p className="text-gray-600 text-xs lg:text-sm truncate">
                  {image.user.location || "Unsplash photographer"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={image.links.download}
              target="_blank"
              rel="noreferrer"
              className="p-2 hover:bg-gray-100 rounded-lg hidden sm:block"
            >
              <Download className="w-4 h-4" />
            </a>

            <a
              href={image.links.html}
              target="_blank"
              rel="noreferrer"
              className="p-2 hover:bg-gray-100 rounded-lg hidden sm:block"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            {isDesktop && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </header>

        {/* ---------------- Body ---------------- */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto">
          {/* Image */}
          <div className="lg:w-2/3 bg-gray-50 p-4 lg:p-8 flex items-center justify-center">
            <img
              src={image.urls.regular}
              alt={image.alt_description || "Image"}
              loading="lazy"
              className="rounded-xl shadow-lg max-h-[60vh] object-contain"
            />
          </div>

          {/* Sidebar */}
          <aside className="lg:w-1/3 border-l p-4 lg:p-6 overflow-y-auto">
       

            {/* User */}
            <div className="mb-6 p-4 border rounded-xl bg-gray-50">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center
                             text-white font-bold"
                  style={{ backgroundColor: user.color }}
                >
                  {user.name[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500">Ready to interact</p>
                </div>
              </div>
            </div>

            {/* Reactions */}
            <section className="mb-6">
              <h4 className="font-bold mb-3">Reactions</h4>
              <EmojiBar imageId={image.id} expanded={isDesktop} />
            </section>

            {/* Comments */}
            <section>
              <h4 className="font-bold mb-3">Comments</h4>
              <CommentBox imageId={image.id} />
            </section>
          </aside>
        </div>

        {/* Mobile close */}
        {!isDesktop && (
          <footer className="border-t p-4">
            <button
              onClick={onClose}
              className="w-full py-3 bg-gray-100 rounded-xl font-medium"
            >
              Close
            </button>
          </footer>
        )}
      </div>
    </div>
  );
});

export default ImageModal;

