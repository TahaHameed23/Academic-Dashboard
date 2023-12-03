import express from 'express';
import { registerUser, authUser, showStudents, getAttendance, updateAttendance, showDetails, updateDetails,showDetailsAdmin } from './src/db2.js';
import { putObject, getObjectURL } from './src/aws.js';
import path from 'node:path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';
import multer from 'multer';


const PORT = process.env.PORT || 4500;
const storage = multer.memoryStorage()
const upload = multer({ storage: storage });
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(morgan('dev'));
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.render("index")
})



app.get('/admin', async (req, res, next) => {
    const response = await showStudents();

    res.render("admin", { students: response })



})

app.post('/admin', async (req, res) => {

    if (req.headers.auth === "admin") {
        updateAttendance(req.body)
    }

    // const response = await showStudents();


})

app.post('/student/', upload.single("files"), async (req, res) => {

    try {
        await putObject(`image_${req.headers.email.split(".")[0]}_${Math.floor(new Date().getTime() / 1000) + 60 * 60}.jpeg`, req.file.buffer, req.file.mimetype);
        if (req.headers.haslocalimage !== "true") {
            const imageURL = await getObjectURL(`image_${req.headers.email.split(".")[0]}_${Math.floor(new Date().getTime() / 1000) + 60 * 60}`)
            res.send(JSON.stringify({ imageURL: imageURL }))
        }

    }
    catch (e) {
        console.log(e);

    }

})

app.get('/student', async (req, res) => {
    const attendance = await getAttendance(decodeURIComponent(req.query?.email));

    res.render('stud', { attendance: attendance });
});


app.post('/', async (req, res) => {

    try {
        if (req.body.auth) {
            const response = await authUser(req.body);
            if (!response) {
                res.sendStatus(405)
            }
            else if (response === 201)
                res.sendStatus(201)
            else {
                res.sendStatus(202)
            }
        }

        else {
            const response = await registerUser(req.body);
            if (!response) {
                res.sendStatus(400)
            }
            else if (response === 201)
                res.sendStatus(201)
            else {
                res.sendStatus(203)
            }
        }
    }
    catch (e) {
        console.log(e);
    }
})


app.get("/details", async (req, res) => {
    console.log(req.params);
    const response = await showDetails(req.query.email);
    res.render("info", { details: response })
})

app.post("/details", async (req, res) => {
    updateDetails(req.headers.email,req.body);
    res.sendStatus(200)
})

app.get('/admin/details/:id',async (req,res)=>{
    const response = await showDetailsAdmin(req.params.id);
    res.render("infoAdmin", { details: response })
})


app.listen(PORT, () => {
    console.log(`Server running on port http:localhost:${PORT}`);
})