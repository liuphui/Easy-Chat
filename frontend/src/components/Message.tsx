import { formatRelative } from 'date-fns';
import { Timestamp } from "firebase/firestore"

type MessageProps = {
  createdAt?: Timestamp | null
  text?: string
  displayName?: string
  photoURL?: string
}

const Message = ({
    createdAt = null,
    text = '',
    displayName = '',
    photoURL = '',
}: MessageProps) => {
    return (
        <div>
            {photoURL ? (
                <img src={photoURL} alt="Avatar" width={45} height={45}></img>
            ) : null}
            {displayName ? <p>{displayName}</p> : null}
            {createdAt?.seconds? (
                <span>
                    {formatRelative(
                        createdAt.toDate(), 
                        new Date()
                    )}
                </span>
            ) : null}
            <p>{text}</p>
        </div>
    );
};

export default Message;