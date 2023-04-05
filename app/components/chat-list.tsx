import { useEffect, useLayoutEffect } from "react";
import DeleteIcon from "../icons/delete.svg";
import styles from "./home.module.scss";

import { useChatStore } from "../store";

import Locale from "../locales";
import { isMobileScreen } from "../utils";

export function ChatItem(props: {
  onClick?: () => void;
  onDelete?: () => void;
  title: string;
  count: number;
  time: string;
  selected: boolean;
}) {
  return (
    <div
      className={`${styles["chat-item"]} ${
        props.selected && styles["chat-item-selected"]
      }`}
      onClick={props.onClick}
    >
      <div className={styles["chat-item-title"]}>{props.title}</div>
      <div className={styles["chat-item-info"]}>
        <div className={styles["chat-item-count"]}>
          {Locale.ChatItem.ChatItemCount(props.count)}
        </div>
        <div className={styles["chat-item-date"]}>{props.time}</div>
      </div>
      <div className={styles["chat-item-delete"]} onClick={props.onDelete}>
        <DeleteIcon />
      </div>
    </div>
  );
}

export function ChatList() {
  const [
    user,
    sessions,
    selectedIndex,
    selectSession,
    removeSession,
    getConversationList,
  ] = useChatStore((state) => [
    state.user,
    state.sessions,
    state.currentSessionIndex,
    state.selectSession,
    state.removeSession,
    state.getConversationList,
  ]);
  useEffect(() => {
    getConversationList(user.id);
  }, []);

  return (
    <div className={styles["chat-list"]}>
      {sessions.map((item, i) => (
        <ChatItem
          title={item.title}
          time={item.updated_at}
          count={item.messages.length}
          key={i}
          selected={i === selectedIndex}
          onClick={() => selectSession(i)}
          onDelete={() =>
            (!isMobileScreen() || confirm(Locale.Home.DeleteChat)) &&
            removeSession(i)
          }
        />
      ))}
    </div>
  );
}
