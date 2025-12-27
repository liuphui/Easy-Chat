
import { Timestamp } from "firebase/firestore"

type MessageProps = {
    createdAt?: Timestamp | null
    text?: string
    displayName?: string
    photoURL?: string
}

const Message = ({
    createdAt,
    text,
    displayName,
    photoURL,
}: MessageProps) => {
    return (
        <div className="flex gap-5">
            {photoURL ? (
                <img
                    src={photoURL}
                    alt="Avatar"
                    className="h-8 w-8 rounded-full">
                </img>
            ) : null}

            <div className="max-w-[75%]">
                {displayName && (
                    <div className="text-xs text-gray-700 mb-1">{displayName}</div>
                )}

                <div className="rounded-2xl px-3 py-2 bg-blue-400 border shadow-sm leading-snug break-words">
                    {text}
                </div>

                {createdAt && (
                    <div className="text-[11px] text-gray-700 mt-1">
                        {/* formatted time */}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Message;