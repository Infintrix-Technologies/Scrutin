/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useParams } from "react-router-dom";
import NotFound from "./NotFound";
import { useGlobalState } from "@/utils/StateProvider";
import Forbidden from "./Forbidden";
import { useFrappePostCall } from "frappe-react-sdk";
import { CurrentQuestionOption } from "@/types/Interface";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const TestPage = () => {
  const { candidate_id } = useParams();
  const { question, selectedOption, setSelectedOption, error, loading, updateCurrentQuestion } = useGlobalState();
  const [snapshots, setSnapshots] = useState<Blob[]>([]);
  const [webcamError, setWebcamError] = useState<string | null>(null);
  const [localIp, setLocalIp] = useState<string>("");
  const [lastIp, setLastIp] = useState<string>("");
  const [inFullscreen, setInFullscreen] = useState(false);
  const [mouseInWindow, setMouseInWindow] = useState(true);
  const webcamRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [devToolsOpen, setDevToolsOpen] = useState(false);

  const test = question?.message?.test;
  const currentQuestion = test?.current_question;
  const isMultiChoice = currentQuestion?.type === "Multi Choice";

  const anti_cheating_checks = useFrappePostCall(
    "scrutin.api.anti_cheating.anti_cheating_checks"
  );

  const handleMultiSelectChange = (value: string) => {
    setSelectedOption((prev) => {
      if (Array.isArray(prev)) {
        return prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value];
      }
      return [value];
    });
  };

  // Update current question
  useEffect(() => {
    updateCurrentQuestion(candidate_id);
  }, [candidate_id]);

  // Get local IP address
  useEffect(() => {
    const getLocalIP = async () => {
      const ipRegex = /([0-9]{1,3}\.){3}[0-9]{1,3}/;
      const pc = new RTCPeerConnection({ iceServers: [] });
      pc.createDataChannel("");
      pc.createOffer().then((offer) => pc.setLocalDescription(offer));
      pc.onicecandidate = (ice) => {
        if (ice && ice.candidate && ice.candidate.candidate) {
          const ipMatch = ipRegex.exec(ice.candidate.candidate);
          if (ipMatch) {
            const currentIp = ipMatch[0];
            setLocalIp(currentIp);
            pc.onicecandidate = null;
          }
        }
      };
    };
    getLocalIP();
  }, []);

  // Anti cheating API Call
  useEffect(() => {
    const interval = setInterval(() => {
      const isIpSame = localIp === lastIp ? 1 : 0;
      anti_cheating_checks.call({
        candidate_id: candidate_id,
        ip_address: isIpSame,
        web_cam_always_enable: webcamError ? 0 : 1,
        full_screen_always_active: inFullscreen ? 1 : 0,
        mouse_always_in_test_window: mouseInWindow ? 1 : 0,
      });
      setLastIp(localIp);
    }, 30000);

    return () => clearInterval(interval);
  }, [localIp, webcamError, inFullscreen, mouseInWindow, candidate_id]);

  // Handle fullscreen mode change
  useEffect(() => {
    const checkFullscreen = () => {
      const isFullscreen = document.fullscreenElement !== null;
      setInFullscreen(isFullscreen);
    };
    document.addEventListener("fullscreenchange", checkFullscreen);
    return () => {
      document.removeEventListener("fullscreenchange", checkFullscreen);
    };
  }, []);

  // Handle mouse within window
  useEffect(() => {
    const handleMouseMove = () => setMouseInWindow(true);
    const handleMouseOut = () => setMouseInWindow(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  const startWebcam = async () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      streamRef.current = stream;
      if (webcamRef.current) {
        webcamRef.current.srcObject = stream;
      }
      setWebcamError(null);
    } catch (err) {
      console.error("Webcam error:", err);
      setWebcamError("Webcam not accessible");
    }
  };

  useEffect(() => {
    startWebcam();
    const interval = setInterval(takeSnapshot, 30000);
    return () => clearInterval(interval);
  }, []);

  const takeSnapshot = () => {
    if (webcamRef.current) {
      const video = webcamRef.current as HTMLVideoElement;
      const canvas = document.createElement("canvas");
      canvas.width = 600;
      canvas.height = 340;
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const fileName = `webcam-snapshot-${new Date().toISOString()}.jpeg`;
              localStorage.setItem("snapshot", JSON.stringify(blob));
              if (candidate_id) {
                sendSnapshotToBackend(blob, fileName, candidate_id);
              } else {
                console.error("candidate_id is undefined");
              }
            }
          },
          "image/jpeg",
          0.7
        );
      }
    }
  };

  const sendSnapshotToBackend = async (blob: Blob, fileName: string, candidate_id:string) => {
    const formData = new FormData();
    formData.append("file", blob, fileName);
    formData.append("is_private", "1");
    formData.append("folder", "Home");
    formData.append("doctype", "Scrutin Candidate");
    formData.append("docname", candidate_id);
    formData.append("fieldname", "image");

    try {
      const response = await fetch("/api/method/upload_file", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`Upload failed: ${errorData.message}`);
      } else {
        const data = await response.json();
        console.log("Upload successful:", data);
        // Clear localStorage after successful upload
        localStorage.removeItem("snapshot");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error logging in:", error.message);
      }
    }
  };

  // Function to enter fullscreen mode
  const enterFullscreen = () => {
    const element = document.documentElement as HTMLElement & {
      webkitRequestFullscreen?: () => Promise<void>;
      msRequestFullscreen?: () => Promise<void>;
    };

    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen(); // Safari (older versions)
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen(); // IE/Edge (older versions)
    }
  };

  useEffect(() => {
    enterFullscreen();
  }, []);

  // Fix the camera issue for start
  useEffect(() => {
    setTimeout(() => {
      if (webcamRef.current && webcamRef.current.readyState === 0) {
        startWebcam();
      }
    }, 1000);
  }, []);

  // Restart webcam when the question changes
  useEffect(() => {
    startWebcam();
  }, [currentQuestion]);

  // Disable right-click, F11, F12, Escape, and function keys
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const functionKeys = [
        "F1", "F2", "F3", "F4", "F5",
        "F6", "F7", "F8", "F9", "F10",
        "F11", "F12", "Escape"
      ];
      if (functionKeys.includes(event.key)) {
        event.preventDefault();
        alert("Function keys and Escape key are disabled during the test.");
      }
    };

    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
      // alert("Right-click is disabled during the test.");
    };

    const handleCopyPaste = (event: ClipboardEvent) => {
      event.preventDefault();
      // alert("Copy-paste is disabled during the test.");
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("copy", handleCopyPaste);
    window.addEventListener("paste", handleCopyPaste);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("copy", handleCopyPaste);
      window.removeEventListener("paste", handleCopyPaste);
    };
  }, []);

  // Detect if inspect is open or closed
  useEffect(() => {
    const detectInspect = () => {
      const threshold = 160; 
      const element = new Image();
      Object.defineProperty(element, 'id', {
        get: () => {
          setDevToolsOpen(true);
        }
      });
      console.dir(element);

      setInterval(() => {
        const widthDiff = window.outerWidth - window.innerWidth > threshold;
        const heightDiff = window.outerHeight - window.innerHeight > threshold;
        const isDevToolsOpen = widthDiff || heightDiff;

        if (isDevToolsOpen && !devToolsOpen) {
          setDevToolsOpen(true);
          alert('Developer tools are open, please close them to continue.');
        } else if (!isDevToolsOpen && devToolsOpen) {
          setDevToolsOpen(false);
          enterFullscreen();
        }
      }, 1000);
    };

    detectInspect();
  }, [devToolsOpen]);

  if (loading) return <p>Loading...</p>;
  if (error?.httpStatus === 403) return <Forbidden />;
  if (error?.httpStatus === 404) return <NotFound />;

  return (
    <div className="flex justify-center items-center h-auto">
      <div className="flex flex-col px-3">
        <div className="block md:flex md:justify-between">
          <h3 className="text-lg font-semibold m-2">
            Test Name: {test?.test?.title}
          </h3>
          <h3 className="text-lg font-semibold m-2">
            Type: {currentQuestion?.type}
          </h3>
        </div>

        <Card className="w-full max-w-full md:min-w-[750px] lg:min-w-[800px] mx-auto">
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-4 my-6">
              <div className="flex-1 p-4">
                <div
                  className="ql-editor read-mode [&_ol]:list-decimal [&_ul]:list-disc [&_li]:mb-2 [&_li]:ml-4"
                  dangerouslySetInnerHTML={{
                    __html: `Question: ${currentQuestion?.text}`,
                  }}
                ></div>
              </div>
              <div className="flex-1 py-5 px-10 space-y-3">
                <h3 className="text-lg font-semibold mb-2">Select Answer</h3>
                {isMultiChoice ? (
                  <div>
                    {currentQuestion.options.map(
                      (option: CurrentQuestionOption) => (
                        <div
                          key={option.value}
                          className="my-2 flex items-center space-x-2"
                        >
                          <Checkbox
                            id={option.value}
                            checked={
                              Array.isArray(selectedOption) &&
                              selectedOption.includes(option.value)
                            }
                            onCheckedChange={() =>
                              handleMultiSelectChange(option.value)
                            }
                          />
                          <Label htmlFor={option.value}>{option.label}</Label>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <RadioGroup
                    className="space-y-2"
                    name={`question-${currentQuestion?.name}`}
                    onValueChange={(value) => setSelectedOption(value)}
                    value={
                      Array.isArray(selectedOption)
                        ? selectedOption[0]
                        : selectedOption || ""
                    }
                  >
                    {currentQuestion?.options?.map(
                      (option: CurrentQuestionOption) => (
                        <div
                          key={option.value}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem
                            value={option.value}
                            id={option.value}
                          />
                          <Label htmlFor={option.value}>{option.label}</Label>
                        </div>
                      )
                    )}
                  </RadioGroup>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-2 mt-4">
          {snapshots.map((snapshot, index) => (
            <img
              key={index}
              src={URL.createObjectURL(snapshot)}
              alt={`Snapshot ${index}`}
              className="w-24 h-24 border"
            />
          ))}
        </div>
      </div>

      <div className="fixed bottom-2 left-2 border-2 w-[150px] h-[100px] overflow-hidden rounded-lg">
        <video
          ref={webcamRef}
          autoPlay
          muted
          className="w-full h-full object-cover"
        ></video>
      </div>
    </div>
  );
};

export default TestPage;