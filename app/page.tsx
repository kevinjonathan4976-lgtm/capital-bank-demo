"use client";

import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-96 bg-white shadow-xl rounded-xl p-8">
        <h1 className="text-3xl font-bold mb-6">
          JASON Beghe Bank
        </h1>

        <input
          className="w-full border p-3 rounded mb-4"
          placeholder="Username"
        />

        <input
          className="w-full border p-3 rounded mb-4"
          type="password"
          placeholder="Password"
        />

        <button
          className="w-full bg-blue-600 text-white p-3 rounded"
          onClick={() => router.push("/dashboard")}
        >
          Login
        </button>
      </div>
    </div>
  );
}
