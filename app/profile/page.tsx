import { db } from "@/db";
import { eq } from "drizzle-orm";

import { getSession } from "@/lib/auth";
import { users } from "@/db/schema";

const getCurrentUser = async () => {
  const session = await getSession();

  if (!session) return null;

  const currentUser = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
    with: {
      tests: true,
    },
  });

  return currentUser;
};

export default async function ProfilePage() {
  const currentUser = await getCurrentUser();

  return <div className=""></div>;
}
