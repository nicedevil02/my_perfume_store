-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: perfume_db
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accounts` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `type` varchar(191) NOT NULL,
  `provider` varchar(191) NOT NULL,
  `providerAccountId` varchar(191) NOT NULL,
  `refresh_token` text DEFAULT NULL,
  `access_token` text DEFAULT NULL,
  `expires_at` int(11) DEFAULT NULL,
  `token_type` varchar(191) DEFAULT NULL,
  `scope` varchar(191) DEFAULT NULL,
  `id_token` text DEFAULT NULL,
  `session_state` varchar(191) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `accounts_provider_providerAccountId_key` (`provider`,`providerAccountId`),
  KEY `accounts_userId_fkey` (`userId`),
  CONSTRAINT `accounts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `address`
--

DROP TABLE IF EXISTS `address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `address` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `receiverName` varchar(191) NOT NULL,
  `receiverPhone` varchar(191) NOT NULL,
  `province` varchar(191) NOT NULL,
  `city` varchar(191) NOT NULL,
  `postalCode` varchar(191) NOT NULL,
  `address` text NOT NULL,
  `isDefault` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Address_userId_idx` (`userId`),
  KEY `Address_userId_isDefault_idx` (`userId`,`isDefault`),
  CONSTRAINT `Address_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `address`
--

LOCK TABLES `address` WRITE;
/*!40000 ALTER TABLE `address` DISABLE KEYS */;
/*!40000 ALTER TABLE `address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `brand`
--

DROP TABLE IF EXISTS `brand`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `brand` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  `logoUrl` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Brand_name_key` (`name`),
  UNIQUE KEY `Brand_slug_key` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brand`
--

