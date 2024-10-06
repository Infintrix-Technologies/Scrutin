/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MoreVertical, Video, ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Setup() {
  // const [videoHeight] = useState(100);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Function to get the stream of the selected camera
  const startCamera = async (deviceId?: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: deviceId ? { exact: deviceId } : undefined },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraError(null); // Clear any error message
    } catch (error) {
      setCameraError(
        "Unable to access the camera. Please check your settings."
      );
    }
  };

  // Get the list of available cameras
  const getCameras = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      setCameras(videoDevices);
      if (videoDevices.length > 0 && !selectedCamera) {
        setSelectedCamera(videoDevices[0].deviceId); // Set the default camera to the first available
        startCamera(videoDevices[0].deviceId); // Start the default camera
      }
    } catch (error) {
      setCameraError("Unable to retrieve camera devices.");
    }
  };

  // Initialize camera on component mount
  useEffect(() => {
    getCameras();
  }, []);

  // Handle camera change
  const handleCameraChange = (deviceId: string) => {
    setSelectedCamera(deviceId);
    startCamera(deviceId);
  };

  return (
    <div>
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-1/2">
            <CardHeader className="px-0 pt-0">
              <CardTitle>Camera setup</CardTitle>
            </CardHeader>
            <Separator className="my-4" />
            <p className="mb-4">
              We use camera images to ensure fairness for everyone. Make sure
              that you are in front of your camera.
            </p>
            <Separator className="my-4" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                <strong>Camera:</strong>
              </div>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {cameras.map((camera) => (
                      <DropdownMenuItem
                        key={camera.deviceId}
                        onClick={() => handleCameraChange(camera.deviceId)}
                      >
                        {camera.label || `Camera ${camera.deviceId}`}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div>
            <span className="text-sm">
                  {cameras.length > 0
                    ? cameras.find((cam) => cam.deviceId === selectedCamera)
                        ?.label
                    : "No camera available"}
                </span>
            </div>
          </div>
         
          <div className="lg:w-1/2">
            <video
              id="video"
              ref={videoRef}
              playsInline
              autoPlay
              muted
              className="w-full rounded-lg"
              style={{ height: "max-content" }}
            />
            {cameraError && (
              <p className="text-red-600 text-sm mt-2">{cameraError}</p>
            )}
            <div className="mt-4">
              <h3 className="font-bold mb-2">Trouble with your webcam?</h3>
              <ul className="list-disc pl-3  space-y-2 text-sm">
                <li>
                  Ensure you have granted permission for your browser to access
                  your camera.
                </li>
                <li>
                  Ensure you are using a{" "}
                  <a
                    href="https://candidates.testgorilla.com/hc/en-us/articles/19091812295323-Tools-for-taking-an-assessment"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-blue-600 hover:underline"
                  >
                    supported browser
                  </a>
                  .
                </li>
                <li>
                  If you have multiple camera devices, ensure you have given
                  your browser and our website permission to use the right
                  device.
                </li>
                <li>
                  Try launching the assessment in incognito mode or in a private
                  window.
                </li>
                <li>
                  Ensure your camera drivers and web browser are up to date.
                </li>
                <li>
                  Restart your device and try accessing the assessment again
                  using the link in the invitation email.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button>
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>

    </div>
  );
}
