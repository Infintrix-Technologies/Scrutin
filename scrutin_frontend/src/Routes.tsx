import { createBrowserRouter, Navigate } from "react-router-dom";

import Login from "@/pages/auth/Login";
import Jobs from "@/pages/Jobs";
import MainLayout from "./layouts/MainLayout";
import JobDetailPage from "./pages/JobDetailPage";
import PostJob from "./pages/PostJob";
import AdminLayout from "./layouts/AdminLayout";
import PublicLayout from "./layouts/PublicLayout";
import AssessmentOverview from "./pages/AssessmentOverview";
import Setup from "./pages/Setup";
import TestPage from "./pages/TestPage";
import NotFound from "./pages/NotFound";
import Intro from "./pages/Intro";
import CandidatacyLayout from "./layouts/CandidatacyLayout";
import CandidateLayout from "./layouts/CandidateLayout";
import JobApplicants from "./pages/JobApplicants";
import CandidateDetailPage from "./pages/CandidatesDetailPage";
import AssessmentDetailPage from "./pages/AssessmentDetailPage";
import TestAPI from "./pages/TestAPI";
import CandidatesComparisonPage from "./pages/CandidatesComparisonPage";
import { CandidatesList } from "./components/CandidatesList";
import AssessmentsList from "./pages/AssessmentsList";
import HrAdminReports from "./pages/HrAdminReports";
import TestsList from "./pages/TestsList";

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
              element: <AssessmentsList />,
            },
            {
              path: ":assessment_id",
              element: <AssessmentDetailPage />,
            },
            {
              path: "generate",
              element: <>Generate Assessment</>,
            },
            
          ],
        },
        {
          path: "tests",
          element: <AdminLayout />,
          children: [
            {
              path: "",
              element: <TestsList />,
            },
            {
              path: "test_id",
              element: <>Test Detail Page</>,
            },
            {
              path: "generate",
              element: <>Generate test</>,
            },
            
          ],
        },
         {
          path: "questions",
          element: <AdminLayout />,
          children: [
            {
              path: "",
              element: <>show questions here </>,
            }
            
          ],
        },
        {
          path: "admin_reports",
          element: <AdminLayout />,
          children: [
            {
              path: "",
              element: <HrAdminReports />,
            },
          ],
        },
        {
          path: "candidates",
          element: <AdminLayout />,
          children: [
            {
              path: "",
              element: <CandidatesList />,
            },
            {
              path: ":email",
              element: <CandidateDetailPage />,
            },
            {
              path:"comparison/:candidate_id_1/:candidate_id_2" ,
              element: <CandidatesComparisonPage />,
            },
                  
          ],
        },
        //This Show the Jobs Page 
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
          path: "candidacy",
          element: <CandidatacyLayout />,
          children : [
          
            {
              path: ":candidate_id",
              element: <Navigate to="intro" />, 
            },
            {
              path: ":candidate_id/intro",
              element: <Intro />,
            },
            {
              path: ":candidate_id/overview",
              element: <AssessmentOverview />,
            },
            {
              path: ":candidate_id/setup",
              element: <Setup />,
            },
            {
              path: ":candidate_id/test/",
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
