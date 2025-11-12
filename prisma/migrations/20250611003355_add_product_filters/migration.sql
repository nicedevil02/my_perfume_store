/*
  Warnings:

  - You are about to drop the column `averageRating` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `concentration` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `countryOfOrigin` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `isFeatured` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `launchYear` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `reviewCount` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `sku` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `product` table. All the data in the column will be lost.
  - You are about to alter the column `gender` on the `product` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(4))` to `VarChar(191)`.
  - You are about to drop the column `comment` on the `review` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `addedAt` on the `wishlistitem` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,productId]` on the table `WishlistItem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `text` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `userId` to the `WishlistItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `wishlistitem` DROP FOREIGN KEY `WishlistItem_wishlistId_fkey`;

-- DropIndex
DROP INDEX `Product_name_idx` ON `product`;

-- DropIndex
DROP INDEX `Product_sku_key` ON `product`;

-- DropIndex
DROP INDEX `WishlistItem_wishlistId_productId_key` ON `wishlistitem`;

-- AlterTable
ALTER TABLE `product` DROP COLUMN `averageRating`,
    DROP COLUMN `concentration`,
    DROP COLUMN `countryOfOrigin`,
    DROP COLUMN `isFeatured`,
    DROP COLUMN `launchYear`,
    DROP COLUMN `reviewCount`,
    DROP COLUMN `sku`,
    DROP COLUMN `tags`,
    MODIFY `description` VARCHAR(191) NULL,
    MODIFY `gender` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `review` DROP COLUMN `comment`,
    ADD COLUMN `text` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `role`,
    ADD COLUMN `phone` VARCHAR(191) NULL,
    MODIFY `email` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `wishlistitem` DROP COLUMN `addedAt`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `userId` VARCHAR(191) NOT NULL,
    MODIFY `wishlistId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Scent` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Variant` (
    `id` VARCHAR(191) NOT NULL,
    `size` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,
    `stock` INTEGER NOT NULL DEFAULT 0,
    `discount` DOUBLE NULL,
    `productId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ProductToScent` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ProductToScent_AB_unique`(`A`, `B`),
    INDEX `_ProductToScent_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `WishlistItem_userId_productId_key` ON `WishlistItem`(`userId`, `productId`);

-- AddForeignKey
ALTER TABLE `Variant` ADD CONSTRAINT `Variant_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WishlistItem` ADD CONSTRAINT `WishlistItem_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WishlistItem` ADD CONSTRAINT `WishlistItem_wishlistId_fkey` FOREIGN KEY (`wishlistId`) REFERENCES `Wishlist`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProductToScent` ADD CONSTRAINT `_ProductToScent_A_fkey` FOREIGN KEY (`A`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProductToScent` ADD CONSTRAINT `_ProductToScent_B_fkey` FOREIGN KEY (`B`) REFERENCES `Scent`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
