import { useEffect, useState } from "react";

export function useOnlineStatus() {
    const [isOnline, setIsOnline] = useState(navigator?.onLine);

    useEffect(() => {
        if (!navigator) return;
        const updateOnlineStatus = () => setIsOnline(navigator.onLine);

        window.addEventListener("online", updateOnlineStatus);
        window.addEventListener("offline", updateOnlineStatus);

        return () => {
            window.removeEventListener("online", updateOnlineStatus);
            window.removeEventListener("offline", updateOnlineStatus);
        };
    }, []);

    return isOnline;
} 