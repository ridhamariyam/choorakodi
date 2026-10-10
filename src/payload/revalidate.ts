import { revalidatePath } from "next/cache";
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from "payload";

/**
 * Every page reads from the same content snapshot, so any save purges the
 * whole site rather than guessing which routes a field appears on. The site is
 * small enough that this costs nothing noticeable.
 *
 * Outside a Next.js request (the seed script, `payload migrate`) there is no
 * cache to purge and revalidatePath throws; that is expected and ignored.
 */
function revalidateSite() {
  try {
    revalidatePath("/", "layout");
  } catch {
    /* not running inside Next.js */
  }
}

export const revalidateCollection: CollectionAfterChangeHook = ({ doc }) => {
  revalidateSite();
  return doc;
};

export const revalidateCollectionDelete: CollectionAfterDeleteHook = ({ doc }) => {
  revalidateSite();
  return doc;
};

export const revalidateGlobal: GlobalAfterChangeHook = ({ doc }) => {
  revalidateSite();
  return doc;
};

export const collectionHooks = {
  afterChange: [revalidateCollection],
  afterDelete: [revalidateCollectionDelete],
};

export const globalHooks = {
  afterChange: [revalidateGlobal],
};
