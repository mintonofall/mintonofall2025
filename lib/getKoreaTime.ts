const KOREA_OFFSET_MS = 9 * 60 * 60000; // Korea is UTC+9

export function getKoreaTime(): Date {
    // Returns a Date whose UTC fields represent Korea wall-clock time,
    // independent of the host process's local timezone (important on Vercel, which runs TZ=UTC).
    return new Date(Date.now() + KOREA_OFFSET_MS);
}
export function getKoreaMidnight(): Date {
    const koreaTime = getKoreaTime();
    return new Date(
        Date.UTC(koreaTime.getUTCFullYear(), koreaTime.getUTCMonth(), koreaTime.getUTCDate()) - KOREA_OFFSET_MS
    );
}
