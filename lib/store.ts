import {
  DBStructure,
  GenerationImage,
  User,
  generateId,
  generateRecoveryKey,
  loadDB,
  saveDB,
} from "@/lib/db";

type ImageUpdate = Partial<
  Pick<
    GenerationImage,
    | "final_prompt"
    | "image_url"
    | "storage_path"
    | "status"
    | "error_message"
    | "updated_at"
  >
>;

type StorageUpload = {
  imageUrl: string;
  storagePath: string;
};

function mutateJson(mutator: (db: DBStructure) => void): DBStructure {
  const db = loadDB();
  mutator(db);
  saveDB(db);
  return db;
}

function upsertLocalUser(user: User): void {
  mutateJson((db) => {
    const index = db.users.findIndex((item) => item.user_id === user.user_id);
    if (index === -1) {
      db.users.push(user);
      return;
    }
    db.users[index] = user;
  });
}

export async function createUser(): Promise<User> {
  const newUser: User = {
    user_id: generateId("user"),
    recovery_key: generateRecoveryKey(),
    created_at: new Date().toISOString(),
  };

  upsertLocalUser(newUser);
  // await mirrorUserToSupabase(newUser);

  return newUser;
}

export async function findUserById(userId: string): Promise<User | null> {
  const localUser = loadDB().users.find((user) => user.user_id === userId) || null;
  const supabase = null;// getSupabase({ userId });

  if (!supabase) {
    return localUser;
  }

  // const { data, error } = await supabase
  //   .from("users")
  //   .select("user_id,recovery_key,created_at")
  //   .eq("user_id", userId)
  //   .maybeSingle<User>();

  // if (error) {
  //   console.warn("Supabase user lookup failed, using local JSON:", error);
    if (localUser) return localUser;
  //   throw error;
  // }

  // if (data) {
  //   upsertLocalUser(data);
  //   return data;
  // }

  // if (localUser) {
  //   await mirrorUserToSupabase(localUser);
  // }

  return localUser;
}
