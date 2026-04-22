import { db } from './src/db/index';
import { progress } from './src/db/schema';
import { eq } from 'drizzle-orm';

async function test() {
  try {
    const userId = undefined;
    const progressReq = await db.select().from(progress).where(eq(progress.userId, userId as any));
    console.log("Success:", progressReq);
  } catch(e) {
    console.error("ERROR CAUGHT:");
    console.error(e);
  }
}
test();
