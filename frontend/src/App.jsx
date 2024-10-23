import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Chatbot from "./pages/Chatbot";
import Redirect from "./Redirect";
import StaggeredDropDown from "./components/chatbot/StaggeredDropDown";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Booking from "./pages/Booking";
import "./App.css";
import { AbcOutlined } from "@mui/icons-material";

function App() {
  const token = localStorage.getItem("token");

  const isNavBarOpen = useSelector((state) => state.ui.isNavBarOpen);

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <ToastContainer
            position="top-center"
            autoClose={1500}
            limit={2}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover={false}
            theme="light"
          />
          <NavBar />
          {!isNavBarOpen && (
            <>
              <Outlet />
              {token && (
                <div className="fixed bottom-12 right-36">
                  <StaggeredDropDown />
                </div>
              )}
              <Footer />
            </>
          )}
        </>
      ),
      children: [
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/adminlogin",
          element: <Login />,
        },
        {
          path: "/home",
          element: <Home />,
        },
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/aboutus",
          element: <AbcOutlined />,
        },
        {
          path: "/chatbot",
          element: <Chatbot />,
        },
        {
          path: "/booking",
          element: <Booking />,
        },
      ],
    },
  ]);

  return (
    <AnimatePresence>
      <div className="h-full w-full bg-[#E6E6FA]">
        <RouterProvider router={router} />
      </div>
    </AnimatePresence>
  );
}

export default App;
