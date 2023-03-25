"use client";

import { Inter } from "next/font/google";
import { default as cn_video } from "./videos";
import YouTube, { YouTubeProps } from "react-youtube";
import { createRef, useEffect, useRef, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

const LOCAL_STORAGE_KEY = "lastVideoWatch";

export default function Home() {
    const [videoIndex, setVideoIndex] = useState(50);
    const videoContainerRef = useRef(null);
    const refs = cn_video.reduce((acc, value) => {
        acc[value.id] = createRef();
        return acc;
    }, {});
    const [width, setWidth] = useState(600);

    const setCurrentVideo = (id) => {
        console.log(id);
        setVideoIndex(id);
        setLastVideoWatch(id);
        scrollTo(cn_video[id].id);
    };

    const scrollTo = (id) =>
        refs[id].current.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });

    const setLastVideoWatch = (index: number) => {
        localStorage.setItem(LOCAL_STORAGE_KEY, index.toString());
    };

    const getVideoID = () => {
        let video = cn_video[videoIndex];
        return video.i;
    };

    const onEnd: YouTubeProps["onEnd"] = (event) => {
        setCurrentVideo(videoIndex + 1);
    };

    useEffect(() => {
        let data = localStorage.getItem(LOCAL_STORAGE_KEY);
        setVideoIndex(parseInt(data || "100"));
        scrollTo(cn_video[videoIndex].id);
    }, [refs]);

    useEffect(() => {
        if (window && window.innerHeight) {
            setWidth(window.innerHeight);
        }
    }, []);

    return (
        <div className="flex flex-row">
            <div ref={videoContainerRef} className="basis-3/4">
                {videoContainerRef && (
                    <YouTube
                        videoId={getVideoID()}
                        opts={{
                            height: width,
                            width: "100%",
                            playerVars: {
                                autoplay: 1,
                            },
                        }}
                        onEnd={onEnd}
                    />
                )}
            </div>
            <div className="flex flex-col basis-1/4 w-full">
                <div className="w-full">
                    <div className="flex items-center justify-center py-2 font-bold border-b">
                        Casey Neight Watcher
                    </div>
                    <div className="border-b">
                        <div
                            className="w-full bg-blue-100"
                            style={{
                                height: 5,
                                width: `${Math.floor(
                                    (videoIndex * 100) / cn_video.length
                                )}%`,
                            }}
                        />
                    </div>
                </div>
                <div
                    className="overflow-y-scroll"
                    style={{
                        height: "calc(100vh - 80px)",
                    }}
                >
                    {cn_video.map((v, i) => {
                        return (
                            <div
                                className={`flex flex-row h-15 items-center gap-3 border-b cursor-pointer ${
                                    i === videoIndex ? "bg-blue-200" : ""
                                }`}
                                ref={refs[v.id]}
                                onClick={() => setCurrentVideo(i)}
                            >
                                <img
                                    src={`https://i.ytimg.com/vi/${v.i}/mqdefault.jpg`}
                                    width={"30%"}
                                />
                                <div className="flex grow flex-col items-start overflow-y-hidden">
                                    <p>{v.t}</p>
                                    <p>{v.id.split("-")[0]}</p>
                                </div>
                                <div className="pr-1">{i + 1}</div>
                            </div>
                        );
                    })}
                </div>
                <div className="py-1 border-t justify-center flex">
                    made by paul
                </div>
            </div>
        </div>
    );
}
