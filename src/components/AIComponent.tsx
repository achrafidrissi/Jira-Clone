"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import axios from "axios";

export default function AIInterface() {
  const [clientInput, setClientInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await axios.post("http://192.168.97.15:5000/client-tools", {
        input: clientInput,
      });
      setResults(response.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Une erreur s'est produite.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key: string, value: any) => {
    setResults((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Outil AI pour les Clients</CardTitle>
          <p className="text-sm text-gray-500">
            Entrez vos besoins, et l'IA génèrera un budget estimé, des étapes techniques et des user stories.
          </p>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Décrivez vos besoins ici..."
            value={clientInput}
            onChange={(e) => setClientInput(e.target.value)}
            className="mb-4"
          />
          <Button onClick={handleGenerate} disabled={loading}>
            {loading ? "Génération en cours..." : "Générer"}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <div className="mt-4 text-red-500 text-center">
          <p>{error}</p>
        </div>
      )}

      {results && (
        <Tabs defaultValue="budget" className="mt-6">
          <TabsList>
            <TabsTrigger value="budget">Budget</TabsTrigger>
            <TabsTrigger value="technical_specs">Spécifications Techniques</TabsTrigger>
            <TabsTrigger value="user_stories">User Stories</TabsTrigger>
          </TabsList>

          <TabsContent value="budget">
            <Card>
              <CardHeader>
                <CardTitle>Budget Estimé</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={results.budget_estimate}
                  onChange={(e) => handleInputChange("budget_estimate", e.target.value)}
                  className="w-full"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="technical_specs">
            <Card>
              <CardHeader>
                <CardTitle>Spécifications Techniques</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={results.technical_specs.join("\n")}
                  onChange={(e) =>
                    handleInputChange("technical_specs", e.target.value.split("\n"))
                  }
                  className="w-full"
                  rows={8}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="user_stories">
            <Card>
              <CardHeader>
                <CardTitle>User Stories</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={results.user_stories.join("\n")}
                  onChange={(e) =>
                    handleInputChange("user_stories", e.target.value.split("\n"))
                  }
                  className="w-full"
                  rows={8}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
