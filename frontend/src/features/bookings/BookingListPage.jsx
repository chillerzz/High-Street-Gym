import BottomNav from "../../common/BottomNav"
import { MobilePageHeader } from "../../common/MobilePageHeader"
import BookingComponent from "./BookingComponent"


export function BookingListPage() {

    return <>
        <div className="bg-background-primary min-h-screen overflow-hidden pb-20">
            <main className="px-4">

            <MobilePageHeader 
                pageTitle="Bookings">
            </MobilePageHeader>

            <BookingComponent />
             
            </main>
            <BottomNav />
        </div>
    </>
}

export default BookingListPage