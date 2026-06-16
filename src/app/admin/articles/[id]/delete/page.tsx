"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DeleteArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  useEffect(() => {
    fetch(`/api/articles/${id}`, { method: "DELETE" })
      .then(() => {
        router.push("/admin");
        router.refresh();
      });
  }, [id, router]);

  return (
    <div className="flex items-center justify-center py-32 text-gray-400">
      Deleting article…
    </div>
  );
}
