import { ObjectId } from "mongodb";
import { getDb } from "./mongodb";
import type { BlockedRange, Room, RoomImage } from "@/types";

function toRoom(doc: Record<string, unknown>): Room {
  return {
    ...doc,
    _id: (doc._id as ObjectId).toString(),
  } as Room;
}

export async function getFeaturedRooms(): Promise<Room[]> {
  const db = await getDb();
  const docs = await db
    .collection("rooms")
    .find({ featured: true })
    .sort({ order: 1, createdAt: -1 })
    .limit(6)
    .project({ title: 1, slug: 1, type: 1, price: 1, area: 1, floor: 1, available: 1, "images": { $slice: 1 } })
    .toArray();
  return docs.map(toRoom);
}

export async function getAvailableRooms(): Promise<Room[]> {
  const db = await getDb();
  const docs = await db
    .collection("rooms")
    .find({ available: true })
    .sort({ order: 1, createdAt: -1 })
    .limit(6)
    .project({ title: 1, slug: 1, type: 1, price: 1, area: 1, floor: 1, available: 1, "images": { $slice: 1 } })
    .toArray();
  return docs.map(toRoom);
}

export async function getAllRooms(): Promise<Room[]> {
  const db = await getDb();
  const docs = await db
    .collection("rooms")
    .find({})
    .sort({ order: 1, createdAt: -1 })
    .project({ title: 1, slug: 1, type: 1, price: 1, area: 1, floor: 1, available: 1, "images": { $slice: 1 } })
    .toArray();
  return docs.map(toRoom);
}

export async function getRoomBySlug(slug: string): Promise<Room | null> {
  const db = await getDb();
  const doc = await db.collection("rooms").findOne({ slug });
  if (!doc) return null;
  return toRoom(doc as Record<string, unknown>);
}

export async function getAllRoomSlugs(): Promise<{ slug: string }[]> {
  const db = await getDb();
  const docs = await db
    .collection("rooms")
    .find({})
    .project({ slug: 1 })
    .toArray();
  return docs.map((d) => ({ slug: d.slug as string }));
}

export async function createRoom(data: Omit<Room, "_id" | "createdAt" | "updatedAt">): Promise<Room> {
  const db = await getDb();
  const now = new Date();
  const result = await db.collection("rooms").insertOne({ ...data, createdAt: now, updatedAt: now });
  return { ...data, _id: result.insertedId.toString(), createdAt: now, updatedAt: now };
}

export async function updateRoom(id: string, data: Partial<Omit<Room, "_id" | "createdAt">>): Promise<boolean> {
  const db = await getDb();
  const result = await db.collection("rooms").updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...data, updatedAt: new Date() } }
  );
  return result.matchedCount > 0;
}

export async function deleteRoom(id: string): Promise<boolean> {
  const db = await getDb();
  const result = await db.collection("rooms").deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

export async function getAllRoomsForAdmin(): Promise<Room[]> {
  const db = await getDb();
  const docs = await db.collection("rooms").find({}).sort({ order: 1, createdAt: -1 }).toArray();
  return docs.map(toRoom);
}

export async function updateRoomOrder(roomIds: string[]): Promise<void> {
  const db = await getDb();
  const bulkOps = roomIds.map((id, index) => ({
    updateOne: {
      filter: { _id: new ObjectId(id) },
      update: { $set: { order: index } }
    }
  }));
  
  if (bulkOps.length > 0) {
    await db.collection("rooms").bulkWrite(bulkOps);
  }
}

export async function getRoomById(id: string): Promise<Room | null> {
  const db = await getDb();
  const doc = await db.collection("rooms").findOne({ _id: new ObjectId(id) });
  if (!doc) return null;
  return toRoom(doc as Record<string, unknown>);
}

export async function updateRoomAvailability(
  id: string,
  blockedRanges: BlockedRange[]
): Promise<boolean> {
  const db = await getDb();
  const result = await db.collection("rooms").updateOne(
    { _id: new ObjectId(id) },
    { $set: { blockedRanges, updatedAt: new Date() } }
  );
  return result.matchedCount > 0;
}

export type { RoomImage, BlockedRange };
