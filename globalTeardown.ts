export default async function globalTeardown() {
  console.log('🧹 [globalTeardown] Cleanup started...');
  await new Promise((resolve) => setTimeout(resolve, 3000));
  console.log('✅ [globalTeardown] Done.');
}
