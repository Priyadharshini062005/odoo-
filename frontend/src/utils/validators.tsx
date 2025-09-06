export const loginValidator = (email: string, password: string) => {
  const emailResponse = validateEmail(email);
  const passResponse = emptyCheck(password);
  if (emailResponse.error || passResponse.error) {
    return {
      error: true,
      email: emailResponse.message,
      password: passResponse.message,
    };
  }

  return { error: false, email: "", password: "" };
};

export const validateEmail = (email: string) => {
  // Email validation
  if (!email) {
    return { error: true, message: "Email cannot be empty." };
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    return { valid: true, message: "Invalid email format." };
  }
  return { error: false, message: "" };
};

export const emptyCheck = (field: string) => {
  // Empty field validation
  if (!field) {
    return { error: true, message: "Field is empty" };
  }
  return { error: false, message: "" };
};

export const vaidatePassword = (password: string) => {
  // Password validation
  if (!password) {
    return { error: true, message: "Password is required" };
  }
  return { error: false, message: "" };
};
