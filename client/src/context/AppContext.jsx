import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth, useUser } from "@clerk/clerk-react";

export const AppContext = createContext();

export const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { user } = useUser();
    const { getToken } = useAuth();

    const [searchFilter, setSearchFilter] = useState({ title: '', location: '' });
    const [isSearched, setIsSearched] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);
    const [companyToken, setCompanyToken] = useState(localStorage.getItem("companyToken") || null);
    const [companyData, setCompanyData] = useState(null);
    const [userData, setUserData] = useState(null);
    const [userApplications, setUserApplications] = useState([]);

    // Fetch Jobs
    const fetchJobs = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/jobs`);
            if (data.success) {
                setJobs(data.jobs);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Fetch Company Data
    const fetchCompanyData = async () => {
        if (!companyToken) return;
        try {
            const { data } = await axios.get(`${backendUrl}/api/company/company`, {
                headers: { token: companyToken },
            });
            if (data.success) {
                setCompanyData(data.company);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Fetch User Data
    const fetchUserData = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get(`${backendUrl}/api/users/user`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (data.success) {
                setUserData(data.user);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Fetch User Applications
    const fetchUserApplications = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get(`${backendUrl}/api/users/applications`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (data.success) {
                setUserApplications(data.applications);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // 👇 Fetch jobs + recruiter/user data on mount or changes
    useEffect(() => {
        fetchJobs();

        if (user) {
            fetchUserData();
            fetchUserApplications();
        }

        // 🤖 When company logs in or token exists
        if (companyToken) {
            fetchCompanyData();
        }

    }, [user, companyToken]);

    // ✅ Save token to localStorage when changed
    useEffect(() => {
        if (companyToken) {
            localStorage.setItem("companyToken", companyToken);
        }
    }, [companyToken]);

    return (
        <AppContext.Provider value={{
            backendUrl,                // ✅ Make sure this is available!
            jobs,
            isSearched,
            setIsSearched,
            searchFilter,
            setSearchFilter,
            companyData,
            setCompanyData,           // ✅ Optional but useful
            companyToken,
            setCompanyToken,
            userData,
            userApplications,
            showRecruiterLogin,
            setShowRecruiterLogin,
        }}>
            {props.children}
        </AppContext.Provider>
    );
};
