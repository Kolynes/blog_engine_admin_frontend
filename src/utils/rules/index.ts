export function emailRule(value: string) {
  if ((value || "").length == 0) {
    return "Email required!";
  } else if (
    !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value || "")
  ) {
    return "invalid email";
  } else {
    return true;
  }
}

export function nigerianBankAccountRule(value: string) {
  return /^[0-9]{10}$/.test(value) || "invalid bank account";
}

export function nigerianPhoneRule(value: string) {
  return (
    /(^\+234(8|7|9){1}[0-9]{9}$)|(^0(8|7|9){1}[0-9]{9}$)/.test(value) ||
    "Invalid phone number"
  );
}

export function requiredLengthRule(
  min: number = -Infinity,
  max: number = Infinity
) {
  const rule = (value: string) => {
    value = (value || "").toString();
    if (value.length < min) {
      return `This field should be at least ${min} characters long.`;
    } else if (value.length > max) {
      return `This field should be at most ${max} characters long.`;
    } else return true;
  };
  return rule;
}

export function requiredRule(value: string) {
  return (value || "").length > 0 || value || "This field is required";
}

export function usernameRule(value: string) {
  return /^\s*[a-z,A-Z]{1}\w{4,}\s*$/.test(value) || "Invalid username";
}

export function rangeRule(
  min: number = -Infinity,
  max: number = Infinity,
  minError?: string,
  maxError?: string
) {
  return (value: number) => {
    if (value < min) return minError || `This field should be more than ${min}`;
    else if (value > max)
      return maxError || `This field should be less than ${max}`;
    else return true;
  };
}

export function passwordConfirmationRule(value: string, password: string) {
  if ((value || "").length === 0) {
    return "Password confirmation is required";
  } else if (value !== password) {
    return "Passwords must match";
  } else {
    return true;
  }
}
