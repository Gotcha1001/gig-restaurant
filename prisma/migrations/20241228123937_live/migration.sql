-- CreateTable
CREATE TABLE "SharedProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sharedBy" TEXT NOT NULL,
    "profileType" TEXT NOT NULL,
    "shareDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shareMessage" TEXT,

    CONSTRAINT "SharedProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SharedProfile_userId_idx" ON "SharedProfile"("userId");

-- CreateIndex
CREATE INDEX "SharedProfile_sharedBy_idx" ON "SharedProfile"("sharedBy");

-- AddForeignKey
ALTER TABLE "SharedProfile" ADD CONSTRAINT "SharedProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
