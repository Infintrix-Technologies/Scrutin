import { createBrowserRouter, Navigate } from "react-router-dom";

import Login from "@/pages/auth/Login";
import Assessments from "@/pages/Assessments";
import Candidates from "@/pages/Candidates";
import Jobs from "@/pages/Jobs";
import MainLayout from "./layouts/MainLayout";
import JobDetailPage from "./pages/JobDetailPage";
import PostJob from "./pages/PostJob";
// import AssessmentDetail from "./pages/AssessmentDetail";
import AdminLayout from "./layouts/AdminLayout";
import PublicLayout from "./layouts/PublicLayout";
import AssessmentOverview from "./pages/AssessmentOverview";
import Setup from "./pages/Setup";
import TestPage from "./pages/TestPage";
import NotFound from "./pages/NotFound";
import Intro from "./pages/Intro";
import ApiTestPage from "./pages/ApiTestPage";
import CandidateDetail from "./pages/ScrutinCandidate";
import CandidatacyLayout from "./layouts/CandidatacyLayout";
import CandidateLayout from "./layouts/CandidateLayout";
import CandidateDashboard from "./pages/TestAPI";
import JobApplicants from "./pages/JobApplicants";
import AssessmentDashboard from "./pages/CandidatesDetailPage";
import AssessmentDetailPage from "./pages/AssessmentDetailPage";
import TestAPI from "./pages/TestAPI";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <MainLayout />,
      errorElement : <NotFound/>,
      // loader: rootLoader,
      children: [
        {
          path: "auth",
          element: <PublicLayout />,
          children: [
            {
              path: "login",
              element: <Login />,
            }
          ],
        },
        {
          path: "",
          element: <Navigate to={`assessments`} />,
        },
        {
          path: "assessments",
          element: <AdminLayout />,
          children: [
            {
              path: "",
              element: <Assessments />,
            },
            {
              path: ":assessment_id",
              element: <AssessmentDetailPage />,
            },
            
          ],
        },
        {
          path: "candidates",
          element: <AdminLayout />,
          children: [
            {
              path: "",
              element: <Candidates />,
            },
            {
              path: ":email",
              element: <AssessmentDashboard />,
            },
          ],
        },
        {
          path: "jobs",
          element: <AdminLayout />,
          children: [
            {
              path: "",
              element: <Jobs />,
            },
            {
              path: "detail",
              element: <JobDetailPage />,
            },
            {
              path: "post",
              element: <PostJob />,
            },
          ],
        },
        {
          path: "applicants",
          element: <AdminLayout />,
          children: [
            {
              path: "",
              element: <JobApplicants />,
            },
          ],
        },
        {
          path: "testapi",
          element: <CandidateLayout />,
          children : [
            {
              path: "",
              element: <TestAPI />,
            },
          ]
        },
        {
          path: "assessment-dashboard",
          element: <AssessmentDashboard />,
          children : [
            {
              path: "",
              element: <CandidateDashboard />,
            },
          ]
        },
        // {
        //   path: "candidate-assessment-dashboard",
        //   element: <CandidateAssessmentDashboard />,
        //   children : [
        //     {
        //       path: "",
        //       element: <CandidateDashboard />,
        //     },
        //   ]
        // },
        {
          path: "candidacy",
          element: <CandidatacyLayout />,
          children : [
            {
              path: ":candidate_id",
              element: <ApiTestPage />,
              // element: <Navigate to={`/assessments`} />,
            },
            {
              path: "candidate_detail",
              element: <CandidateDetail />,
            },
            {
              path: ":assessment_id/intro",
              element: <Intro />,
            },
            {
              path: ":assessment_id/overview",
              element: <AssessmentOverview />,
            },
            {
              path: ":assessment_id/setup",
              element: <Setup />,
            },
            {
              path: ":assessment_id/test/:test_id",
              element: <TestPage />,
              
            },
          ]
        }
        
      ],

      
    },
  ],
  {
    basename: `/${import.meta.env.VITE_BASE_NAME}`,
  }
);
