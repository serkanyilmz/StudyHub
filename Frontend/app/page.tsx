"use client"
import { useEffect, useState } from "react"
import { AuthForm } from "@/shared/components/auth/auth-form"
import { DashboardLayout } from "@/shared/components/layout/dashboard-layout"
import { useDispatch, useSelector } from "react-redux"
import { logoutAction, logoutThunk, validateAccessTokenThunk } from "@/redux/slice/authSlice"
import { AppDispatch } from "@/redux/store/store"

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user?.currentUser )


 const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true); 
    const validate = async () => {
      const result = await dispatch(validateAccessTokenThunk());
      setLoading(false); 
    };

    validate();
  }, [dispatch]);


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
      </div>
    );
  }


  const handleLogout = () => {
    dispatch(logoutThunk())
  }

  if (!user) {
    return <AuthForm />
  }

  return <DashboardLayout user={user} onLogout={handleLogout} />
}
