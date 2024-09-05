import { app } from "./app";
import { secretsConfig } from "./config";
import { database } from "./db";

const start = async () => {
    await database.connectToDB({});

    app.listen(secretsConfig.PORT, () => {
        console.log("...server started in port " + secretsConfig.PORT);
    });
};

start();
