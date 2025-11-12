import { PrismaClient, GenderTarget, Concentration, FragranceNoteType, OrderStatus, Brand, Category, Scent, FragranceNote } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // 1. Clean up existing data
  console.log('Cleaning database...');
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productCategory.deleteMany();
  await prisma.productScent.deleteMany();
  await prisma.productFragranceNote.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.category.deleteMany();
  await prisma.scent.deleteMany();
  await prisma.fragranceNote.deleteMany();
  await prisma.user.deleteMany();
  console.log('Database cleaned.');

  // 2. Create Brands
  console.log('Creating brands...');
  const brandData = [
    { name: 'Chanel', slug: 'chanel', logoUrl: '/brands/chanel.png' },
    { name: 'Dior', slug: 'dior', logoUrl: '/brands/dior.png' },
    { name: 'Versace', slug: 'versace', logoUrl: '/brands/versace.png' },
    { name: 'Tom Ford', slug: 'tom-ford', logoUrl: '/brands/tom-ford.png' },
  ];
  const brands: Brand[] = [];
  for (const data of brandData) {
    brands.push(await prisma.brand.create({ data }));
  }

  // 3. Create Categories
  console.log('Creating categories...');
  const categoryData = [
    { name: 'مردانه', slug: 'men' },
    { name: 'زنانه', slug: 'women' },
    { name: 'یونیسکس', slug: 'unisex' },
  ];
  const categories: Category[] = [];
  for (const data of categoryData) {
    categories.push(await prisma.category.create({ data }));
  }

  // 4. Create Scents
  console.log('Creating scents...');
  const scentData = [
    { name: 'گلی', category: 'Floral' },
    { name: 'چوبی', category: 'Woody' },
    { name: 'مرکباتی', category: 'Citrus' },
    { name: 'شرقی', category: 'Oriental' },
    { name: 'تند', category: 'Spicy' },
  ];
  const scents: Scent[] = [];
  for (const data of scentData) {
    scents.push(await prisma.scent.create({ data }));
  }

  // 5. Create Fragrance Notes
  console.log('Creating fragrance notes...');
  const noteData = [
    { name: 'Bergamot' }, { name: 'Lavender' }, { name: 'Rose' },
    { name: 'Jasmine' }, { name: 'Sandalwood' }, { name: 'Vanilla' },
    { name: 'Cedarwood' }, { name: 'Patchouli' }, { name: 'Musk' },
  ];
  const notes: FragranceNote[] = [];
  for (const data of noteData) {
    notes.push(await prisma.fragranceNote.create({ data }));
  }

  // 6. Create Products
  console.log('Creating products...');
  const genderValues = Object.values(GenderTarget);
  const concentrationValues = Object.values(Concentration);

  for (let i = 0; i < 20; i++) {
    const productName = faker.commerce.productName() + ' Perfume';
    const product = await prisma.product.create({
      data: {
        name: productName,
        slug: faker.helpers.slugify(productName).toLowerCase() + `-${i}`, // Ensure slug is unique
        description: faker.commerce.productDescription(),
        brandId: faker.helpers.arrayElement(brands).id,
        gender: faker.helpers.arrayElement(genderValues),
        concentration: faker.helpers.arrayElement(concentrationValues),
        
        // Relations
        categories: {
          create: { categoryId: faker.helpers.arrayElement(categories).id },
        },
        scents: {
          create: { scentId: faker.helpers.arrayElement(scents).id },
        },
        notes: {
          create: [
            { noteId: faker.helpers.arrayElement(notes).id, noteType: FragranceNoteType.TOP },
            { noteId: faker.helpers.arrayElement(notes).id, noteType: FragranceNoteType.MIDDLE },
            { noteId: faker.helpers.arrayElement(notes).id, noteType: FragranceNoteType.BASE },
          ],
        },
        variants: {
          create: [
            { size: 50, price: parseFloat(faker.commerce.price({ min: 500000, max: 1500000 })), stock: faker.number.int({ min: 0, max: 50 }) },
            { size: 100, price: parseFloat(faker.commerce.price({ min: 1500000, max: 4000000 })), stock: faker.number.int({ min: 10, max: 100 }) },
          ],
        },
        images: {
          create: [
            { url: `https://placehold.co/600x600/EAD9F2/5D3A99?text=${encodeURIComponent(productName.split(' ')[0])}`, isMain: true },
            { url: `https://placehold.co/600x600/D9EAF2/3A5D99?text=${encodeURIComponent(productName.split(' ')[1])}` },
          ],
        },
      },
    });
    console.log(`Created product: ${product.name}`);
  }

  // 7. Create a sample user
  console.log('Creating a sample user...');
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'کاربر تستی',
    },
  });

  // 8. Create Orders for the sample user
  console.log('Creating orders for the sample user...');
  const allProducts = await prisma.product.findMany();
  const orderStatusValues = Object.values(OrderStatus);

  for (let i = 0; i < 5; i++) {
    const orderedProduct = faker.helpers.arrayElement(allProducts);
    await prisma.order.create({
      data: {
        userId: user.id,
        totalAmount: parseFloat(faker.commerce.price({ min: 1000000, max: 5000000 })),
        status: faker.helpers.arrayElement(orderStatusValues),
        shippingAddress: faker.location.streetAddress(true),
        orderItems: {
          create: {
            productId: orderedProduct.id,
            productName: orderedProduct.name,
            quantity: 1,
            priceAtPurchase: 1500000, // Example price
            productImage: `https://placehold.co/100x100`,
          },
        },
      },
    });
  }

  // 9. Create Wishlist items
  console.log('Creating wishlist for the sample user...');
  const wishlistProducts = faker.helpers.arrayElements(allProducts, 3);
  for (const product of wishlistProducts) {
    await prisma.wishlist.create({
      data: {
        userId: user.id,
        productId: product.id,
      },
    });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
