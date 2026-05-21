export function categorizeTransaction(
  note: string
) {
  const lower =
    note.toLowerCase();

  // FOOD
  if (
    lower.includes("zomato") ||
    lower.includes("swiggy") ||
    lower.includes("food") ||
    lower.includes("restaurant") ||
    lower.includes("cafe")
  ) {
    return {
      category: "Food",
      type: "expense",
    };
  }

  // TRAVEL
  if (
    lower.includes("uber") ||
    lower.includes("ola") ||
    lower.includes("rapido") ||
    lower.includes("metro") ||
    lower.includes("travel")
  ) {
    return {
      category: "Travel",
      type: "expense",
    };
  }

  // SHOPPING
  if (
    lower.includes("amazon") ||
    lower.includes("flipkart") ||
    lower.includes("shopping") ||
    lower.includes("myntra")
  ) {
    return {
      category: "Shopping",
      type: "expense",
    };
  }

  // BILLS
  if (
    lower.includes("electricity") ||
    lower.includes("wifi") ||
    lower.includes("rent") ||
    lower.includes("bill")
  ) {
    return {
      category: "Bills",
      type: "expense",
    };
  }

  // SALARY
  if (
    lower.includes("salary") ||
    lower.includes("credited") ||
    lower.includes("income")
  ) {
    return {
      category: "Salary",
      type: "income",
    };
  }

  return {
    category: "Other",
    type: "expense",
  };
}