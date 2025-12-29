
import { Timestamp } from "firebase/firestore"

function formatTimeStamp(ts: Timestamp) {
    const date = ts.toDate()

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth()).padStart(2, "0");
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year}/${hours}:${minutes}`;
}

const emojis = ["😀", "😂", "😍", "👍", "🔥", "🎉"];

type MessageProps = {
    id: string
    createdAt?: Timestamp | null
    text?: string
    displayName?: string
    photoURL?: string
    onReply: (id: string, text?: string) => void
    onReact: (id: string, emoji: string) => void
}

const Message = ({
    id,
    createdAt,
    text,
    displayName,
    photoURL,
    onReply,
    onReact,
}: MessageProps) => {
    return (
        <div className="flex gap-5 group">
            {photoURL ? (
                <img
                    src={photoURL}
                    alt="Avatar"
                    className="h-10 w-10 rounded-full">
                </img>
            ) : null}

            <div className="max-w-[75%]">
                {displayName && (
                    <div className="text-xs font-semibold text-gray-700 mb-1 dark:text-white">{displayName}</div>
                )}

                {createdAt && (
                    <div className="text-[11px] text-gray-700 mt-1 dark:text-white">
                        {formatTimeStamp(createdAt)}
                    </div>
                )}

                <div className="rounded-2xl px-3 py-2 bg-blue-400 border shadow-sm leading-snug break-words inline-block">
                    {text}
                </div>

                {/* Hover action bar */}
                <div className="relative inline-block group"
                >
                    {/* Action bar */}
                    <div
                        className="
                            absolute -top-10 left-0
                            z-50
                            flex items-center gap-1
                            rounded-full border bg-white shadow
                            px-2 py-1
                            opacity-0 pointer-events-none
                            group-hover:opacity-100 group-hover:pointer-events-auto
                            transition
                            overflow-x-auto
                        "
                    >
                        {emojis.map((emoji) => (
                            <button
                                key={emoji}
                                type="button"
                                onClick={() => onReact(id, emoji)}
                                className="text-lg hover:scale-110 transition"
                            >
                                {emoji}
                            </button>
                        ))}

                        <span className="mx-1 h-4 w-px bg-gray-200" />

                        <button
                            type="button"
                            onClick={() => onReply(id, text)}
                            className="text-xs px-1 hover:underline whitespace-nowrap"
                        >
                            Reply
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Message;