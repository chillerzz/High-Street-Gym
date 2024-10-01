import { useState, useEffect } from "react"
import * as Bookings from "../../api/bookings"
import { useAuthentication } from "../authentication"
import { toast } from "react-toastify";

export default function BookingComponent() {
    const [user] = useAuthentication()
    const [bookings, setBookings] = useState([])

    useEffect(() => {
        if (user && user.id) {
            // Fetch bookings for the current user
            Bookings.getByUserId(user.id, user.authenticationKey)
                .then(allBookings => {
                    // Format dates in each booking
                    const formattedBookings = allBookings.map(booking => ({
                        ...booking,
                        date: formatDate(booking.date),
                        time: formatTime(booking.time) // Format time as 24-hour time
                    }));
                    setBookings(formattedBookings);
                })
                .catch(error => {
                    console.error("Error fetching bookings:", error);
                });
        }
    }, [user]); // Include user in dependencies to trigger re-fetch when user changes

    // Function to format date as "Friday 24 April"
    function formatDate(dateString) {
        const options = { weekday: 'long', day: 'numeric', month: 'long' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-AU', options);
    }

    // Function to format time as 24-hour time
    function formatTime(timeString) {
        const date = new Date(`2000-01-01T${timeString}`);
        return date.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' });
    }

    function handleCancelBooking(bookingId) {
        const authenticationKey = user.authenticationKey
        Bookings.deleteById(bookingId, authenticationKey)
            .then((result) => {
                toast.success("Booking deleted successfully!");
                // You can also add a refresh or update the bookings list here
            })
            .catch((error) => {
                toast.error("Error deleting booking: " + error.message);
            });
    }
    
    
    return (
        <>
            {bookings.map(eachBooking => (
                <div key={eachBooking.booking_id} className="my-2 card w-full p-5 bg-base-100 shadow-xl md:w-96 m-auto">
                    <form>
                        <div>
                            <h1 className="p-2 text-xl font-semibold flex justify-center">{eachBooking.activity_name}</h1>
                            <p className="flex justify-center"><strong className="px-2">Date: </strong> {eachBooking.date}</p>
                            <p className="flex justify-center"><strong className="px-2">Time: </strong> {eachBooking.time}</p>                            
                            <p className="flex justify-center"><strong className="px-2">Location: </strong> {eachBooking.location_name}</p>                            
                            <p className="flex justify-center"><strong className="px-2">Trainer: </strong> {eachBooking.first_name}</p>
                            <button
                                className="btn mt-3 w-full text-error text-xs cursor-pointer"
                                onClick={() => handleCancelBooking(eachBooking.booking_id)}
                            >
                                Cancel Booking
                            </button>
                        </div>
                    </form>
                </div>
            ))}
        </>
    )
}
