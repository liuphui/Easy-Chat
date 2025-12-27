import { useEffect, useState } from "react"
import type { User } from "firebase/auth"
import {
  Firestore,
  collection,
  onSnapshot,
  orderBy,
  query,
  limit,
  Timestamp,
  addDoc,
  serverTimestamp
} from "firebase/firestore"

import Message from "./Message"


type ChannelProps = {
  user: User | null
  db: Firestore
}

type Message = {
  id: string
  text: string
  createdAt: Timestamp
}

const Channel = ({ user, db }: ChannelProps) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')

  useEffect(() => {
    const messagesRef = collection(db, "messages")
    const q = query(messagesRef, orderBy("createdAt", "asc"), limit(100))

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {

        const data: Message[] = snapshot.docs.flatMap((doc) => {
          const d = doc.data() as { text?: unknown; createdAt?: unknown }

          if (typeof d.text !== "string") return []
          if (!(d.createdAt instanceof Timestamp)) return []

          return [
            {
              id: doc.id,
              text: d.text,
              createdAt: d.createdAt,
            },
          ]
        })

        setMessages(data)
      }
    )

    return unsubscribe;
  }, [db])

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value)
  }

  const handleOnSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !newMessage.trim()) return

    await addDoc(collection(db, "messages"), {
      text: newMessage,
      createdAt: serverTimestamp(),
    })

    setNewMessage("")
  }

  return (
    <div>
      <ul>
        {messages.map((message) => (
          <li key={message.id}><Message {...message}></Message></li>
        ))}
      </ul>

      <form onSubmit={handleOnSubmit}>
        <input
          value={newMessage}
          onChange={handleOnChange}
          placeholder="Type a message…"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}

export default Channel
