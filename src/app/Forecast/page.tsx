"use client";

import { Line } from "react-chartjs-2";
import { Card, CardContent } from "@/components/ui/card";

const ForecastChart = () => {
  // Données statiques de prévision AWS Forecast
  const forecastData = {
    labels: ["2024-02-01", "2024-02-02", "2024-02-03", "2024-02-04", "2024-02-05"],
    datasets: [
      {
        label: "Estimation du temps (jours)",
        data: [10, 15, 12, 18, 20],
        borderColor: "rgb(75, 192, 192)",
        tension: 0.4,
      },
    ],
  };

  return (
    <Card className="w-full max-w-3xl p-6 shadow-lg">
      <CardContent>
        <h2 className="text-xl font-bold mb-4">Prédictions AWS Forecast</h2>
        <Line data={forecastData} />
      </CardContent>
    </Card>
  );
};

export default ForecastChart;
