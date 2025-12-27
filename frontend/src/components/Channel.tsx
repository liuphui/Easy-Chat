
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
    uid: string
    displayName: string
    photoURL: string
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
                    const d = doc.data() as {
                        text?: unknown;
                        createdAt?: unknown;
                        uid?: unknown;
                        displayName?: unknown;
                        photoURL?: unknown;
                    }

                    if (typeof d.text !== "string") return []
                    if (!(d.createdAt instanceof Timestamp)) return []

                    return [
                        {
                            id: doc.id,
                            text: d.text,
                            createdAt: d.createdAt,
                            uid: typeof d.uid === "string" ? d.uid : "",
                            displayName: typeof d.displayName === "string" ? d.displayName : "",
                            photoURL: typeof d.photoURL === "string" ? d.photoURL : "",
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
            uid: user.uid,
            displayName: user.displayName ?? "",
            photoURL: user.photoURL ?? "",
        })

        setNewMessage("")
    }

    return (
        <div className="h-screen w-screen bg-gray-100">
            <div className="h-full max-2xl mx-auto p-4">
                <div className="h-full rounded-2xl border bg-white shadow-sm overflow-hidden flex flex-col">
                    
                    {/* Header */}
                    <header className="px-4 py-3 border-b">
                        <div className="font-semibold">Simple Chat</div>
                        <div className="text-sm text-gray-700">{messages.length} messages</div>
                    </header>
                    {/* Messages */}
                    <ul className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                        {messages.map((message) => (
                            <li key={message.id}>
                                <Message {...message}></Message>
                            </li>
                        ))}
                    </ul>
                    <form onSubmit={handleOnSubmit} className="flex border-t p-2 gap-2">
                        <input
                            value={newMessage}
                            onChange={handleOnChange}
                            className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring"
                            placeholder="Type a message…"
                        />
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >Send</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Channel
