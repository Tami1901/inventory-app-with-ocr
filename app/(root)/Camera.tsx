"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createWorker } from "tesseract.js";
import ReactWebcam from "react-webcam";
import Script from "next/script";
import { isDev } from "~/lib";

import { CV } from "@techstark/opencv-js";
import { Button } from "~/components/Button";

export const CameraThingWrapper: React.FC<{
  allProductCodes: { id: number; name: string; code: string }[];
  select: React.Dispatch<
    React.SetStateAction<{ id: number; name: string; code: string } | null>
  >;
}> = ({ allProductCodes, select }) => {
  const { data: worker } = useQuery(
    ["worker"],
    async () => {
      const worker = await createWorker({});

      await worker.loadLanguage("eng");
      await worker.initialize("eng");

      return worker;
    },
    {
      staleTime: Infinity,
    }
  );

  const ref = useRef<ReactWebcam>(null);
  const [showProcessedCanvas, setShowProcessedCanvas] = useState(false);

  const { data } = useQuery(
    ["process"],
    async () => {
      const canvas = ref.current?.getCanvas();

      let src = cv.imread(canvas!);
      let dst1 = new cv.Mat();
      let dst2 = new cv.Mat();
      cv.cvtColor(src, dst1, cv.COLOR_BGR2GRAY);
      cv.threshold(dst1, dst2, 160, 255, cv.THRESH_BINARY);

      cv.imshow("canvasOutput", dst2);
      src.delete();
      dst1.delete();
      dst2.delete();

      if (!worker) {
        return null;
      }

      const resp = await worker.recognize(
        document.querySelector("#canvasOutput") as HTMLCanvasElement
      );

      return resp?.data?.words
        .map((v) => ({ ...v, lower: v.text.toLocaleLowerCase("hr") }))
        .filter((v) => v.lower.match(/^[\w-/\.\,\+\č\ć\đ\š\ž]*$/))
        .map((v) => allProductCodes.find(({ code }) => code === v.lower))
        .filter((v): v is { id: number; name: string; code: string } => !!v);
    },
    { refetchInterval: 1000 }
  );

  useEffect(() => {
    if (!data) {
      return;
    }

    if (data.length === 1) {
      select(data[0]);
    }
  }, [data, select]);

  return (
    <div>
      <Button size="sm" onClick={() => setShowProcessedCanvas((v) => !v)}>
        {showProcessedCanvas
          ? "Hide processed canvas"
          : "Show processed canvas"}
      </Button>

      {showProcessedCanvas &&
        data?.map((v) => (
          <div key={v.id}>
            {v.name} - {v.code}
          </div>
        ))}

      <canvas
        id="canvasOutput"
        width="400"
        height="400"
        style={{ display: showProcessedCanvas ? "block" : "none" }}
      />

      <ReactWebcam
        ref={ref}
        videoConstraints={{
          facingMode: "environment",
          aspectRatio: isDev ? 2 : 0.5,
        }}
      />

      <Script
        src=" https://docs.opencv.org/master/opencv.js"
        type="text/javascript"
        onLoad={() => {
          console.log("openCV loaded");
        }}
      />
    </div>
  );
};
