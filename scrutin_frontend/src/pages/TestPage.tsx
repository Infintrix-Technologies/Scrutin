/* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable react-hooks/exhaustive-deps */
// import { useEffect } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Label } from "@/components/ui/label";
// import { CurrentQuestionOption } from "@/types/Interface";
// import {  useParams } from "react-router-dom";
// import NotFound from "./NotFound";
// import { useGlobalState } from "@/utils/StateProvider";
// import Forbidden from "./Forbidden";

// const TestPage = () => {
//   const { candidate_id } = useParams();
//   const { question, selectedOption, setSelectedOption, error, loading,updateCurrentQuestion } = useGlobalState();
//   console.log(question,"question")
//   useEffect(() => {
//     updateCurrentQuestion(candidate_id);
//   }, [candidate_id]);

//   const handleMultiSelectChange = (value: string) => {
//     setSelectedOption((prev) => {
//       if (Array.isArray(prev)) {
//         return prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value];
//       }
//       return [value];
//     });
//   };

//   if (loading) return <p>Loading...</p>;
//   if (error?.httpStatus === 403) return <Forbidden />;
//   if (error?.httpStatus === 404) return <NotFound />;

//   const test = question?.message?.test;
//   const currentQuestion = test?.current_question;
//   const isMultiChoice = currentQuestion?.type === "Multi Choice";

//   return (
//     <div className="flex justify-center items-center h-auto">
//       <div className="flex flex-col px-3">
//         <div className="block md:flex md:justify-between">
//           <h3 className="text-lg font-semibold m-2">Test Name: {test?.test?.title}</h3>
//           <h3 className="text-lg font-semibold m-2">Type: {currentQuestion?.type}</h3>
//         </div>
//         <Card className="w-full max-w-full md:min-w-[750px] lg:min-w-[800px] mx-auto">
//           <CardContent className="space-y-6">
//             <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-4 my-6">
//               <div className="flex-1 p-4">
//                 <div
//                   className="ql-editor read-mode [&_ol]:list-decimal [&_ul]:list-disc [&_li]:mb-2 [&_li]:ml-4"
//                   dangerouslySetInnerHTML={{
//                     __html: `Question: ${currentQuestion?.text}`,
//                   }}
//                 ></div>
//               </div>
//               <div className="flex-1 py-5 px-10 space-y-3">
//                 <h3 className="text-lg font-semibold mb-2">Select Answer</h3>
//                 {isMultiChoice ? (
//                   <div>
//                     {currentQuestion.options.map((option: CurrentQuestionOption) => (
//                       <div key={option.value} className="my-2 flex items-center space-x-2">
//                         <Checkbox
//                           id={option.value}
//                           checked={Array.isArray(selectedOption) && selectedOption.includes(option.value)}
//                           onCheckedChange={() => handleMultiSelectChange(option.value)}
//                         />
//                         <Label htmlFor={option.value}>{option.label}</Label>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <RadioGroup
//                     className="space-y-2"
//                     name={`question-${currentQuestion?.name}`}
//                     onValueChange={(value) => setSelectedOption(value)}
//                     value={Array.isArray(selectedOption) ? selectedOption[0] : selectedOption || ""}
//                   >
//                     {currentQuestion?.options?.map((option: CurrentQuestionOption) => (
//                       <div key={option.value} className="flex items-center space-x-2">
//                         <RadioGroupItem value={option.value} id={option.value} />
//                         <Label htmlFor={option.value}>{option.label}</Label>
//                       </div>
//                     ))}
//                   </RadioGroup>
//                 )}
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default TestPage;




// import { useEffect, useRef, useState } from "react";
// import Webcam from "react-webcam";
// import { Card, CardContent } from "@/components/ui/card";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Label } from "@/components/ui/label";
// import { CurrentQuestionOption } from "@/types/Interface";
// import { useParams } from "react-router-dom";
// import NotFound from "./NotFound";
// import { useGlobalState } from "@/utils/StateProvider";
// import Forbidden from "./Forbidden";

// const TestPage = () => {
//   const { candidate_id } = useParams();
//   const { question, selectedOption, setSelectedOption, error, loading, updateCurrentQuestion } = useGlobalState();
//   const [capturedImage, setCapturedImage] = useState<Blob | null>(null); 
//   const webcamRef = useRef<Webcam>(null);

//   useEffect(() => {
//     updateCurrentQuestion(candidate_id);
//   }, [candidate_id]);

   
//    const base64ToBlob = (base64: string) => {
//     const byteCharacters = atob(base64.split(',')[1]); 
//     const byteArrays = [];

