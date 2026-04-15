"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { useEffect } from "react";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.name}</p>
    </div>
  );
}
