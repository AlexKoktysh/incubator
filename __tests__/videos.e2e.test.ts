import { req } from "./test-helpers";
// import {setDB} from '../src/db/db'
// import {dataset1} from './datasets'
import { SETTINGS } from "../src/settings";

describe("/videos", () => {
    // beforeAll(async () => { // очистка базы данных перед началом тестирования
    //     setDB()
    // })

    it("should get empty array", async () => {
        // setDB() // очистка базы данных если нужно

        const res = await req.get(SETTINGS.PATH.VIDEOS).expect(200); // проверяем наличие эндпоинта

        console.log(res.body); // можно посмотреть ответ эндпоинта

        // expect(res.body.length).toBe(0) // проверяем ответ эндпоинта
    });
    it("should get not empty array", async () => {
        // setDB(dataset1) // заполнение базы данных начальными данными если нужно

        const res = await req.get(SETTINGS.PATH.VIDEOS).expect(200);

        console.log(res.body);

        // expect(res.body.length).toBe(1)
        // expect(res.body[0]).toEqual(dataset1.videos[0])
    });
});

// import request from "supertest";
// import express from "express";
// import {
//     getVideos,
//     createVideo,
//     findVideo,
//     updateVideo,
//     deleteVideo,
// } from "../src/videos/videosController";

// const app = express();

// app.use(express.json());

// app.get("/videos", getVideos);
// app.post("/videos", createVideo);
// app.get("/videos/:id", findVideo);
// app.put("/videos/:id", updateVideo);
// app.delete("/videos/:id", deleteVideo);

// describe("/videos", () => {
//     it("should have POST /videos endpoint", async () => {
//         const response = await request(app).post("/videos");
//         expect(response.status).not.toBe(404);
//     });

//     it("should have GET /videos/:id endpoint", async () => {
//         const response = await request(app).get("/videos/1");
//         expect(response.status).not.toBe(404);
//     });

//     it("should have PUT /videos/:id endpoint", async () => {
//         const response = await request(app).put("/videos/1");
//         expect(response.status).not.toBe(404);
//     });

//     it("should have DELETE /videos/:id endpoint", async () => {
//         const response = await request(app).delete("/videos/1");
//         expect(response.status).not.toBe(404);
//     });
// });
