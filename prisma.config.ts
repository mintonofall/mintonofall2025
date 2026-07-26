const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is not set or is empty.");
}

export default {
    datasource: {
        url: databaseUrl,
    },
};