//     for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
//       const slice = byteCharacters.slice(offset, offset + 1024);
//       const byteNumbers = new Array(slice.length);
//       for (let i = 0; i < slice.length; i++) {
//         byteNumbers[i] = slice.charCodeAt(i);
//       }
//       byteArrays.push(new Uint8Array(byteNumbers));
//     }

//     return new Blob(byteArrays, { type: "image/jpeg" }); 
//   };

//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (webcamRef.current) {
//         const imageSrc = webcamRef.current.getScreenshot();
//         if (imageSrc) {
//           // console.log("Base64 Captured Image:", imageSrc);
          
//           const imageBlob = base64ToBlob(imageSrc);
//           console.log("Captured Image as Binary (Blob):", imageBlob);
//           setCapturedImage(imageBlob);
//         } else {
//           console.error("Failed to capture screenshot.");
//         }
//       } else {
//         console.error("Webcam reference is not initialized.");
//       }
//     }, 5000);

//     return () => clearInterval(interval); 
//   }, []);
  

//   const handleMultiSelectChange = (value: string) => {
//     setSelectedOption((prev) => {
//       if (Array.isArray(prev)) {
//         return prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value];
//       }
//       return [value];
//     });
//   };

//   if (loading) return <p>Loading...</p>;
//   if (error?.httpStatus === 403) return <Forbidden />;
//   if (error?.httpStatus === 404) return <NotFound />;

//   const test = question?.message?.test;
//   const currentQuestion = test?.current_question;
//   const isMultiChoice = currentQuestion?.type === "Multi Choice";

//   return (
//     <div className="flex justify-center items-center h-auto">
//       <div className="flex flex-col px-3">
//         <div className="block md:flex md:justify-between">
//           <h3 className="text-lg font-semibold m-2">Test Name: {test?.test?.title}</h3>
//           <h3 className="text-lg font-semibold m-2">Type: {currentQuestion?.type}</h3>
//         </div>
//         <Card className="w-full max-w-full md:min-w-[750px] lg:min-w-[800px] mx-auto">
//           <CardContent className="space-y-6">
//             <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-4 my-6">
//               <div className="flex-1 p-4">
//                 <div
//                   className="ql-editor read-mode [&_ol]:list-decimal [&_ul]:list-disc [&_li]:mb-2 [&_li]:ml-4"
//                   dangerouslySetInnerHTML={{
//                     __html: `Question: ${currentQuestion?.text}`,
//                   }}
//                 ></div>
//               </div>
//               <div className="flex-1 py-5 px-10 space-y-3">
//                 <h3 className="text-lg font-semibold mb-2">Select Answer</h3>
//                 {isMultiChoice ? (
//                   <div>
//                     {currentQuestion.options.map((option: CurrentQuestionOption) => (
//                       <div key={option.value} className="my-2 flex items-center space-x-2">
//                         <Checkbox
//                           id={option.value}
//                           checked={Array.isArray(selectedOption) && selectedOption.includes(option.value)}
//                           onCheckedChange={() => handleMultiSelectChange(option.value)}
//                         />
//                         <Label htmlFor={option.value}>{option.label}</Label>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <RadioGroup
//                     className="space-y-2"
//                     name={`question-${currentQuestion?.name}`}
//                     onValueChange={(value) => setSelectedOption(value)}
//                     value={Array.isArray(selectedOption) ? selectedOption[0] : selectedOption || ""}
//                   >
//                     {currentQuestion?.options?.map((option: CurrentQuestionOption) => (
//                       <div key={option.value} className="flex items-center space-x-2">
//                         <RadioGroupItem value={option.value} id={option.value} />
//                         <Label htmlFor={option.value}>{option.label}</Label>
//                       </div>
//                     ))}
//                   </RadioGroup>
//                 )}
//               </div>
//             </div>
//             <div className="flex flex-col justify-center items-center h-auto">
//            <Card className="w-full max-w-full md:min-w-[750px] lg:min-w-[800px] mx-auto">
//             <CardContent className="space-y-6">
//           <div className="my-6">
//             <h3 className="text-lg font-semibold mb-2">Live Camera Feed</h3>
//             <div className="flex flex-col items-center space-y-4">
//               <Webcam
//                 ref={webcamRef}
//                 audio={false}
//                 screenshotFormat="image/jpeg"
//                 videoConstraints={{
//                   facingMode: "user", 
//                 }}
//                 className="border rounded-md w-64 h-48"
//               />
//             </div>
//           </div>

//           <div className="my-6">
//             <h3 className="text-lg font-semibold mb-2">Captured Image Preview</h3>
//             <div className="flex flex-col items-center space-y-4">
//               {capturedImage ? (
//                 <img
//                   src={URL.createObjectURL(capturedImage)} 
//                   alt="Captured"
//                   className="border rounded-md w-64 h-48"
//                 />
//               ) : (
//                 <p>No image captured yet. Please wait...</p>
//               )}
//             </div>
//           </div>
//             </CardContent>
//            </Card>
//           </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default TestPage;





