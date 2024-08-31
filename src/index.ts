import { app } from "./app";
import { connectToDB } from "./db/mongo-db";
import { SETTINGS } from "./settings";

const start = async () => {
    if (!(await connectToDB())) {
        console.log("No BD connected");
        process.exit(1);
    }

    app.listen(SETTINGS.PORT, () => {
        console.log("...server started in port " + SETTINGS.PORT);
    });
};

start();
