import * as dotenv from "dotenv";
dotenv.config();
import app from "./server.js";

const PORT = process.env.PORT || 4500;

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});
