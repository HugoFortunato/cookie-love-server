/*
  Warnings:

  - The primary key for the `Phrase` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `SharedPhrase` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "SharedPhrase" DROP CONSTRAINT "SharedPhrase_phraseId_fkey";

-- DropForeignKey
ALTER TABLE "SharedPhrase" DROP CONSTRAINT "SharedPhrase_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "SharedPhrase" DROP CONSTRAINT "SharedPhrase_senderId_fkey";

-- DropForeignKey
ALTER TABLE "SharedPhrase" DROP CONSTRAINT "SharedPhrase_userId_fkey";

-- AlterTable
ALTER TABLE "Phrase" DROP CONSTRAINT "Phrase_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Phrase_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Phrase_id_seq";

-- AlterTable
ALTER TABLE "SharedPhrase" DROP COLUMN "userId",
ALTER COLUMN "senderId" SET DATA TYPE TEXT,
ALTER COLUMN "receiverId" SET DATA TYPE TEXT,
ALTER COLUMN "phraseId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- AddForeignKey
ALTER TABLE "SharedPhrase" ADD CONSTRAINT "SharedPhrase_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedPhrase" ADD CONSTRAINT "SharedPhrase_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedPhrase" ADD CONSTRAINT "SharedPhrase_phraseId_fkey" FOREIGN KEY ("phraseId") REFERENCES "Phrase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
