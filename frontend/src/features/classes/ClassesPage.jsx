import { useEffect, useState } from "react";
import { displayAllUniqueClassesForWeek } from "../../api/classes";
import { MobilePageHeader } from "../../common/MobilePageHeader";
import BottomNav from "../../common/BottomNav";
import { useNavigate } from "react-router-dom";
import { useAuthentication } from "../authentication"


const formatDateString = (date) => {
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    return date.toLocaleDateString('en-AU', options);
};

const ClassesPage = () => {

    const [user] = useAuthentication()
    const navigate = useNavigate();
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true); // Add loading state
    const currentDate = new Date();

    useEffect(() => {
        const getWeekDates = (date) => {
            const currentDay = date.getDay();
            const firstDayOfWeek = new Date(date);
            firstDayOfWeek.setDate(firstDayOfWeek.getDate() - currentDay + 1);
            const lastDayOfWeek = new Date(firstDayOfWeek);
            lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);
            return [firstDayOfWeek, lastDayOfWeek];
        };

        const [weekStartDate, weekEndDate] = getWeekDates(new Date());

        const fetchClassesForWeek = async () => {
            if (!user || !user.authenticationKey) {
                // User not authenticated or authentication key not available
                // Set loading to false to display content
                setLoading(false);
                return;
            }
            
            // Proceed with fetching classes
            try {
                const classesData = await displayAllUniqueClassesForWeek(
                    weekStartDate.toISOString().split('T')[0],
                    weekEndDate.toISOString().split('T')[0],
                    user.authenticationKey
                );
    
                const formattedClasses = Object.entries(classesData).reduce((acc, [date, classes]) => {
                    const formattedDate = new Date(date);
                    const existingDateIndex = acc.findIndex(item => item.date.getTime() === formattedDate.getTime());
    
                    if (existingDateIndex !== -1) {
                        acc[existingDateIndex].classes.push(...classes);
                    } else {
                        acc.push({ date: formattedDate, classes: [...classes] });
                    }
    
                    return acc;
                }, []);
    
                setClasses(formattedClasses);
                setLoading(false); // Set loading to false when classes are fetched
            } catch (error) {
                console.error('Error fetching classes:', error);
                setLoading(false); // Set loading to false even on error
            }
        };
    
        fetchClassesForWeek();
    }, [user]); // Dependency array remains the same

    function handleOnSubmit(date, activity_id) {
        navigate(`/bookings/${date}/${activity_id}`);
    }

    // Render loading state if loading
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="bg-background-primary min-h-screen overflow-hidden pb-20">
            <main className="px-4">
                <MobilePageHeader pageTitle="Classes" />
                <div>
                    <div>
                        {classes.map(({ date, classes }) => (
                            <div className="my-2 card w-full p-5 bg-base-100 shadow-xl m-auto md:w-96" key={date.toISOString()}>
                                <h1 className="p-2 text-xl font-semibold flex justify-center">
                                    {formatDateString(date)}
                                </h1>
                                {classes.map((classItem, classIndex) => {
                                    const classDate = new Date(date);
                                    const isPastDate = classDate < currentDate;
                                    return (
                                        <div key={`${classItem.id}-${classIndex}`}>
                                            <div className="flex justify-between items-center p-2">
                                                <span className="text-lg">{classItem.name}</span>
                                                <button className={`btn bg-test ${isPastDate ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={() => handleOnSubmit(date.toLocaleDateString('en-CA'), classItem.activity_id)} disabled={isPastDate}>Book</button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <BottomNav />
        </div>
    );
};

export default ClassesPage;
