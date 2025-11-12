-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `emailVerified` DATETIME(3) NULL,
    `hashedPassword` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `image` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `nationalId` VARCHAR(191) NULL,
    `cardNumber` VARCHAR(191) NULL,
    `shebaNumber` VARCHAR(191) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_phone_key`(`phone`),
    UNIQUE INDEX `User_nationalId_key`(`nationalId`),
    UNIQUE INDEX `User_shebaNumber_key`(`shebaNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `accounts` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `providerAccountId` VARCHAR(191) NOT NULL,
    `refresh_token` TEXT NULL,
    `access_token` TEXT NULL,
    `expires_at` INTEGER NULL,
    `token_type` VARCHAR(191) NULL,
    `scope` VARCHAR(191) NULL,
    `id_token` TEXT NULL,
    `session_state` VARCHAR(191) NULL,

    UNIQUE INDEX `accounts_provider_providerAccountId_key`(`provider`, `providerAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sessions` (
    `id` VARCHAR(191) NOT NULL,
    `session_token` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `sessions_session_token_key`(`session_token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `verification_tokens` (
    `identifier` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `verification_tokens_token_key`(`token`),
    UNIQUE INDEX `verification_tokens_identifier_token_key`(`identifier`, `token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `parentId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Category_name_key`(`name`),
    UNIQUE INDEX `Category_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Brand` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `logoUrl` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Brand_name_key`(`name`),
    UNIQUE INDEX `Brand_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `isVisible` BOOLEAN NOT NULL DEFAULT true,
    `gender` ENUM('MEN', 'WOMEN', 'UNISEX') NULL,
    `concentration` ENUM('PARFUM', 'EAU_DE_PARFUM', 'EAU_DE_TOILETTE', 'EAU_DE_COLOGNE', 'EAU_FRAICHE') NULL,
    `type` ENUM('PERFUME', 'GIFT_SET') NOT NULL DEFAULT 'PERFUME',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `brandId` VARCHAR(191) NOT NULL,
    `isFeatured` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Product_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Scent` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_scent` (
    `productId` VARCHAR(191) NOT NULL,
    `scentId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`productId`, `scentId`)
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
CREATE TABLE `ProductImage` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `altText` VARCHAR(191) NULL,
    `isMain` BOOLEAN NOT NULL DEFAULT false,
    `order` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductCategory` (
    `productId` VARCHAR(191) NOT NULL,
    `categoryId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`productId`, `categoryId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FragranceNote` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,

    UNIQUE INDEX `FragranceNote_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductFragranceNote` (
    `productId` VARCHAR(191) NOT NULL,
    `noteId` VARCHAR(191) NOT NULL,
    `noteType` ENUM('TOP', 'MIDDLE', 'BASE') NOT NULL,

    PRIMARY KEY (`productId`, `noteId`, `noteType`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `totalAmount` DOUBLE NOT NULL,
    `status` ENUM('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED', 'FAILED') NOT NULL DEFAULT 'PENDING',
    `shippingAddress` TEXT NOT NULL,
    `billingAddress` TEXT NULL,
    `paymentMethod` VARCHAR(191) NULL,
    `paymentId` VARCHAR(191) NULL,
    `transactionId` VARCHAR(191) NULL,
    `shippingMethod` VARCHAR(191) NULL,
    `shippingCost` DOUBLE NULL DEFAULT 0,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Order_paymentId_key`(`paymentId`),
    UNIQUE INDEX `Order_transactionId_key`(`transactionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderItem` (
    `id` VARCHAR(191) NOT NULL,
    `orderId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `productName` VARCHAR(191) NOT NULL,
    `productBrand` VARCHAR(191) NULL,
    `productVariantSize` VARCHAR(191) NULL,
    `productImage` VARCHAR(191) NULL,
    `quantity` INTEGER NOT NULL,
    `priceAtPurchase` DOUBLE NOT NULL,

    INDEX `OrderItem_orderId_idx`(`orderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Review` (
    `id` VARCHAR(191) NOT NULL,
    `text` VARCHAR(191) NOT NULL,
    `rating` INTEGER NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Review_productId_idx`(`productId`),
    UNIQUE INDEX `Review_userId_productId_key`(`userId`, `productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Wishlist` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Wishlist_userId_productId_key`(`userId`, `productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `verificationcode` (
    `id` VARCHAR(191) NOT NULL,
    `identifier` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `used` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_identifier_used_expires`(`identifier`, `used`, `expiresAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Address` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `receiverName` VARCHAR(191) NOT NULL,
    `receiverPhone` VARCHAR(191) NOT NULL,
    `province` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `postalCode` VARCHAR(191) NOT NULL,
    `address` TEXT NOT NULL,
    `isDefault` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Address_userId_idx`(`userId`),
    INDEX `Address_userId_isDefault_idx`(`userId`, `isDefault`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cart` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `sessionId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Cart_userId_key`(`userId`),
    UNIQUE INDEX `Cart_sessionId_key`(`sessionId`),
    INDEX `Cart_sessionId_idx`(`sessionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CartItem` (
    `id` VARCHAR(191) NOT NULL,
    `cartId` VARCHAR(191) NOT NULL,
    `variantId` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `CartItem_cartId_idx`(`cartId`),
    UNIQUE INDEX `CartItem_cartId_variantId_key`(`cartId`, `variantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `accounts` ADD CONSTRAINT `accounts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Category` ADD CONSTRAINT `Category_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_brandId_fkey` FOREIGN KEY (`brandId`) REFERENCES `Brand`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_scent` ADD CONSTRAINT `product_scent_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_scent` ADD CONSTRAINT `product_scent_scentId_fkey` FOREIGN KEY (`scentId`) REFERENCES `Scent`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Variant` ADD CONSTRAINT `Variant_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductImage` ADD CONSTRAINT `ProductImage_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductCategory` ADD CONSTRAINT `ProductCategory_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductCategory` ADD CONSTRAINT `ProductCategory_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductFragranceNote` ADD CONSTRAINT `ProductFragranceNote_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductFragranceNote` ADD CONSTRAINT `ProductFragranceNote_noteId_fkey` FOREIGN KEY (`noteId`) REFERENCES `FragranceNote`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Wishlist` ADD CONSTRAINT `Wishlist_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Wishlist` ADD CONSTRAINT `Wishlist_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cart` ADD CONSTRAINT `Cart_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CartItem` ADD CONSTRAINT `CartItem_cartId_fkey` FOREIGN KEY (`cartId`) REFERENCES `Cart`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CartItem` ADD CONSTRAINT `CartItem_variantId_fkey` FOREIGN KEY (`variantId`) REFERENCES `Variant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

