import { MessageCircle, Heart, Clock, Image as ImageIcon, Zap, ChevronRight } from "lucide-react";
import { db } from "../../db/instant";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";

export default function ActivityFeed() {
  const [isMobile, setIsMobile] = useState(false);
  const { data } = db.useQuery({
    feed: {},
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const feedItems = data?.feed ? Object.values(data.feed) : [];

  const getIcon = (type) => {
    switch (type) {
      case 'reaction': return <Heart className="w-3 h-3 lg:w-4 lg:h-4 text-rose-500" />;
      case 'comment': return <MessageCircle className="w-3 h-3 lg:w-4 lg:h-4 text-blue-500" />;
      default: return <Zap className="w-3 h-3 lg:w-4 lg:h-4 text-yellow-500" />;
    }
  };

  const handleFeedClick = (imageId) => {
    const element = document.querySelector(`[data-image-id="${imageId}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Add highlight effect
      element.classList.add('ring-4', 'ring-blue-500', 'ring-opacity-50');
      setTimeout(() => {
        element.classList.remove('ring-4', 'ring-blue-500', 'ring-opacity-50');
      }, 2000);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-gray-50 to-white rounded-xl lg:rounded-2xl border shadow-sm">
      {/* Header */}
      <div className="p-4 lg:p-6 border-b">
        <div className="flex items-center gap-2 lg:gap-3 mb-1 lg:mb-2">
          <div className="p-1.5 lg:p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
            <Zap className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg lg:text-xl font-bold text-gray-900 truncate">
              Live Activity Feed
            </h3>
            <p className="text-gray-600 text-xs lg:text-sm truncate">
              Real-time updates from all users
            </p>
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex items-center justify-between mt-3 lg:mt-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
            <span className="text-xs lg:text-sm text-gray-700">
              {feedItems.length} activities
            </span>
          </div>
          <div className="flex items-center gap-1 lg:gap-2">
            <Clock className="w-3 h-3 lg:w-4 lg:h-4 text-gray-500" />
            <span className="text-xs lg:text-sm text-gray-500">Live</span>
          </div>
        </div>
      </div>

      {/* Feed Items */}
      <div className="flex-1 overflow-y-auto p-2 lg:p-4 space-y-2 lg:space-y-4">
        {feedItems.length === 0 ? (
          <div className="text-center py-8 lg:py-12">
            <ImageIcon className="w-8 h-8 lg:w-12 lg:h-12 text-gray-300 mx-auto mb-3 lg:mb-4" />
            <p className="text-gray-500 text-sm lg:text-base">No activities yet</p>
            <p className="text-gray-400 text-xs lg:text-sm mt-1 lg:mt-2">
              Interact with images to see updates here
            </p>
          </div>
        ) : (
          feedItems
            .sort((a, b) => b.createdAt - a.createdAt)
            .map((item) => (
              <div
                key={item.id}
                onClick={() => handleFeedClick(item.imageId)}
                className="group p-3 lg:p-4 rounded-lg lg:rounded-xl border hover:border-blue-300 hover:shadow-sm transition-all duration-200 cursor-pointer bg-white"
              >
                <div className="flex items-start gap-2 lg:gap-3">
                  {/* User Avatar */}
                  <div
                    className="w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-white font-bold text-xs lg:text-sm flex-shrink-0"
                    style={{ backgroundColor: item.userColor }}
                  >
                    {item.userName?.charAt(0)?.toUpperCase() || "U"}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 lg:gap-2 mb-0.5 lg:mb-1 flex-wrap">
                      {getIcon(item.type)}
                      <p className="font-medium text-gray-900 text-sm lg:text-base truncate">
                        {item.userName}
                      </p>
                      <span className="text-gray-500 text-xs lg:text-sm truncate">
                        {item.type === 'reaction' ? `reacted ${item.emoji}` : 'commented'}
                      </span>
                    </div>
                    
                    {item.text && (
                      <p className="text-gray-700 text-xs lg:text-sm bg-gray-50 p-2 lg:p-3 rounded mt-1 lg:mt-2 line-clamp-2">
                        {item.text}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between mt-2 lg:mt-3">
                      <div className="flex items-center gap-2 lg:gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-0.5 lg:gap-1">
                          <Clock className="w-2.5 h-2.5 lg:w-3 lg:h-3" />
                          {formatDistanceToNow(item.createdAt, { addSuffix: true })}
                        </span>
                        {/* <span className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500 text-xs lg:text-sm flex items-center gap-0.5">
                          View
                          <ChevronRight className="w-3 h-3" />
                        </span> */}
                      </div>
                      
                      {item.type === 'reaction' && (
                        <span className="text-xl lg:text-2xl">{item.emoji}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
        )}
      </div>

      {/* Footer */}
      <div className="p-3 lg:p-4 border-t bg-gray-50/50">
        <p className="text-xs lg:text-sm text-gray-600 text-center">
          Live feed updates every interaction instantly
        </p>
      </div>
    </div>
  );
}