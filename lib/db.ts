import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL; // DATABASE_URL 환경 변수 가져오기

// DATABASE_URL이 설정되어 있지 않으면 오류 발생
if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set.");
}

declare global {
    var prisma: PrismaClient | undefined;
}

// PostgreSQL 연결 풀 생성. connectionString 변수 사용.
// rejectUnauthorized: false는 개발 환경에서 SSL 인증서 검증을 무시할 때 사용될 수 있으나,
// 프로덕션 환경에서는 보안상 주의해야 합니다.
// 필요에 따라 이 옵션을 조건부로 적용하거나 제거할 수 있습니다.
const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });
const adapter = new PrismaPg(pool);

const prisma = globalThis.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = prisma;
}

export default prisma;
