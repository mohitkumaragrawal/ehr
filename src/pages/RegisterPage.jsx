import { useState, useEffect } from "react";
import { Button } from "@nextui-org/react";
import Container from "../components/Container";

import { registerUser } from "../utils";
import { useSmartContracts } from "../SmartContractProvider";

const RegisterPage = () => {
  const [role, setRole] = useState("");

  const smartContractContext = useSmartContracts();
  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handleSubmit = async () => {
    // Here you would typically handle the form submission
    console.log("Submitting with role:", role);
    try {
      await registerUser(role, smartContractContext);
      alert("Successfully registered user");
    } catch (error) {
      console.log(error);
      alert("Error registering user");
    }
  };

  return (
    <Container>
      <div className="p-8 w-full max-w-md">
        <h2 className="text-2xl mb-6 text-center">Register</h2>
        <select
          className="w-full p-3 mb-6 text-white bg-gray-800 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          value={role}
          onChange={handleRoleChange}
        >
          <option value="" disabled>
            Select Role
          </option>
          <option value="User">User</option>
          <option value="CareProvider">Care Provider</option>
          <option value="Miner">Miner</option>
          <option value="Researcher">Researcher</option>
        </select>
        <Button
          color="primary"
          auto
          className="w-full"
          onClick={handleSubmit}
          disabled={!role}
        >
          Submit
        </Button>
      </div>
    </Container>
  );
};

export default RegisterPage;
