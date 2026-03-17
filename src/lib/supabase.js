import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const uploadProductImage = async (file, productId) => {
  const ext = file.name.split(".").pop();
  const path = `products/${productId}-${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from("product-images") // ✅
    .upload(path, file, { upsert: true });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage
    .from("product-images") // ✅
    .getPublicUrl(path);

  return data.publicUrl;
};

export const uploadAvatar = async (file, userId) => {
  const ext = file.name.split(".").pop();
  const path = `avatars/${userId}.${ext}`;
  
  const { error } = await supabase.storage
    .from("product-images") // ✅
    .upload(path, file, { upsert: true });

  if (error) throw new Error(error.message);
  
  const { data } = supabase.storage
    .from("product-images") // ✅
    .getPublicUrl(path);
    
  return data.publicUrl;
};

export const deleteImage = async (bucket, path) => {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);
  if (error) throw new Error(error.message);
};