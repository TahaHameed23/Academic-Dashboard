import express from "express";
import {
    showStudents,
    getAttendance,
    updateAttendance,
    showDetails,
    updateDetailsAdmin,
    showDetailsAdmin,
    uploadVideoURL,
    getVideoURL,
    updateDetails,
} from "./_db.js";
import { uploadFile, getFile, listFiles } from "./supabase.js";
import youtubeThumbnail from "youtube-thumbnail";
import getTitle from "youtube-title";
import path from "node:path";
import { fileURLToPath } from "url";
import morgan from "morgan";
import multer from "multer";
import dotenv from "dotenv";
import { auth } from "../modules/auth.js";
dotenv.config();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(morgan("dev"));
app.use(express.static("public"));
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/admin", async (req, res, next) => {
    const response = await showStudents();
    res.render("admin", { students: response });
});

app.post("/admin", upload.single("files"), async (req, res) => {
    if (req.headers.auth === "admin") {
        updateAttendance(req.body);
        res.sendStatus(200);
    }
    if (req.headers.resources === "true") {
        try {
            await uploadFile(
                req.file.originalname,
                req.file.buffer,
                req.file.mimetype,
                true
            );
            return res.sendStatus(200);
        } catch (e) {
            console.log(e);
        }
    }
    if (req.headers.resources === "video_link") {
        await uploadVideoURL(req.body.video_link).then(() => {
            res.sendStatus(200);
        });
    }
});

app.post("/student/", upload.single("files"), async (req, res) => {
    try {
        await uploadFile(
            `image_${req.headers.email.split(".")[0]}
            }`,
            req.file.buffer,
            req.file.mimetype
        );
        if (req.headers.haslocalimage !== "true") {
            const imageURL = await getFile(
                `image_${req.headers.email.split(".")[0]}.${
                    req.file.mimetype.split("/")[1]
                }`
            );
            console.log(imageURL);
            res.send(JSON.stringify({ imageURL: imageURL }));
        }
    } catch (e) {
        console.log(e);
    }
});

app.get("/student", async (req, res) => {
    const attendance = await getAttendance(
        decodeURIComponent(req.query?.email)
    );
    res.render("stud", { attendance: attendance });
});

app.post("/", auth);

app.get("/details", async (req, res) => {
    const response = await showDetails(req.query.email);
    res.render("info", { details: response });
});

app.post("/details", async (req, res) => {
    if (req.headers.auth === "Admin") {
        updateDetailsAdmin(req.headers.id, req.body);
    } else {
        updateDetails(req.headers.email, req.body);
    }
    res.sendStatus(200);
});

app.get("/admin/details/:id", async (req, res) => {
    const response = await showDetailsAdmin(req.params.id);
    res.render("infoAdmin", { details: response });
});

app.get("/resources", listFiles, async (req, res) => {
    const resources_name = {};
    for (let i = 0; i < req.objs.length; i++) {
        const value = req.objs[i].name.toString();
        const response = await getFile(value, true);
        const name = req.objs[i].name.toString();
        resources_name[name] = response;
    }

    const res_url = Object.values(resources_name);
    console.log(resources_name[0]);

    //TODO: add video_links table
    const thumbnail = [];
    const video_link = [];
    const video_title = [];
    const apiKey = process.env.YOUTUBE_API_KEY;
    const video_url = await getVideoURL();

    await Promise.all(
        video_url.map(async (url) => {
            video_link.push(url.vd_id);
            let video_id;
            if (url.vd_id.includes("youtu.be")) {
                video_id = url.vd_id.split("/")[3].split("?")[0];
            } else {
                video_id = url.vd_id.split("=")[1];
            }
            const thumbnail_url = youtubeThumbnail(
                `https://www.youtube.com/watch?v=${video_id}`
            );
            thumbnail.push(thumbnail_url.medium.url);
            const title = await getTitle(video_id, apiKey);
            video_title.push(title);
        })
    );

    res.render("resources", {
        resources: resources_name,
        url: res_url,
        video_link: video_link,
        thumbnail: thumbnail,
        title: video_title,
    });
});

app.get("*/notifications", (req, res) => {
    res.render("notifications");
});

app.get("/*?*", (req, res) => {
    res.render("404");
});

export default app;
