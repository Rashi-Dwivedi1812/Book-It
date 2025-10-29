"use client";

import { useEffect, useState } from "react";
import ExperienceDetailsClient from "@/app/components/ExperienceDetailsClient";
import { IExperienceDetails } from "@/app/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function DetailsPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [experience, setExperience] = useState<IExperienceDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetails() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/experiences/${id}`);
        if (!res.ok) throw new Error("Failed to fetch details");
        const data = await res.json();
        setExperience(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <main className="container mx-auto p-4">
        <p className="text-gray-600">Loading...</p>
      </main>
    );
  }

  if (!experience) {
    return (
      <main className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">Experience not found.</h1>
      </main>
    );
  }

  return <ExperienceDetailsClient experience={experience} />;
}