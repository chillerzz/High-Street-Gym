import BottomNav from "../../common/BottomNav"
import { MobilePageHeader } from "../../common/MobilePageHeader"
import TrainerBookingListComponent from "./TrainerBookingListComponent.jsx"



export function TrainerBookingListPage() {

    // useEffect(() => {
    // }, [])

    return <>

        <div className="bg-background-primary min-h-screen overflow-hidden pb-20">
            <main className="px-4">

            <MobilePageHeader 
                pageTitle="Trainer Bookings">
            </MobilePageHeader>

            <TrainerBookingListComponent />
             
            </main>
            <BottomNav />
        </div>
    </>
}

export default TrainerBookingListPage