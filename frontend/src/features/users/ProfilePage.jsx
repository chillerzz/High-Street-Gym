import { useEffect, useState } from "react";
import { useAuthentication } from "../authentication";
import { MobilePageHeader } from "../../common/MobilePageHeader";
import BottomNav from "../../common/BottomNav";
import { update } from "../../api/users";
import { useNavigate } from "react-router-dom";

export function ProfilePage() {
    const navigate = useNavigate();

    const [user, login, logout, refresh] = useAuthentication();
    const [initialFormData, setInitialFormData] = useState({});
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        address: "",
        phone: "",
        password: ""
    });
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        if (user) {
            setInitialFormData(user);
            setFormData({
                first_name: user.first_name || "",
                last_name: user.last_name || "",
                address: user.address || "",
                phone: user.phone || "",
                password: user.password || ""
            });
        }
    }, [user]);
        

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
        setIsDirty(true);
    };

    const handleCancelChanges = () => {
        setFormData(initialFormData);
        setIsDirty(false);
    };

    const handleSaveChanges = () => {
        const authenticationKey = user.authenticationKey
        update(formData, user, authenticationKey)
            .then((updatedUser) => {
                setInitialFormData(updatedUser);
                setFormData({
                    first_name: updatedUser.first_name || "",
                    last_name: updatedUser.last_name || "",
                    address: updatedUser.address || "",
                    phone: updatedUser.phone || "",
                    password: ""
                });
                setIsDirty(false);
            })
            .catch((error) => {
                console.error("Error updating user:", error);
            });
            refresh()
    };

    const isSaveDisabled = !isDirty;

    return (
        <div className="bg-background-primary min-h-screen overflow-hidden pb-20">
            <main className="px-4">
                <MobilePageHeader pageTitle="Profile" />
                {user ? (
                    <div className="card w-full bg-base-100 shadow-xl md:w-96 m-auto">
                        <form className="p-5">
                            <h3 className="text text-2xl font-semibold flex justify-center">
                                Welcome, {user.first_name}
                            </h3>
                            <div className="avatar flex justify-center p-3">
                                <div className="w-20 rounded-full">
                                    <img src="avatar-icon.jpg" />
                                </div>
                            </div>
                            <label htmlFor="first_name" className="label-text text-xs">
                                First Name
                            </label>
                            <input
                                type="text text-xs"
                                id="first_name"
                                name="first_name"
                                className="input input-bordered flex w-full mb-2 "
                                value={formData.first_name}
                                onChange={handleInputChange}
                            />
                            <label htmlFor="last_name" className="label-text text-xs">
                                Last Name
                            </label>
                            <input
                                type="text text-xs"
                                id="last_name"
                                name="last_name"
                                className="input input-bordered flex w-full mb-2"
                                value={formData.last_name}
                                onChange={handleInputChange}
                            />
                            <label htmlFor="address" className="label-text text-xs">
                                Address
                            </label>
                            <input
                                type="text text-xs"
                                id="address"
                                name="address"
                                className="input input-bordered flex w-full mb-2"
                                value={formData.address}
                                onChange={handleInputChange}
                            />
                            <label htmlFor="phone" className="label-text text-xs">
                                Phone
                            </label>
                            <input
                                type="text text-xs"
                                id="phone"
                                name="phone"
                                className="input input-bordered flex w-full mb-2"
                                value={formData.phone}
                                onChange={handleInputChange}
                            />
                            <label htmlFor="password" className="label-text text-xs">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="input input-bordered flex w-full mb-2"
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                            <div className=" flex justify-center gap-2">
                                <button
                                    className="btn bg-test"
                                    onClick={handleSaveChanges}
                                    disabled={isSaveDisabled}
                                >
                                    Save
                                </button>
                                <button
                                    className="btn btn-ghost border-test"
                                    onClick={handleCancelChanges}
                                >
                                    Cancel
                                </button>
                            </div>
                            <button
                                className="btn btn-ghost"
                                onClick={() => logout().finally(() => navigate("/"))}
                            >
                                Logout
                            </button>
                        </form>
                    </div>
                ) : (
                    <span>Loading...</span>
                )}
            </main>
            <BottomNav />
        </div>
    );
}

export default ProfilePage;
