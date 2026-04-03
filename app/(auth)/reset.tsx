import {useState} from "react";

import NewPassword from "@/components/auth/new-password";
import ResetEmail from "@/components/auth/reset-email";

const PwReset = () => {
  const [successfulCreation, setSuccessfulCreation] = useState(false);

  return (
    <>
      {!successfulCreation && (
        <ResetEmail setSuccessfulCreation={setSuccessfulCreation} />
      )}

      {successfulCreation && <NewPassword />}
    </>
  );
};

export default PwReset;