// /* eslint-disable react-hooks/exhaustive-deps */
// import { useEffect, useState, useRef } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { useParams } from "react-router-dom";
// import NotFound from "./NotFound";
// import { useGlobalState } from "@/utils/StateProvider";
// import Forbidden from "./Forbidden";

// const MAX_SNAPSHOTS = 10; // Limit the number of snapshots to prevent storage issues

// const TestPage = () => {
//   const { candidate_id } = useParams();
//   const { question, error, loading, updateCurrentQuestion } = useGlobalState();
//   const [snapshots, setSnapshots] = useState<string[]>([]);
//   const [webcamError, setWebcamError] = useState<string | null>(null);
//   const webcamRef = useRef<HTMLVideoElement | null>(null);

//   // Initialize webcam in the background
//   const startWebcam = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//       if (webcamRef.current) {
//         webcamRef.current.srcObject = stream;
//       }
//       setWebcamError(null);
//     } catch (err) {
//       console.error("Webcam error:", err);
//       setWebcamError("Webcam not accessible");
//     }
//   };

//   // Take a snapshot from the webcam
//   const takeSnapshot = () => {
//     if (webcamRef.current) {
//       const video = webcamRef.current as HTMLVideoElement;
//       const canvas = document.createElement("canvas");
//       canvas.width = 320; // Resize canvas to reduce data size
//       canvas.height = 240;
//       const context = canvas.getContext("2d");
//       if (context) {
//         context.drawImage(video, 0, 0, canvas.width, canvas.height);
//         const snapshot = canvas.toDataURL("image/jpeg", 0.7); // Compress to JPEG
//         setSnapshots((prev) => {
//           const updated = [snapshot, ...prev.slice(0, MAX_SNAPSHOTS - 1)];
//           localStorage.setItem("snapshots", JSON.stringify(updated));
//           return updated;
//         });
//       }
//     }
//   };

//   // Load snapshots from localStorage
//   useEffect(() => {
//     const savedSnapshots = localStorage.getItem("snapshots");
//     if (savedSnapshots) {
//       setSnapshots(JSON.parse(savedSnapshots));
//     }
//   }, []);

//   // Take snapshots at regular intervals
//   useEffect(() => {
//     startWebcam();
//     const interval = setInterval(takeSnapshot, 60000); // Every 60 seconds
//     return () => clearInterval(interval);
//   }, []);

//   // Fetch question data
//   useEffect(() => {
//     updateCurrentQuestion(candidate_id);
//   }, [candidate_id]);

//   if (loading) return <p>Loading...</p>;
//   if (error?.httpStatus === 403) return <Forbidden />;
//   if (error?.httpStatus === 404) return <NotFound />;

//   const test = question?.message?.test;
//   const currentQuestion = test?.current_question;

//   return (
//     <div className="flex justify-center items-center h-auto">
//       <div className="flex flex-col px-3">
//         <div className="block md:flex md:justify-between">
//           <h3 className="text-lg font-semibold m-2">Test Name: {test?.test?.title}</h3>
//           <h3 className="text-lg font-semibold m-2">Type: {currentQuestion?.type}</h3>
//         </div>
//         <Card className="w-full max-w-full md:min-w-[750px] lg:min-w-[800px] mx-auto">
//           <CardContent className="space-y-6">
//             <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-4 my-6">
//               <div className="flex-1 p-4">
//                 <div
//                   className="ql-editor read-mode [&_ol]:list-decimal [&_ul]:list-disc [&_li]:mb-2 [&_li]:ml-4"
//                   dangerouslySetInnerHTML={{
//                     __html: `Question: ${currentQuestion?.text}`,
//                   }}
//                 ></div>
//               </div>
//             </div>
//             <div>
//               {/* Hidden video element for the webcam */}
//               <video ref={webcamRef} autoPlay muted style={{ display: "none" }}></video>
//               <p>{webcamError}</p>
//             </div>
//             <div className="flex flex-wrap gap-2 mt-4">
//               {/* Display snapshots */}
//               {snapshots.map((snapshot, index) => (
//                 <img key={index} src={snapshot} alt={`Snapshot ${index}`} className="w-24 h-24 border" />
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default TestPage;


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

const MAX_SNAPSHOTS = 10;

