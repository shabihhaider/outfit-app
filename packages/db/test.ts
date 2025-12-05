import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

// Load env vars from .env.test file
dotenv.config({ path: path.resolve(__dirname, ".env.test") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase URL or Key in .env file");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log("🔄 Testing Supabase connection...");
  console.log(`📡 URL: ${supabaseUrl}`);

  try {
    // Try to fetch from shopping_products (publicly readable)
    const { data, error } = await supabase
      .from("shopping_products")
      .select("count", { count: "exact", head: true });

    if (error) {
      console.error("❌ Connection failed:", error.message);
    } else {
      console.log("✅ Connection successful!");
      console.log('📊 Accessed "shopping_products" table. Row count:', data);
    }
  } catch (err) {
    console.error("❌ Unexpected error:", err);
  }
}

testConnection();
