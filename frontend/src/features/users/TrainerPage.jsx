import { useNavigate } from "react-router-dom"; // Import useNavigate
import BottomNav from "../../common/BottomNav";
import { MobilePageHeader } from "../../common/MobilePageHeader";
import XMLUploader from "../xml/XMLUploader";
import { KeyComponent } from "./KeyComponent";

export function TrainerPage() {
  const navigate = useNavigate(); // Get the navigate function

  const handleViewUpcomingClasses = () => {
    navigate("/trainerBookingsList"); // Navigate to "/trainerBookingList" when clicked
  };

  return (
    <div className="bg-background-primary min-h-screen overflow-hidden pb-20">
      <main className="px-4">
        <MobilePageHeader pageTitle="Trainer" />

        {/* Button to view upcoming classes */}
        <button
          className="btn w-full bg-test py-2 px-4 rounded-lg shadow-md card m-auto md:w-96"
          onClick={handleViewUpcomingClasses}
        >
          View upcoming classes
        </button>
        <div className="m-auto md:w-96 ">
          <XMLUploader
            className=""
            label={"Classes"}
            uploadUrl={"/classes/upload-xml"}
          />
          <XMLUploader label={"Users"} uploadUrl={"/users/upload-xml"} />
        </div>
      </main>

      <KeyComponent />

      <BottomNav />
    </div>
  );
}

export default TrainerPage;
