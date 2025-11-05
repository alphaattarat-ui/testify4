// components/logic/useKnowledgeBases.ts

import { useState, useEffect } from "react";

// Define the shape of a knowledge base object from the API
export interface KnowledgeBase {
  id: string;
  name: string;
}

export const useKnowledgeBases = () => {
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKnowledgeBases = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch("/api/get-knowledge-bases");
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Something went wrong");
        }
        const data: KnowledgeBase[] = await response.json();
        setKnowledgeBases(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchKnowledgeBases();
  }, []);

  return { knowledgeBases, isLoading, error };
};