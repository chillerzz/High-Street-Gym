import React, { useEffect, useState } from "react";
import { useAuthentication } from "../authentication";
import { MobilePageHeader } from "../../common/MobilePageHeader";
import BottomNav from "../../common/BottomNav";
import { getClassesbyDateAndActivityId } from "../../api/bookings";
import * as Booking from "../../api/bookings";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export function CreateBookingPage() {
    const navigate = useNavigate();
    const [user] = useAuthentication();
    const [classes, setClasses] = useState([]);
    const [selectedTime, setSelectedTime] = useState("");
    const [selectedTrainer, setSelectedTrainer] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [formData, setFormData] = useState({
        user_id: "",
        class_id: "",
        created_datetime: new Date(),
    });
    const [statusMessage, setStatusMessage] = useState("")

    const { date, id } = useParams();

    useEffect(() => {
        // Call the API function with the date and activity ID
        getClassesbyDateAndActivityId(date, id, user.authenticationKey)
            .then((classes) => {
                setClasses(classes);
            })
            .catch((error) => {
                console.error("Error fetching classes:", error);
            });
    }, [date, id, user]); // Ensure useEffect runs when date or activity_id changes

    const classesByTime = classes.reduce((acc, curr) => {
        acc[curr.time] = acc[curr.time] || [];
        acc[curr.time].push(curr);
        return acc;
    }, {});

    const availableTrainers = selectedTime ? classesByTime[selectedTime] : [];

    // Filter available locations based on selected trainer and time
    const availableLocations =
        selectedTrainer && selectedTime
            ? availableTrainers.filter(
                (trainer) =>
                    trainer.trainer_user_id === selectedTrainer.trainer_user_id &&
                    trainer.time === selectedTime
            )
            : [];

    // Disable the submit button if any of the select options are not selected
    const isButtonDisabled = !selectedTime || !selectedTrainer || !selectedLocation;

    async function handleFormSubmit(e) {
        try {
            e.preventDefault()
            setStatusMessage("Booking...")
            
            // Create the booking
            const bookingData = {
                booking: {
                    ...formData,
                    user_id: user.id,
                    class_id: selectedTrainer ? selectedTrainer.id : "",
                    created_datetime: new Date().toISOString().slice(0, 19).replace("T", " "), // Convert to MySQL datetime format
                },
            };
    
            const result = await Booking.create(bookingData, user.authenticationKey);
            setStatusMessage(result.message);

            // If the booking was successful, navigate to the user's bookings page
            if (result.status === 200) {
                toast.success("Booking created!");
                navigate("/bookingslist");
            } else {
                toast.error(result.message);
                if (result.message === "A matching booking has already been made") {
                    setStatusMessage(result.message);
                }
            }
        } catch (error) {
            console.log(error);
            setStatusMessage("A matching booking has already been made");
            toast.error("A matching booking has already been made");
        }
    }

    const handleClearForm = () => {
        setSelectedTime("");
        setSelectedTrainer(null);
        setSelectedLocation(null);
    };

    return (
        <div className="bg-background-primary min-h-screen overflow-hidden pb-20">
            <main className="px-4">
                <MobilePageHeader pageTitle="Create Booking" />
                <form onSubmit={handleFormSubmit}>
                    <div className="my-2 card w-full p-5 bg-base-100 shadow-xl m-auto md:w-96">
                        <h1 className="text-xl font-bold flex justify-center py-4">{classes[0]?.name}</h1>
                        <h3 className="text-lg font-semibold flex justify-center pb-4">
                            {classes[0]?.date && (
                                <>
                                    {new Date(classes[0]?.date).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        day: 'numeric',
                                        month: 'long',
                                    })}
                                </>
                            )}
                        </h3>
                        <div className="label">
                            <span className="label-text">Pick a time:</span>
                        </div>
                        <select
                            name="time"
                            id="time"
                            className="select select-bordered w-full"
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                        >
                            <option value="">Select a time</option>
                            {Object.keys(classesByTime).map((time) => (
                                <option key={time} value={time}>
                                    {time}
                                </option>
                            ))}
                        </select>

                        {selectedTime && (
                            <>
                                <div className="label">
                                    <span className="label-text">Pick a trainer:</span>
                                </div>
                                <select
                                    name="trainer_user_id"
                                    className="select select-bordered w-full"
                                    id="trainer"
                                    value={(selectedTrainer && selectedTrainer.trainer_user_id) || ""}
                                    onChange={(e) => {
                                        const selectedTrainerId = parseInt(e.target.value);
                                        setSelectedTrainer(
                                            availableTrainers.find(
                                                (trainer) =>
                                                    trainer.trainer_user_id == selectedTrainerId
                                            )
                                        );
                                    }}
                                >
                                    <option value="">Select a trainer</option>
                                    {availableTrainers.map((trainer) => (
                                        <option key={trainer.trainer_user_id} value={trainer.trainer_user_id}>
                                            {trainer.first_name} {trainer.last_name}
                                        </option>
                                    ))}
                                </select>
                            </>
                        )}

                        {selectedTrainer && selectedTime && (
                            <>
                                <div className="label">
                                    <span className="label-text">Pick a location:</span>
                                </div>
                                <select
                                    name="location"
                                    className="select select-bordered w-full"
                                    id="location"
                                    value={selectedLocation || ""}
                                    onChange={(e) => setSelectedLocation(e.target.value)}
                                >
                                    <option value="">Select a location</option>
                                    {availableLocations.map((location) => (
                                        <option key={location.location_id} value={location.location_id}>
                                            {location.location_name}
                                        </option>
                                    ))}
                                </select>
                            </>
                        )}

                        <div className="mt-4 flex justify-center">
                            <button type="submit" className="btn mx-2 bg-test" disabled={isButtonDisabled}>
                                Submit
                            </button>
                            <button type="button" className="btn btn-ghost border-test" onClick={handleClearForm}>
                                Clear
                            </button>
                        </div>
                        <span className="pt-4 label-text-alt">{statusMessage}</span>
                    </div>
                </form>
            </main>
            <BottomNav />
        </div>
    );
}

export default CreateBookingPage;
