import React from "react";
import { useFormikContext } from "formik";

import AuthButton from "../AuthButton";

function SubmitButton({ title }) {
  const { handleSubmit } = useFormikContext();

  return <AuthButton title={title} onPress={handleSubmit} />;
}

export default SubmitButton;
