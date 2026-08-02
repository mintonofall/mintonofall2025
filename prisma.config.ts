import "dotenv/config";
import { defineConfig, env } from "prisma/config";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is not set or is empty.");
}

export default defineConfig({
    datasource: {
        // 타임아웃 방지를 위해 URL 뒤에 ?connect_timeout=30 추가
        url: databaseUrl.includes("?") ? `${databaseUrl}&connect_timeout=30` : `${databaseUrl}?connect_timeout=30`,
    },
});
