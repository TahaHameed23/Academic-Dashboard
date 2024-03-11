import { registerUser, authUser } from "../src/db.js";

export const auth = async (req, res, next) => {
    try {
        if (req.body.auth) {
            const response = await authUser(req.body);
            if (!response) {
                res.sendStatus(405);
            } else if (response === 201) res.sendStatus(201);
            else {
                res.sendStatus(202);
            }
        } else {
            const response = await registerUser(req.body);
            if (!response) {
                res.sendStatus(400);
            } else if (response === 201) res.sendStatus(201);
            else {
                res.sendStatus(203);
            }
        }
        next();
    } catch (e) {
        console.log(e);
    }
};
