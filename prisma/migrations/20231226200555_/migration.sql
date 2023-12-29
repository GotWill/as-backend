-- CreateTable
CREATE TABLE "Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "grouped" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "EventGroup" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_event" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "EventGroup_id_event_fkey" FOREIGN KEY ("id_event") REFERENCES "Event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EventPeople" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_event" INTEGER NOT NULL,
    "id_group" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "matched" TEXT NOT NULL DEFAULT '',
    CONSTRAINT "EventPeople_id_event_fkey" FOREIGN KEY ("id_event") REFERENCES "Event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EventPeople_id_group_fkey" FOREIGN KEY ("id_group") REFERENCES "EventGroup" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
