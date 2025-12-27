
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
            </div>
        </div>
    );
};

export default Message;