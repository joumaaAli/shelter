import { createClient } from "@/utils/supabase/component";

const supabase = createClient();

const constructImage = (imageId) => {
  const { data } = supabase.storage.from("photos").getPublicUrl(imageId);
  return data.publicUrl;
};

export default constructImage;
