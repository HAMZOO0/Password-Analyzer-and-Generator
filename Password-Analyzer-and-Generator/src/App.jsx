import { useState, useCallback } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
  const [userPassword, setUserPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("Weak");
  const [attackChances, setAttackChances] = useState({
    bruteForce: 0,
    dictionary: 0,
    rainbowTable: 0,
  });

  // Evaluate password strength
  const evaluateStrength = useCallback((pass) => {
    let score = 0;

    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pass)) score++;

    if (score <= 2) return "Weak";
    if (score === 3) return "Medium";
    return "Strong";
  }, []);

  // Generate attack probabilities
  const calculateAttackChances = useCallback((pass) => {
    const length = pass.length;
    const hasUppercase = /[A-Z]/.test(pass);
    const hasNumbers = /[0-9]/.test(pass);

    return {
      bruteForce: length < 8 ? 70 : 20,
      dictionary: !hasUppercase ? 60 : 10,
      rainbowTable: hasNumbers ? 50 : 0,
    };
  }, []);

  // Handle password input change
  const handlePasswordChange = (e) => {
    const pass = e.target.value;
    setUserPassword(pass);

    if (pass) {
      setPasswordStrength(evaluateStrength(pass));
      setAttackChances(calculateAttackChances(pass));
    } else {
      setPasswordStrength("Weak");
      setAttackChances({ bruteForce: 0, dictionary: 0, rainbowTable: 0 });
    }
  };

  // Generate random password
  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*(),.?\":{}|<>";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars[Math.floor(Math.random() * chars.length)];
    }
    setUserPassword(password);
    setPasswordStrength(evaluateStrength(password));
    setAttackChances(calculateAttackChances(password));
  };

  // Pie chart data
  const chartData = {
    labels: ["Brute Force", "Dictionary", "Rainbow Table"],
    datasets: [
      {
        label: "Attack Chances (%)",
        data: [
          attackChances.bruteForce,
          attackChances.dictionary,
          attackChances.rainbowTable,
        ],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className="h-screen w-full flex flex-col items-center bg-gray-900 text-white p-6">
      <h1 className="text-3xl mb-6">Password Strength & Attack Analyzer</h1>

      <div className="text-center mb-8">
        <input
          type="password"
          placeholder="Enter your password"
          className="w-80 p-3 rounded-md border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={userPassword}
          onChange={handlePasswordChange}
        />
        <div className="mt-4 flex justify-center gap-4">
          <button
            onClick={generatePassword}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 focus:outline-none"
          >
            Generate Password
          </button>
        </div>
        <div className="mt-4">
          <p>
            <strong>Strength:</strong>{" "}
            <span
              className={`${
                passwordStrength === "Strong"
                  ? "text-green-500"
                  : passwordStrength === "Medium"
                  ? "text-yellow-500"
                  : "text-red-500"
              }`}
            >
              {passwordStrength}
            </span>
          </p>
        </div>
      </div>

      <div className="max-w-lg w-full">
        <h2 className="text-xl mb-4 text-center">Attack Probabilities</h2>
        <div className="bg-white p-4 rounded-md shadow-md">
          <Pie data={chartData} />
          {Object.values(attackChances).every((chance) => chance === 0) && (
            <p className="text-red-500 text-center mt-4">No chance of attack detected.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
