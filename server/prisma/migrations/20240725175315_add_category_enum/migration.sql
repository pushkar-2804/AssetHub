/*
  Warnings:

  - Changed the type of `category` on the `Asset` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- Step 1: Create the new enum type
CREATE TYPE "Category" AS ENUM ('GADGET', 'DEAL', 'SOFTWARE');

-- Step 2: Add a temporary column for the new enum type
ALTER TABLE "Asset" ADD COLUMN "new_category" "Category";

-- Step 3: Update the new column based on the old column's values
UPDATE "Asset" SET "new_category" = CASE
    WHEN "category" = 'GADGET' THEN 'GADGET'::"Category"        
    ELSE 'SOFTWARE'::"Category" -- Default or fallback value
END;

-- Step 4: Drop the old column
ALTER TABLE "Asset" DROP COLUMN "category";

-- Step 5: Rename the new column to the old column's name
ALTER TABLE "Asset" RENAME COLUMN "new_category" TO "category";
