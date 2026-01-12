import { init, tx, id } from "@instantdb/react";

export const db = init({
  appId: import.meta.env.VITE_INSTANT_APP_ID,
});

export { tx, id };

export const SCHEMA = {
  images: {
    id: "string",
    unsplashId: "string",
    url: "string",
    alt: "string",
    width: "number",
    height: "number",
    createdAt: "number",
  },
  reactions: {
    id: "string",
    imageId: "string",
    emoji: "string",
    userId: "string",
    userName: "string",
    userColor: "string",
    createdAt: "number",
  },
  comments: {
    id: "string",
    imageId: "string",
    text: "string",
    userId: "string",
    userName: "string",
    userColor: "string",
    createdAt: "number",
  },
  feed: {
    id: "string",
    type: "string", // 'reaction' | 'comment'
    imageId: "string",
    imageUrl: "string",
    emoji: "string", // for reactions
    text: "string", // for comments
    userId: "string",
    userName: "string",
    userColor: "string",
    createdAt: "number",
  },
};

export const dbHelpers = {
  async createReaction({ imageId, emoji, user }) {
    return db.transact([
      tx.reactions[id()].update({
        imageId,
        emoji,
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        createdAt: Date.now(),
      }),
      tx.feed[id()].update({
        type: "reaction",
        imageId,
        imageUrl: "", // Will be set by the caller
        emoji,
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        createdAt: Date.now(),
      }),
    ]);
  },

  async createComment({ imageId, text, user, imageUrl }) {
    return db.transact([
      tx.comments[id()].update({
        imageId,
        text,
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        createdAt: Date.now(),
      }),
      tx.feed[id()].update({
        type: "comment",
        imageId,
        imageUrl,
        text,
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        createdAt: Date.now(),
      }),
    ]);
  },

  async deleteReaction(reactionId) {
    return db.transact([
      tx.reactions[reactionId].delete(),
    ]);
  },

  async deleteComment(commentId) {
    return db.transact([
      tx.comments[commentId].delete(),
    ]);
  },
};