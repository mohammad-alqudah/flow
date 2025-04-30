import { NavigateFunction } from "react-router";

const TOKEN_KEY = "auth_tokens";

export function getStoredTokens(): string | null {
  try {
    const tokens = localStorage.getItem(TOKEN_KEY);
    return tokens ? JSON.parse(tokens) : null;
  } catch {
    return null;
  }
}

export async function storeTokens(
  tokens: string,
  navigate?: NavigateFunction,
  setIsAuthenticated?: () => void
): Promise<void> {
  await localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));

  setIsAuthenticated && setIsAuthenticated();

  navigate && navigate("/orders/");
}

export async function removeTokens(
  navigate?: NavigateFunction,
  setIsAuthenticated?: () => void
): Promise<void> {
  await localStorage.removeItem(TOKEN_KEY);
  await localStorage.removeItem("company_domian");

  setIsAuthenticated && setIsAuthenticated();

  navigate && navigate("/", { replace: true });
}

export function isAuthenticated(): boolean {
  return !!getStoredTokens();
}
