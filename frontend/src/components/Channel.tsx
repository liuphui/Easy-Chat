import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import {
  Firestore,
  collection,
  onSnapshot,
  orderBy,
  query,
  limit,
  Timestamp,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import Message from "./Message";

type ChannelProps = {
  user: User | null;
  db: Firestore;
};

type MessageType = {
  id: string;
  text: string;
  createdAt: Timestamp;
  uid: string;
  displayName: string;
  photoURL: string;
};

const Channel = ({ user, db }: ChannelProps) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const messagesRef = collection(db, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"), limit(100));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: MessageType[] = snapshot.docs.flatMap((doc) => {
        const d = doc.data() as {
          text?: unknown;
          createdAt?: unknown;
          uid?: unknown;
          displayName?: unknown;
          photoURL?: unknown;
        };

        if (typeof d.text !== "string") return [];
        if (!(d.createdAt instanceof Timestamp)) return [];

        return [
          {
            id: doc.id,
            text: d.text,
            createdAt: d.createdAt,
            uid: typeof d.uid === "string" ? d.uid : "",
            displayName: typeof d.displayName === "string" ? d.displayName : "",
            photoURL: typeof d.photoURL === "string" ? d.photoURL : "",
          },
        ];
      });

      setMessages(data);
    });

    return unsubscribe;
  }, [db]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
  };

  const handleOnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newMessage.trim()) return;

    await addDoc(collection(db, "messages"), {
      text: newMessage,
      createdAt: serverTimestamp(),
      uid: user.uid,
      displayName: user.displayName ?? "",
      photoURL: user.photoURL ?? "",
    });

    setNewMessage("");
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-gray-100 dark:bg-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="shrink-0 px-4 py-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="text-xl font-semibold text-center text-gray-900 dark:text-gray-100">
          Welcome to SimpleChat
        </div>
      </div>

      {/* Text Channel */}
      <div className="flex flex-1 flex-col w-full mx-auto p-4 overflow-hidden">
        {/* Messages */}
        <ul className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-800 dark:text-gray-100 rounded">
          <li className="py-4">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                This is the beginning of the chat
              </span>
              <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
            </div>
          </li>

          {messages.map((message) => (
            <li key={message.id}>
              <Message {...message} />
            </li>
          ))}
        </ul>

        <form
          onSubmit={handleOnSubmit}
          className="shrink-0 border-t border-gray-200 dark:border-gray-700 p-3 flex gap-2 bg-white dark:bg-gray-800"
        >
          <input
            value={newMessage}
            onChange={handleOnChange}
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-3 py-2
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                       placeholder-gray-400 dark:placeholder-gray-400
                       focus:outline-none focus:ring"
            placeholder="Type a message…"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Channel;
