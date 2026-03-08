import { useEffect } from "react";

function App() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/health");
        const result = await response.json();
        console.log(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-4xl font-bold text-blue-600">Pulse</h1>
    </div>
  );
}

export default App;
