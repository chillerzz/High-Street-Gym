import { createBrowserRouter } from "react-router-dom"
import LoginPage from "./features/users/LoginPage"
import RegisterPage from "./features/users/RegisterPage"
import ClassesPage from "./features/classes/ClassesPage"
import BlogPage from "./features/blogs/BlogPage"
import ProfilePage from "./features/users/ProfilePage"
import BookingListPage from "./features/bookings/BookingListPage"
import CreateBookingPage from "./features/bookings/CreateBookingPage"
import TrainerPage from "./features/users/TrainerPage"
import TrainerBookingListPage from "./features/bookings/TrainerBookingListPage"

const router = createBrowserRouter([
    {
        path: "/",
        element: <LoginPage />
    },
    {
        path: "/register",
        element: <RegisterPage />
    },
    {
        path: "/classes",
        element: <ClassesPage />
    },
    {
        path: '/bookings/:date/:id',
        element: <CreateBookingPage />
        ,
      },
    {
        path: "/bookingslist",
        element: <BookingListPage />
    },
    {
        path: "/trainerbookingslist",
        element: <TrainerBookingListPage />
    },
    {
        path: "/blog",
        element: <BlogPage />
    },
    {
        path: "/profile",
        element: <ProfilePage />
    },
    {
        path: "/trainer",
        element: <TrainerPage /> 
    }

])

export default router