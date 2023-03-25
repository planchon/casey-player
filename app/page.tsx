"use client";

import { Inter } from "next/font/google";
import { default as cn_video } from "./videos";
import YouTube, { YouTubeProps } from "react-youtube";
import { createRef, useEffect, useRef, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

const WATCH_VIDEOS_LS = "watchVideos";

export default function Home() {
    const getLastVideos = () => {
        if (typeof window !== "undefined") return [];
        return JSON.parse(localStorage.getItem(WATCH_VIDEOS_LS));
    };

    const getlastVideoIndex = () => {
        const data = getLastVideos();
        if (!data) {
            return 0;
        }
        const video = data.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0];
        const index = cn_video.findIndex((v) => v.id === video.id);
        return index;
    };

    const [videoIndex, setVideoIndex] = useState(getlastVideoIndex());
    const [watchVideos, setWatchVideos] = useState(getLastVideos() || []);
    const videoContainerRef = useRef(null);

    const [width, setWidth] = useState(600);

    const refs = cn_video.reduce((acc, value) => {
        acc[value.id] = createRef();
        return acc;
    }, {});

    const setCurrentVideo = (id) => {
        setVideoIndex(id);
        setLastVideoWatch(cn_video[id].id);
        scrollTo(cn_video[id].id);
    };

    const scrollTo = (id) =>
        refs[id].current.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });

    const setLastVideoWatch = (videoId: string) => {
        let data = getLastVideos() || [
            { id: cn_video[0].id, date: new Date() },
        ];
        data = [...data, { id: videoId, date: new Date() }];
        localStorage.setItem(WATCH_VIDEOS_LS, JSON.stringify(data));
        setWatchVideos(data);
    };

    const getVideoID = () => {
        let video = cn_video[videoIndex];
        return video.i;
    };

    const onEnd: YouTubeProps["onEnd"] = (event) => {
        setCurrentVideo(videoIndex + 1);
    };

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
                        const videoId = cn_video[i].id;
                        const videoWasWatched =
                            watchVideos.find((v) => v.id === videoId) !=
                            undefined;
                        return (
                            <div
                                className={`flex flex-row h-15 items-center gap-3 border-b cursor-pointer ${
                                    i === videoIndex
                                        ? "bg-blue-300"
                                        : videoWasWatched
                                        ? "bg-blue-100"
                                        : ""
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
