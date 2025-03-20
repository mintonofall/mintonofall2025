export function getKoreaTime(): Date {
    const koreaTimeOffset = 9 * 60; // Korea is UTC+9
    const currentTime = new Date();
    const utcTime = currentTime.getTime() + currentTime.getTimezoneOffset() * 60000;
    const koreaTime = new Date(utcTime + koreaTimeOffset * 60000);
    return koreaTime;
}
export function getKoreaMidnight(): Date {
    const koreaTime = getKoreaTime();
    koreaTime.setHours(0, 0, 0, 0);
    return koreaTime;
}
