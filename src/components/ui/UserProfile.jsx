import { User, Edit2, Copy } from "lucide-react";
import { useUserStore } from "../../store/useUserStore";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function UserProfile() {
  const { user, setUserName } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(user.name);

  const handleSave = () => {
    if (tempName.trim()) {
      setUserName(tempName.trim());
      toast.success("Username updated!");
    }
    setIsEditing(false);
  };

  const copyUserId = () => {
    navigator.clipboard.writeText(user.id);
    toast.success("User ID copied to clipboard!");
  };

  return (
    <div className="p-4 bg-gradient-to-br from-white to-gray-50 rounded-2xl border">
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
          style={{ backgroundColor: user.color }}
        >
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          {isEditing ? (
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="w-full px-2 py-1 border rounded"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
          ) : (
            <h4 className="font-bold text-gray-900">{user.name}</h4>
          )}
          <p className="text-xs text-gray-500 flex items-center gap-1">
            ID: {user.id.slice(0, 8)}...
            <button onClick={copyUserId} className="hover:text-gray-700">
              <Copy className="w-3 h-3" />
            </button>
          </p>
        </div>
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          {isEditing ? "💾" : <Edit2 className="w-4 h-4" />}
        </button>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center justify-between">
          <span>Status</span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Online
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Color</span>
          <div className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded border"
              style={{ backgroundColor: user.color }}
            />
            <button
              onClick={() => useUserStore.getState().updateUser({ 
                color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)` 
              })}
              className="text-xs hover:underline"
            >
              Change
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}