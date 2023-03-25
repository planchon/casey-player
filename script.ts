// @ts-nocheck
const video: any[] = require("./app/data.json");
const fs = require("fs");

let finalData = [];

for (const [key, dayVideos] of Object.entries(video)) {
    dayVideos.forEach((v, i) => {
        finalData.push({
            ...v,
            id: `${key}-${i}`,
        });
    });
}

fs.writeFileSync("./app/videos.json", JSON.stringify(finalData));
