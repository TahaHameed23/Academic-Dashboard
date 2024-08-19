import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

// Create Supabase client
const supabase = createClient(
    process.env.SUPABASE_PROJECT_URL,
    process.env.SUPABASE_PROJECT_API,
    {
        autoRefreshToken: true,
    }
);

// Upload file using standard upload
export async function uploadFile(filename, file, mimetype, isResource = false) {
    const { data, error } = await supabase.storage
        .from(isResource ? "resources" : `resources/${filename}`)
        .upload(isResource ? "r_" + filename : filename, file, {
            contentType: mimetype,
        });
    if (error) {
        // Handle error
        console.log(error.stack);
    } else {
        // Handle success
        return;
    }
}

export async function getFile(filename, isResource = false) {
    const { data, error } = supabase.storage
        .from(isResource ? "resources" : `resources/${filename}`)
        .getPublicUrl(filename);
    if (error) {
        // Handle error
        console.log(error);
    } else {
        // Handle success
        return data.publicUrl;
    }
}

export async function listFiles(req, res, next) {
    try {
        const { data, _ } = await supabase.storage.from("resources").list("", {
            limit: 100,
            offset: 0,
            sortBy: { column: "name", order: "asc" },
            search: "r_",
        });
        req.objs = data;
        next();
    } catch (e) {
        console.log(e);
    }
}
