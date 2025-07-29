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


useEffect(() => {
  console.log("Validating token...");
  dispatch(validateAccessTokenThunk())
    .then((action) => {
      if (validateAccessTokenThunk.fulfilled.match(action)) {
        console.log("Token doğrulandı:", action.payload);
      } else {
        console.warn("Token doğrulanamadı:", action.payload);
      }
    });
}, [dispatch]);

  const handleLogout = () => {
    dispatch(logoutThunk())
  }

  if (!user) {
    return <AuthForm />
  }

  return <DashboardLayout user={user} onLogout={handleLogout} />
}
