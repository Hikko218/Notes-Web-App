-- DropForeignKey
ALTER TABLE "public"."Note" DROP CONSTRAINT "Note_folderId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Note" ADD CONSTRAINT "Note_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "public"."Folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
