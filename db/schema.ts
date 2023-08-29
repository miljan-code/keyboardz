import type { AdapterAccount } from "@auth/core/adapters";
import { InferModel, relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "user",
  {
    id: text("id").notNull().primaryKey(),
    name: text("name"),
    email: text("email").notNull(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    bio: text("bio"),
    keyboard: text("keyboard"),
    github: text("github"),
    x: text("x"),
    website: text("website"),
  },
  (user) => ({
    userEmailIdx: index("user_email_idx").on(user.email),
  }),
);

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
  }),
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  }),
);

export const tests = pgTable(
  "test",
  {
    id: serial("id").notNull().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    wpm: integer("wpm").notNull(),
    rawWpm: integer("raw_wpm").notNull(),
    accuracy: integer("accuracy").notNull(),
    mode: text("mode").notNull(),
    amount: integer("amount").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (test) => ({
    userIdIdx: index("user_id_idx").on(test.userId),
  }),
);

export const rooms = pgTable(
  "room",
  {
    id: text("id").notNull().primaryKey(),
    creatorId: text("creator_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    roomName: text("room_name").notNull(),
    mode: text("mode").notNull(),
    amount: integer("amount").notNull(),
    isPublicRoom: boolean("is_public_room").notNull().default(true),
    maxUsers: integer("max_users").notNull(),
    minWpm: integer("min_wpm").notNull().default(0),
    isActiveRoom: boolean("is_active_room").default(true),
    participantsIds: text("participants_ids")
      .array()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (room) => ({
    isActiveRoomIdx: index("is_active_room_idx").on(room.isActiveRoom),
  }),
);

export const usersRelations = relations(users, ({ one, many }) => ({
  tests: many(tests),
  roomParticipant: one(rooms, {
    fields: [users.id],
    references: [rooms.participantsIds],
  }),
  roomCreator: one(rooms, {
    fields: [users.id],
    references: [rooms.creatorId],
  }),
}));

export const testsRelations = relations(tests, ({ one }) => ({
  user: one(users, {
    fields: [tests.userId],
    references: [users.id],
  }),
}));

export const roomsRelations = relations(rooms, ({ many }) => ({
  users: many(users),
}));

export type Test = InferModel<typeof tests>;
export type User = InferModel<typeof users>;
export type Room = InferModel<typeof rooms>;
