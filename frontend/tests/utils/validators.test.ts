import {
  loginValidator,
  validateEmail,
  emptyCheck,
} from "../../src/utils/validators";

describe("validateEmail", () => {
  it("returns error when email is empty", () => {
    expect(validateEmail("")).toEqual({
      error: true,
      message: "Email cannot be empty.",
    });
  });

  it("returns error for invalid email format", () => {
    expect(validateEmail("invalid-email")).toEqual({
      valid: true,
      message: "Invalid email format.",
    });
  });

  it("returns no error for valid email", () => {
    expect(validateEmail("test@example.com")).toEqual({
      error: false,
      message: "",
    });
  });
});

describe("emptyCheck", () => {
  it("returns error when field is empty", () => {
    expect(emptyCheck("")).toEqual({ error: true, message: "Field is empty" });
  });

  it("returns no error when field is filled", () => {
    expect(emptyCheck("Hello")).toEqual({ error: false, message: "" });
  });
});

describe("validatePassword", () => {
  it("returns error when password is empty", () => {
    expect(validatePassword("")).toEqual({
      error: true,
      message: "Password is required",
    });
  });

  it("returns no error when password is provided", () => {
    expect(validatePassword("mypassword")).toEqual({
      error: false,
      message: "",
    });
  });
});

describe("loginValidator", () => {
  it("returns error if both email and password are invalid", () => {
    const result = loginValidator("", "");
    expect(result.error).toBe(true);
    expect(result.email).toBe("Email cannot be empty.");
    expect(result.password).toBe("Field is empty");
  });

  it("returns error for invalid email and valid password", () => {
    const result = loginValidator("bad-email", "12345");
    expect(result.error).toBe(true);
    expect(result.email).toBe("Invalid email format.");
    expect(result.password).toBe("");
  });

  it("returns success for valid email and password", () => {
    const result = loginValidator("user@example.com", "12345");
    expect(result).toEqual({
      error: false,
      email: "",
      password: "",
    });
  });
});
function validatePassword(arg0: string): any {
  throw new Error("Function not implemented.");
}
