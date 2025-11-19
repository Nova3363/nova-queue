import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

console.log("Worker running...");

async function processQueue() {
  const { data, error } = await supabase
    .from(process.env.QUEUE_TABLE)
    .select("*")
    .eq("processed", false)
    .limit(1);

  if (error) return console.log("DB Error:", error.message);
  if (!data.length) return;

  const item = data[0];
  console.log("Processing item:", item.id);

  await supabase
    .from(process.env.QUEUE_TABLE)
    .update({ processed: true })
    .eq("id", item.id);
}

setInterval(processQueue, 5000);
