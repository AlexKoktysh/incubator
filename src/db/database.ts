import { Collection, Db, MongoClient } from "mongodb";

import { secretsConfig, collectionsConfig, CollectionTypes } from "../config";

export const database = {
    client: {} as MongoClient,
    collections: {} as {
        [K in keyof typeof collectionsConfig]: Collection<CollectionTypes[K]>;
    },

    getDbName(): Db {
        return this.client.db(secretsConfig.DB_NAME);
    },
    async connectToDB({ url = secretsConfig.MONGO_URL }: { url?: string }) {
        try {
            this.client = new MongoClient(url);
            await this.client.connect();
            await this.getDbName().command({ ping: 1 });
            console.log("Connected to db");
        } catch (e) {
            console.log("Error to connect DB", e);
            await this.client.close();
        }
    },

    async getCollection<K extends keyof CollectionTypes>(
        key: K,
    ): Promise<Collection<CollectionTypes[K]>> {
        return this.getDbName().collection<CollectionTypes[K]>(
            collectionsConfig[key],
        );
    },

    async stop() {
        await this.client.close();
        console.log("Connection successful closed");
    },
    async drop() {
        try {
            const collections = await this.getDbName()
                .listCollections()
                .toArray();

            for (const collection of collections) {
                const collectionName = collection.name;
                await this.getDbName()
                    .collection(collectionName)
                    .deleteMany({});
            }
        } catch (e: unknown) {
            console.error("Error in drop db:", e);
            await this.stop();
        }
    },
};
