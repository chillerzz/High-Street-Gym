import { useState, useEffect } from "react";
import * as Activities from "../../api/activities";
import * as Locations from "../../api/locations";
import * as Users from "../../api/users";
import { useAuthentication } from "../authentication";

export function KeyComponent() {
    const [user, login, logout, refresh] = useAuthentication();
    const [key, setKey] = useState([]);
    const [activities, setActivities] = useState([]);
    const [locations, setLocations] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (user && user.authenticationKey) {
            Activities.getAllActivites().then(async activities => {
                setActivities(activities);
            });
            Locations.getAllLocations().then(async locations => {
                setLocations(locations);
            });
            Users.getAllUsers(user.authenticationKey).then(async users => {
                setUsers(users);
            });
        }
    }, [user]);

    return (
        <>
            <div className="mx-4 card p-5 bg-base-100 shadow-xl sm:m-auto md:w-96">
                <h1 className="text-xl flex justify-center font-bold">Database Key:</h1>
                <h2 className="text-lg font-semibold pt-2">Locations:</h2>
                <ul>
                    {locations.map(location => (
                        <li key={location.id}>
                            {location.id} - {location.name}
                        </li>
                    ))}
                </ul>
                <h2 className="text-lg font-semibold pt-2">Activities:</h2>
                <ul>
                    {activities.map(activity => (
                        <li key={activity.id}>
                            {activity.id} - {activity.name}
                        </li>
                    ))}
                </ul>
                <h2 className="text-lg font-semibold pt-2">Users:</h2>
                <ul>
                    {users.map(user => (
                        <li key={user.id}>
                            {user.id} - {user.first_name} {user.last_name}
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}
