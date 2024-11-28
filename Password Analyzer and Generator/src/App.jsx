import { useState, useCallback } from "react";

function App() {
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [generatedStrength, setGeneratedStrength] = useState("Weak");
  const [userStrength, setUserStrength] = useState("Weak");

  // Evaluate strength of a password
  const evaluateStrength = useCallback((pass) => {
    let score = 0;

    if (pass.length >= 8) score++; // Length criterion
    if (/[A-Z]/.test(pass)) score++; // Contains uppercase
    if (/[a-z]/.test(pass)) score++; // Contains lowercase
    if (/[0-9]/.test(pass)) score++; // Contains numbers
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pass)) score++; // Contains special chars

    if (score <= 2) return "Weak";
    if (score === 3) return "Medium";
    return "Strong";
  }, []);

  // Generate a secure password
  const generatePassword = useCallback(() => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    let pass = "";
    for (let i = 0; i < 12; i++) {
      const index = Math.floor(Math.random() * chars.length);
      pass += chars[index];
    }
    setGeneratedPassword(pass);
    setGeneratedStrength(evaluateStrength(pass));
  }, [evaluateStrength]);

  // Update strength for user-entered password
  const handleUserPasswordChange = (e) => {
    const value = e.target.value;
    setUserPassword(value);
    setUserStrength(evaluateStrength(value));
  };

  return (
    <div className="h-screen w-full flex justify-center items-center bg-gray-800 text-white flex-col">
      <h1 className="text-3xl mb-6">Password Strength Analyzer</h1>

      {/* Generated Password Section */}
      <div className="mb-8">
        <button
          className="bg-blue-500 px-4 py-2 rounded-md"
          onClick={generatePassword}
        >
          Generate Password
        </button>
        <div className="mt-4">
          <p>
            <strong>Generated Password:</strong> {generatedPassword}
          </p>
          <p>
            <strong>Strength:</strong>{" "}
            <span
              className={`${
                generatedStrength === "Strong"
                  ? "text-green-500"
                  : generatedStrength === "Medium"
                  ? "text-yellow-500"
                  : "text-red-500"
              }`}
            >
              {generatedStrength}
            </span>
          </p>
          <div
            className={`h-2 w-full max-w-xs rounded-md ${
              generatedStrength === "Strong"
                ? "bg-green-500"
                : generatedStrength === "Medium"
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
          ></div>
        </div>
      </div>

      {/* User Password Section */}
      <div className="w-full max-w-xs">
        <label className="block mb-2">Enter Your Password:</label>
        <input
          type="text"
          value={userPassword}
          onChange={handleUserPasswordChange}
          className="w-full p-2 mb-4 rounded-md text-gray-800"
        />
        <p>
          <strong>Strength:</strong>{" "}
          <span
            className={`${
              userStrength === "Strong"
                ? "text-green-500"
                : userStrength === "Medium"
                ? "text-yellow-500"
                : "text-red-500"
            }`}
          >
            {userStrength}
          </span>
        </p>
        <div
          className={`h-2 w-full rounded-md ${
            userStrength === "Strong"
              ? "bg-green-500"
              : userStrength === "Medium"
              ? "bg-yellow-500"
              : "bg-red-500"
          }`}
        ></div>
      </div>
    </div>
  );
}

export default App;
