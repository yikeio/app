import { useChatStore } from "../store";

import Locale from "../locales";
import { isMobileScreen } from "../utils";
import { IconTrash } from "@tabler/icons-react";

export function ChatItem(props: {
  onClick?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
  title: string;
  count: number;
  time: string;
  selected: boolean;
  id: string;
}) {
  return (
    <div
      className={`bg-slate-100 border-2 p-2 px-4 rounded-lg relative group ${
        props.selected ? "border-blue-500" : "border-slate-200"
      }`}
      onClick={props.onClick}
    >
      <div className="font-bold">{props.title}</div>
      <div className="">
        <div className="">{Locale.ChatItem.ChatItemCount(props.count)}</div>
        <div className="text-xs text-gray-400">{props.time}</div>
      </div>
      {props.id === "-1" ? (
        ""
      ) : (
        <div
          className="absolute top-0 right-0 p-1 m-2 text-red-500 transition-all rounded-full opacity-0 group-hover:bg-red-200 group-hover:opacity-100 cursor-pointer"
          onClick={props.onDelete}
        >
          <IconTrash size={14} />
        </div>
      )}
    </div>
  );
}

export function ChatList() {
  const [sessions, selectedIndex, selectSession, removeSession] = useChatStore(
    (state) => [
      state.sessions,
      state.currentSessionIndex,
      state.selectSession,
      state.removeSession,
    ],
  );

  return (
    <div className="flex flex-col gap-4">
      {sessions.map((item, i) => (
        <ChatItem
          id={item.id}
          title={item.title}
          time={item.updated_at}
          count={item.messages_count || 0}
          key={i}
          selected={i === selectedIndex}
          onClick={() => selectSession(i)}
          onDelete={(e) => {
            e.stopPropagation();
            if (!isMobileScreen() || confirm(Locale.Home.DeleteChat)) {
              removeSession(i);
            }
          }}
        />
      ))}
    </div>
  );
}
