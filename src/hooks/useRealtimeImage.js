import { useEffect, useState } from "react";
import { db } from "../db/instant";

export function useRealtimeImage(imageId) {
  const [reactions, setReactions] = useState([]);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribeReactions = db.subscribe(
      { reactions: { $: { where: { imageId } } } },
      (data) => {
        setReactions(data.reactions ? Object.values(data.reactions) : []);
      }
    );

    // Subscribe to comments
    const unsubscribeComments = db.subscribe(
      { comments: { $: { where: { imageId } } } },
      (data) => {
        setComments(data.comments ? Object.values(data.comments) : []);
      }
    );

    setIsLoading(false);

    return () => {
      unsubscribeReactions();
      unsubscribeComments();
    };
  }, [imageId]);

  const groupedReactions = reactions.reduce((acc, reaction) => {
    acc[reaction.emoji] = acc[reaction.emoji] || [];
    acc[reaction.emoji].push(reaction);
    return acc;
  }, {});

  return {
    reactions,
    comments,
    groupedReactions,
    isLoading,
    totalInteractions: reactions.length + comments.length,
  };
}