const TestPage = () => {
  const { candidate_id } = useParams();
  const { question, selectedOption, setSelectedOption, error, loading,updateCurrentQuestion } = useGlobalState();
  const [snapshots, setSnapshots] = useState<Blob[]>([]); 
  const [webcamError, setWebcamError] = useState<string | null>(null);
  const [localIp, setLocalIp] = useState<string>('');
  const [lastIp, setLastIp] = useState<string>(''); 
  const [inFullscreen, setInFullscreen] = useState(false);
  const [mouseInWindow, setMouseInWindow] = useState(true);
  const webcamRef = useRef<HTMLVideoElement | null>(null);

  const test = question?.message?.test;
  const currentQuestion = test?.current_question;
  const isMultiChoice = currentQuestion?.type === "Multi Choice";



  const anti_cheating_checks = useFrappePostCall("scrutin.api.anti_cheating.anti_cheating_checks");

    const handleMultiSelectChange = (value: string) => {
    setSelectedOption((prev) => {
      if (Array.isArray(prev)) {
        return prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value];
      }
      return [value];
    });
  };

  //Update current question
  useEffect(() => {
    updateCurrentQuestion(candidate_id);
  }, [candidate_id]);

  // for get local ip address
  useEffect(() => {
    const getLocalIP = async () => {
      const ipRegex = /([0-9]{1,3}\.){3}[0-9]{1,3}/;
      const pc = new RTCPeerConnection({ iceServers: [] });
      pc.createDataChannel('');
      pc.createOffer().then((offer) => pc.setLocalDescription(offer));
      pc.onicecandidate = (ice) => {
        if (ice && ice.candidate && ice.candidate.candidate) {
          const ipMatch = ipRegex.exec(ice.candidate.candidate);
          console.log(ipMatch, "getLocalIP")
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

  // Update IP comparison in payload handling
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
    }, 10000);  

    return () => clearInterval(interval);
  }, [localIp, webcamError, inFullscreen, mouseInWindow, candidate_id]);

  // Handle fullscreen mode change
  useEffect(() => {
    const checkFullscreen = () => {
      const isFullscreen = document.fullscreenElement !== null;
      setInFullscreen(isFullscreen);
      console.log(isFullscreen,"isFullscreen")
    };
    document.addEventListener('fullscreenchange', checkFullscreen);
    return () => {
      document.removeEventListener('fullscreenchange', checkFullscreen);
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
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" }, 
      });
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
    const interval = setInterval(takeSnapshot, 10000); 
    return () => clearInterval(interval);
  }, []);

  const takeSnapshot = () => {
    if (webcamRef.current) {
      const video = webcamRef.current as HTMLVideoElement;
      const canvas = document.createElement("canvas");
      canvas.width = 320; 
      canvas.height = 240;
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            console.log(blob,"blobblob")
            setSnapshots((prev) => {
              const updated = [blob, ...prev.slice(0, MAX_SNAPSHOTS - 1)];
              localStorage.setItem("snapshots", JSON.stringify(updated));
              return updated;
            });
          }
        }, "image/jpeg", 0.7); 
      }
    }
  };

  useEffect(() => {
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
  
    enterFullscreen();
  }, []);
  
  
  // useEffect(() => {
  //   const disableRightClick = (event: MouseEvent) => {
  //     event.preventDefault();
  //   };
  //   document.addEventListener("contextmenu", disableRightClick);
  
  //   return () => {
  //     document.removeEventListener("contextmenu", disableRightClick);
  //   };
  // }, []);
  

  if (loading) return <p>Loading...</p>;
  if (error?.httpStatus === 403) return <Forbidden />;
  if (error?.httpStatus === 404) return <NotFound />;


  return (
    <div className="flex justify-center items-center h-auto">
      <div className="flex flex-col px-3">
        <div className="block md:flex md:justify-between">
          <h3 className="text-lg font-semibold m-2">Test Name: {test?.test?.title}</h3>
          <h3 className="text-lg font-semibold m-2">Type: {currentQuestion?.type}</h3>
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
                    {currentQuestion.options.map((option: CurrentQuestionOption) => (
                      <div key={option.value} className="my-2 flex items-center space-x-2">
                        <Checkbox
                          id={option.value}
                          checked={Array.isArray(selectedOption) && selectedOption.includes(option.value)}
                          onCheckedChange={() => handleMultiSelectChange(option.value)}
                        />
                        <Label htmlFor={option.value}>{option.label}</Label>
                      </div>
                    ))}
                  </div>
                 ) : (
                  <RadioGroup
                    className="space-y-2"
                    name={`question-${currentQuestion?.name}`}
                    onValueChange={(value) => setSelectedOption(value)}
                    value={Array.isArray(selectedOption) ? selectedOption[0] : selectedOption || ""}
                  >
                    {currentQuestion?.options?.map((option: CurrentQuestionOption) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value}>{option.label}</Label>
                      </div>
                    ))}
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

      <div className="fixed bottom-2 left-2 border-2 border-black w-[150px] h-[100px] overflow-hidden rounded-lg bg-black">
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