LOCK TABLES `brand` WRITE;
/*!40000 ALTER TABLE `brand` DISABLE KEYS */;
/*!40000 ALTER TABLE `brand` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) DEFAULT NULL,
  `sessionId` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Cart_userId_key` (`userId`),
  UNIQUE KEY `Cart_sessionId_key` (`sessionId`),
  KEY `Cart_sessionId_idx` (`sessionId`),
  CONSTRAINT `Cart_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cartitem`
--

DROP TABLE IF EXISTS `cartitem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cartitem` (
  `id` varchar(191) NOT NULL,
  `cartId` varchar(191) NOT NULL,
  `variantId` varchar(191) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `CartItem_cartId_variantId_key` (`cartId`,`variantId`),
  KEY `CartItem_cartId_idx` (`cartId`),
  KEY `CartItem_variantId_fkey` (`variantId`),
  CONSTRAINT `CartItem_cartId_fkey` FOREIGN KEY (`cartId`) REFERENCES `cart` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `CartItem_variantId_fkey` FOREIGN KEY (`variantId`) REFERENCES `variant` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cartitem`
--

LOCK TABLES `cartitem` WRITE;
/*!40000 ALTER TABLE `cartitem` DISABLE KEYS */;
/*!40000 ALTER TABLE `cartitem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  `parentId` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Category_name_key` (`name`),
  UNIQUE KEY `Category_slug_key` (`slug`),
  KEY `Category_parentId_fkey` (`parentId`),
  CONSTRAINT `Category_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `category` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fragrancenote`
--

DROP TABLE IF EXISTS `fragrancenote`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fragrancenote` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `FragranceNote_name_key` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fragrancenote`
--

LOCK TABLES `fragrancenote` WRITE;
/*!40000 ALTER TABLE `fragrancenote` DISABLE KEYS */;
/*!40000 ALTER TABLE `fragrancenote` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order`
--

DROP TABLE IF EXISTS `order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `totalAmount` double NOT NULL,
  `status` enum('PENDING','PROCESSING','SHIPPED','DELIVERED','CANCELLED','REFUNDED','FAILED') NOT NULL DEFAULT 'PENDING',
  `shippingAddress` text NOT NULL,
  `billingAddress` text DEFAULT NULL,
  `paymentMethod` varchar(191) DEFAULT NULL,
  `paymentId` varchar(191) DEFAULT NULL,
  `transactionId` varchar(191) DEFAULT NULL,
  `shippingMethod` varchar(191) DEFAULT NULL,
  `shippingCost` double DEFAULT 0,
  `notes` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Order_paymentId_key` (`paymentId`),
  UNIQUE KEY `Order_transactionId_key` (`transactionId`),
  KEY `Order_userId_fkey` (`userId`),
  CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order`
--

LOCK TABLES `order` WRITE;
/*!40000 ALTER TABLE `order` DISABLE KEYS */;
/*!40000 ALTER TABLE `order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orderitem`
--

DROP TABLE IF EXISTS `orderitem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orderitem` (
  `id` varchar(191) NOT NULL,
  `orderId` varchar(191) NOT NULL,
  `productId` varchar(191) NOT NULL,
  `productName` varchar(191) NOT NULL,
  `productBrand` varchar(191) DEFAULT NULL,
  `productVariantSize` varchar(191) DEFAULT NULL,
  `productImage` varchar(191) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `priceAtPurchase` double NOT NULL,
  PRIMARY KEY (`id`),
  KEY `OrderItem_orderId_idx` (`orderId`),
  CONSTRAINT `OrderItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orderitem`
--

LOCK TABLES `orderitem` WRITE;
/*!40000 ALTER TABLE `orderitem` DISABLE KEYS */;
/*!40000 ALTER TABLE `orderitem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `description` varchar(191) DEFAULT NULL,
  `isVisible` tinyint(1) NOT NULL DEFAULT 1,
  `gender` enum('MEN','WOMEN','UNISEX') DEFAULT NULL,
  `concentration` enum('PARFUM','EAU_DE_PARFUM','EAU_DE_TOILETTE','EAU_DE_COLOGNE','EAU_FRAICHE') DEFAULT NULL,
  `type` enum('PERFUME','GIFT_SET') NOT NULL DEFAULT 'PERFUME',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `brandId` varchar(191) NOT NULL,
  `isFeatured` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Product_slug_key` (`slug`),
  KEY `Product_brandId_fkey` (`brandId`),
  CONSTRAINT `Product_brandId_fkey` FOREIGN KEY (`brandId`) REFERENCES `brand` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_scent`
--

DROP TABLE IF EXISTS `product_scent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_scent` (
  `productId` varchar(191) NOT NULL,
  `scentId` varchar(191) NOT NULL,
  PRIMARY KEY (`productId`,`scentId`),
  KEY `product_scent_scentId_fkey` (`scentId`),
  CONSTRAINT `product_scent_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `product_scent_scentId_fkey` FOREIGN KEY (`scentId`) REFERENCES `scent` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_scent`
--

LOCK TABLES `product_scent` WRITE;
/*!40000 ALTER TABLE `product_scent` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_scent` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productcategory`
--

DROP TABLE IF EXISTS `productcategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productcategory` (
  `productId` varchar(191) NOT NULL,
  `categoryId` varchar(191) NOT NULL,
  PRIMARY KEY (`productId`,`categoryId`),
  KEY `ProductCategory_categoryId_fkey` (`categoryId`),
  CONSTRAINT `ProductCategory_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ProductCategory_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productcategory`
--

LOCK TABLES `productcategory` WRITE;
/*!40000 ALTER TABLE `productcategory` DISABLE KEYS */;
/*!40000 ALTER TABLE `productcategory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productfragrancenote`
--

DROP TABLE IF EXISTS `productfragrancenote`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productfragrancenote` (
  `productId` varchar(191) NOT NULL,
  `noteId` varchar(191) NOT NULL,
  `noteType` enum('TOP','MIDDLE','BASE') NOT NULL,
  PRIMARY KEY (`productId`,`noteId`,`noteType`),
  KEY `ProductFragranceNote_noteId_fkey` (`noteId`),
  CONSTRAINT `ProductFragranceNote_noteId_fkey` FOREIGN KEY (`noteId`) REFERENCES `fragrancenote` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `ProductFragranceNote_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productfragrancenote`
--

LOCK TABLES `productfragrancenote` WRITE;
/*!40000 ALTER TABLE `productfragrancenote` DISABLE KEYS */;
/*!40000 ALTER TABLE `productfragrancenote` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productimage`
--

DROP TABLE IF EXISTS `productimage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productimage` (
  `id` varchar(191) NOT NULL,
  `productId` varchar(191) NOT NULL,
  `url` varchar(191) NOT NULL,
  `altText` varchar(191) DEFAULT NULL,
  `isMain` tinyint(1) NOT NULL DEFAULT 0,
  `order` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `ProductImage_productId_fkey` (`productId`),
  CONSTRAINT `ProductImage_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productimage`
--

LOCK TABLES `productimage` WRITE;
/*!40000 ALTER TABLE `productimage` DISABLE KEYS */;
/*!40000 ALTER TABLE `productimage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review`
--

DROP TABLE IF EXISTS `review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review` (
  `id` varchar(191) NOT NULL,
  `text` varchar(191) NOT NULL,
  `rating` int(11) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `productId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Review_userId_productId_key` (`userId`,`productId`),
  KEY `Review_productId_idx` (`productId`),
  CONSTRAINT `Review_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Review_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review`
--

LOCK TABLES `review` WRITE;
/*!40000 ALTER TABLE `review` DISABLE KEYS */;
/*!40000 ALTER TABLE `review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `scent`
--

DROP TABLE IF EXISTS `scent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `scent` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `category` varchar(191) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scent`
--

LOCK TABLES `scent` WRITE;
/*!40000 ALTER TABLE `scent` DISABLE KEYS */;
/*!40000 ALTER TABLE `scent` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(191) NOT NULL,
  `session_token` varchar(191) NOT NULL,
  `user_id` varchar(191) NOT NULL,
  `expires` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sessions_session_token_key` (`session_token`),
  KEY `sessions_user_id_fkey` (`user_id`),
  CONSTRAINT `sessions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) DEFAULT NULL,
  `email` varchar(191) DEFAULT NULL,
  `emailVerified` datetime(3) DEFAULT NULL,
  `hashedPassword` varchar(191) DEFAULT NULL,
  `phone` varchar(191) DEFAULT NULL,
  `image` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `nationalId` varchar(191) DEFAULT NULL,
  `cardNumber` varchar(191) DEFAULT NULL,
  `shebaNumber` varchar(191) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`),
  UNIQUE KEY `User_phone_key` (`phone`),
  UNIQUE KEY `User_nationalId_key` (`nationalId`),
  UNIQUE KEY `User_shebaNumber_key` (`shebaNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('cmhsb6plz0001cxeg82uxjg61',NULL,NULL,NULL,NULL,'09355304811',NULL,'2025-11-09 22:52:31.656','2025-11-09 22:52:31.656',NULL,NULL,NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `variant`
--

DROP TABLE IF EXISTS `variant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `variant` (
  `id` varchar(191) NOT NULL,
  `size` int(11) NOT NULL,
  `price` double NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `discount` double DEFAULT NULL,
  `productId` varchar(191) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Variant_productId_fkey` (`productId`),
  CONSTRAINT `Variant_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `variant`
--

LOCK TABLES `variant` WRITE;
/*!40000 ALTER TABLE `variant` DISABLE KEYS */;
/*!40000 ALTER TABLE `variant` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `verification_tokens`
--

DROP TABLE IF EXISTS `verification_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `verification_tokens` (
  `identifier` varchar(191) NOT NULL,
  `token` varchar(191) NOT NULL,
  `expires` datetime(3) NOT NULL,
  UNIQUE KEY `verification_tokens_token_key` (`token`),
  UNIQUE KEY `verification_tokens_identifier_token_key` (`identifier`,`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `verification_tokens`
--

LOCK TABLES `verification_tokens` WRITE;
/*!40000 ALTER TABLE `verification_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `verification_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `verificationcode`
--

DROP TABLE IF EXISTS `verificationcode`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `verificationcode` (
  `id` varchar(191) NOT NULL,
  `identifier` varchar(191) NOT NULL,
  `code` varchar(191) NOT NULL,
  `expiresAt` datetime(3) NOT NULL,
  `used` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `idx_identifier_used_expires` (`identifier`,`used`,`expiresAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `verificationcode`
--

LOCK TABLES `verificationcode` WRITE;
/*!40000 ALTER TABLE `verificationcode` DISABLE KEYS */;
INSERT INTO `verificationcode` VALUES ('cmhsb6hsn0000cxeg1f4jia71','09355304811','805824','2025-11-09 22:57:21.497',1,'2025-11-09 22:52:21.527');
/*!40000 ALTER TABLE `verificationcode` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wishlist`
--

DROP TABLE IF EXISTS `wishlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wishlist` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `productId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Wishlist_userId_productId_key` (`userId`,`productId`),
  KEY `Wishlist_productId_fkey` (`productId`),
  CONSTRAINT `Wishlist_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Wishlist_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishlist`
--

LOCK TABLES `wishlist` WRITE;
/*!40000 ALTER TABLE `wishlist` DISABLE KEYS */;
/*!40000 ALTER TABLE `wishlist` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-10  2:36:04
