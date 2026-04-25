import { db } from './src/lib/db'; async function main() { const p = await db.product.findMany(); console.log(p.map(x => x.imageUrl)); } main().finally(() => process.exit(0));
