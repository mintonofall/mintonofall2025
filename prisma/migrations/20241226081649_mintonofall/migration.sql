-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WaitPlayerList" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clubid" INTEGER NOT NULL,
    "Playerid" INTEGER NOT NULL,
    "enterDate" DATETIME NOT NULL,
    "exitDate" DATETIME,
    CONSTRAINT "WaitPlayerList_Playerid_fkey" FOREIGN KEY ("Playerid") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_WaitPlayerList" ("Playerid", "clubid", "enterDate", "exitDate", "id") SELECT "Playerid", "clubid", "enterDate", "exitDate", "id" FROM "WaitPlayerList";
DROP TABLE "WaitPlayerList";
ALTER TABLE "new_WaitPlayerList" RENAME TO "WaitPlayerList";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
