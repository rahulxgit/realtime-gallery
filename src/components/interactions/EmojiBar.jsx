import { useState, useEffect, useMemo, useCallback } from "react";
import {
  SmilePlus,
  Heart,
  ThumbsUp,
  PartyPopper,
  Flame,
  X,
} from "lucide-react";
import { db, tx, id } from "../../db/instant";
import { useUserStore } from "../../store/useUserStore";
import EmojiPicker from "emoji-picker-react";

/* ---------------- CONFIG ---------------- */
const QUICK_EMOJIS = [
  { emoji: "❤️", label: "Love", icon: Heart },
  { emoji: "🔥", label: "Fire", icon: Flame },
  { emoji: "👍", label: "Like", icon: ThumbsUp },
  { emoji: "🎉", label: "Celebrate", icon: PartyPopper },
  { emoji: "😍", label: "Heart Eyes" },
  { emoji: "😂", label: "Laughing" },
];

export default function EmojiBar({
  imageId,
  compact = false,
  expanded = false,
}) {
  const { user } = useUserStore();
  const [showPicker, setShowPicker] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  /* ---------------- VIEWPORT SAFE DETECTION ---------------- */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ---------------- REAL-TIME QUERY ---------------- */
  const { data } = db.useQuery({
    reactions: {
      $: { where: { imageId } },
    },
  });

  const reactions = useMemo(
    () => (data?.reactions ? Object.values(data.reactions) : []),
    [data]
  );

  /* ---------------- SINGLE USER REACTION ---------------- */
  const userReaction = useMemo(
    () => reactions.find((r) => r.userId === user.id),
    [reactions, user.id]
  );

  /* ---------------- GROUP COUNTS ---------------- */
  const groupedReactions = useMemo(() => {
    const map = {};
    for (const r of reactions) {
      if (!map[r.emoji]) map[r.emoji] = { count: 0 };
      map[r.emoji].count++;
    }
    return map;
  }, [reactions]);

  /* ---------------- CORE TOGGLE LOGIC ---------------- */
  const toggleReaction = useCallback(
    async (emoji) => {
      if (!emoji || !user?.id) return;

      const ops = [];

      try {
        // CASE 1: Same emoji → remove
        if (userReaction && userReaction.emoji === emoji) {
          ops.push(tx.reactions[userReaction.id].delete());
        }

        // CASE 2: Different emoji → replace
        else if (userReaction) {
          ops.push(tx.reactions[userReaction.id].delete());
          ops.push(
            tx.reactions[id()].update({
              imageId,
              emoji,
              userId: user.id,
              userName: user.name,
              userColor: user.color,
              createdAt: Date.now(),
            })
          );
        }

        // CASE 3: First reaction
        else {
          ops.push(
            tx.reactions[id()].update({
              imageId,
              emoji,
              userId: user.id,
              userName: user.name,
              userColor: user.color,
              createdAt: Date.now(),
            })
          );
        }

        // FEED (only when adding or changing)
        if (!userReaction || userReaction.emoji !== emoji) {
          ops.push(
            tx.feed[id()].update({
              type: "reaction",
              imageId,
              emoji,
              userId: user.id,
              userName: user.name,
              userColor: user.color,
              createdAt: Date.now(),
            })
          );
        }

        if (ops.length) {
          await db.transact(ops);
        }
      } catch (err) {
        console.error("❌ Reaction toggle failed:", err);
      }
    },
    [userReaction, user, imageId]
  );

  /* ---------------- COMPACT MODE ---------------- */
  if (compact) {
    return (
      <div className="flex items-center gap-1">
        {QUICK_EMOJIS.slice(0, isMobile ? 3 : 4).map((e) => {
          const active = userReaction?.emoji === e.emoji;

          return (
            <button
              key={e.emoji}
              onClick={() => toggleReaction(e.emoji)}
              title={e.label}
              className={`
        relative flex items-center justify-center
        w-10 h-10 rounded-full
        transition-all duration-200 ease-out
        active:scale-95
        ${
          active
            ? "bg-blue-100 ring-2 ring-blue-400 scale-110"
            : "hover:bg-gray-100 hover:scale-110"
        }
      `}
            >
              <span className="text-xl">{e.emoji}</span>
            </button>
          );
        })}

        <div className="absolute bottom-3 right-3 z-10">
          <div className="group relative">
            <div
              className={`
      flex items-center gap-1.5 px-2.5 py-1 rounded-full border shadow-lg transition-all duration-300
      ${
        reactions.length > 0
          ? "bg-white/90 backdrop-blur-sm border-white/40"
          : "bg-white/60 backdrop-blur-sm border-gray-200/50 opacity-70 hover:opacity-100"
      }
    `}
            >
              <div className="flex items-center gap-1">
                {reactions.length > 0 ? (
                  Object.keys(groupedReactions).map((emoji) => (
                    <span key={emoji} className="text-xs">
                      {emoji}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-400">💬</span> // Placeholder emoji
                )}
              </div>
              <div
                className={`w-px h-3 ${
                  reactions.length > 0 ? "bg-gray-300/50" : "bg-gray-300/30"
                }`}
              ></div>
              <span
                className={`
        text-xs font-semibold min-w-[16px] text-center
        ${reactions.length > 0 ? "text-gray-800" : "text-gray-500"}
      `}
              >
                {reactions.length}
              </span>
            </div>

            {/* Tooltip on hover - only show if there are reactions */}
            {reactions.length > 0 && (
              <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                {reactions.length} reaction{reactions.length !== 1 ? "s" : ""}
                {Object.entries(groupedReactions).map(([emoji, data]) => (
                  <div key={emoji} className="flex items-center gap-1 mt-1">
                    <span>{emoji}</span>
                    <span className="text-gray-400">×{data.count}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Empty state tooltip */}
            {reactions.length === 0 && (
              <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                No reactions yet. Be the first to react!
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- FULL MODE ---------------- */
  return (
    <div className="space-y-4 relative">
      {/* QUICK BAR */}
      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border">
        {QUICK_EMOJIS.map((e) => {
          const active = userReaction?.emoji === e.emoji;
          return (
            <button
              key={e.emoji}
              onClick={() => toggleReaction(e.emoji)}
              className={`relative p-2 rounded-full transition-all
                ${
                  active
                    ? "bg-blue-100 ring-2 ring-blue-400"
                    : "hover:bg-gray-100"
                }
              `}
              title={e.label}
            >
              <span className="text-xl">{e.emoji}</span>

              {groupedReactions[e.emoji]?.count > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs px-1 rounded-full">
                  {groupedReactions[e.emoji].count}
                </span>
              )}
            </button>
          );
        })}

        {/* EMOJI PICKER TOGGLE */}
        <button
          onClick={() => setShowPicker((v) => !v)}
          className="ml-2 p-2 border border-dashed rounded-full hover:bg-gray-100"
        >
          <SmilePlus className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* PICKER */}
      {showPicker && (
        <div
          className={`absolute z-50 ${
            isMobile ? "left-1/2 -translate-x-1/2" : "right-0"
          }`}
        >
          <div className="relative bg-white rounded-xl shadow-xl border">
            <EmojiPicker
              onEmojiClick={(e) => {
                toggleReaction(e.emoji);
                setShowPicker(false);
              }}
              previewConfig={{ showPreview: false }}
              width={isMobile ? 280 : 320}
              height={isMobile ? 360 : 400}
            />
            <button
              onClick={() => setShowPicker(false)}
              className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* SUMMARY (EXPANDED / MODAL VIEW) */}
      {expanded && reactions.length > 0 && (
        <div className="border rounded-xl p-3 bg-white">
          {Object.entries(groupedReactions).map(([emoji, info]) => (
            <div
              key={emoji}
              className="flex items-center justify-between py-1 text-sm"
            >
              <span className="text-lg">{emoji}</span>
              <span className="font-medium">{info.count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
