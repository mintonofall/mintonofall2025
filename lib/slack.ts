export async function sendSlackNotification(message: string) {
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;

    if (!webhookUrl) {
        console.warn("SLACK_WEBHOOK_URL 환경 변수가 설정되지 않았습니다.");
        return;
    }

    try {
        await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: message }),
        });
    } catch (error) {
        console.error("슬랙 메시지 전송 실패:", error);
    }
}
