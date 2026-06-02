"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DeleteArticlePage({ params }: { params: { id: string } }) {
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/articles/${params.id}`, { method: "DELETE" })
      .then(() => {
        router.push("/admin");
        router.refresh();
      });
  }, [params.id, router]);

  return (
    <div className="flex items-center justify-center py-32 text-gray-400">
      Deleting article…
    </div>
  );
}
