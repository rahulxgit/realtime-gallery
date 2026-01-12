import { useState, useEffect } from "react";
import { tx } from "@instantdb/react";
import { db , id} from "../../db/instant";
import { useUserStore } from "../../store/useUserStore";
import { Send, Trash2, MoreVertical } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function CommentBox({ imageId }) {
  const [text, setText] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const { user } = useUserStore();

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const { data } = db.useQuery({
    comments: {
      $: { where: { imageId } },
    },
  });

  const comments = data?.comments
    ? Object.values(data.comments).sort((a, b) => b.createdAt - a.createdAt)
    : [];

const submit = async () => {
  if (!text.trim()) return;

  try {
    await db.transact([
      tx.comments[id()].update({
        imageId,
        text: text.trim(),
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        createdAt: Date.now(),
      }),
      tx.feed[id()].update({
        type: "comment",
        imageId,
        text: text.trim(),
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        createdAt: Date.now(),
      }),
    ]);

    setText("");
  } catch (err) {
    console.error("InstantDB comment error:", err);
  }
};


  const deleteComment = async (commentId) => {
    try {
      await db.transact([
        tx.comments[commentId].delete(),
      ]);
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="space-y-4">
      {/* Comment Input */}
      <div className="flex gap-2">
        <div 
          className="w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-white font-bold text-sm lg:text-base flex-shrink-0"
          style={{ backgroundColor: user.color }}
        >
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a comment..."
              className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-sm lg:text-base"
              rows={isMobile ? 2 : 3}
              maxLength={500}
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-500">
                {text.length}/500
              </span>
              <button
                onClick={submit}
                disabled={!text.trim()}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center gap-1"
              >
                <Send className="w-3 h-3 lg:w-4 lg:h-4" />
                Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-3 lg:space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-4 text-sm">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="p-3 lg:p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-start gap-2 lg:gap-3">
                {/* User Avatar */}
                <div
                  className="w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-white font-bold text-sm lg:text-base flex-shrink-0"
                  style={{ backgroundColor: comment.userColor }}
                >
                  {comment.userName?.charAt(0)?.toUpperCase() || "U"}
                </div>

                {/* Comment Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900 text-sm lg:text-base">
                        {comment.userName}
                      </p>
                      <span className="text-gray-500 text-xs">
                        {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                      </span>
                    </div>
                    
                    {/* Delete button - only show for user's own comments */}
                    {comment.userId === user.id && (
                      <button
                        onClick={() => deleteComment(comment.id)}
                        className="p-1 hover:bg-gray-200 rounded"
                        title="Delete comment"
                      >
                        <Trash2 className="w-3 h-3 lg:w-4 lg:h-4 text-gray-500" />
                      </button>
                    )}
                  </div>
                  
                  <p className="text-gray-700 text-sm lg:text-base whitespace-pre-wrap break-words">
                    {comment.text}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}