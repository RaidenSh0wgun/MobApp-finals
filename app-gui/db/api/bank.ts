import { apiFetch, firstValidationMessage } from "@/db/api/client";
import { getApiBaseUrl } from "@/db/api/config";
import { mapAccountFromApi, mapTransactionFromApi, type BankAccountView, type TransactionView } from "@/db/banking";

type ApiResult<T> = { ok: true; data: T } | { ok: false; message: string };

function networkMessage(): string {
  return `Cannot reach API (${getApiBaseUrl()}).`;
}

function messageFrom(json: Record<string, unknown>, fallback: string): string {
  if (typeof json.message === "string" && json.message) {
    return json.message;
  }

  return firstValidationMessage(json) ?? fallback;
}

export async function fetchAccounts(): Promise<ApiResult<BankAccountView[]>> {
  const { res, json, fetchFailed } = await apiFetch("/bank/accounts", { method: "GET" });

  if (fetchFailed || !res) {
    return { ok: false, message: networkMessage() };
  }

  if (!res.ok || json.ok !== true) {
    return { ok: false, message: messageFrom(json, "Could not load accounts") };
  }

  const raw = json.data;
  if (!Array.isArray(raw)) {
    return { ok: false, message: "Unexpected response from server" };
  }

  return {
    ok: true,
    data: raw.map((row) => mapAccountFromApi(row as Record<string, unknown>)),
  };
}

export async function fetchTransactions(accountId: string): Promise<ApiResult<TransactionView[]>> {
  const { res, json, fetchFailed } = await apiFetch(`/bank/accounts/${accountId}/transactions`, {
    method: "GET",
  });

  if (fetchFailed || !res) {
    return { ok: false, message: networkMessage() };
  }

  if (!res.ok || json.ok !== true) {
    return { ok: false, message: messageFrom(json, "Could not load transactions") };
  }

  const raw = json.data;
  if (!Array.isArray(raw)) {
    return { ok: false, message: "Unexpected response from server" };
  }

  return {
    ok: true,
    data: raw.map((row) => mapTransactionFromApi(row as Record<string, unknown>, accountId)),
  };
}

export type CreateBankAccountPayload = {
  code: string;
  nickname: string;
  balance: number;
  account_type: "Checking" | "Savings" | "Time Deposit";
};

export async function createBankAccount(payload: CreateBankAccountPayload): Promise<ApiResult<BankAccountView>> {
  const { res, json, fetchFailed } = await apiFetch("/bank/accounts", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (fetchFailed || !res) {
    return { ok: false, message: networkMessage() };
  }

  if (!res.ok || json.ok !== true) {
    return { ok: false, message: messageFrom(json, "Could not create account") };
  }

  const row = json.data;
  if (!row || typeof row !== "object") {
    return { ok: false, message: "Unexpected response from server" };
  }

  return { ok: true, data: mapAccountFromApi(row as Record<string, unknown>) };
}

export type SendMoneyPayload = {
  from_account_id: number;
  to_account_id: number;
  amount: number;
};

export async function sendMoney(payload: SendMoneyPayload): Promise<ApiResult<Record<string, unknown>>> {
  const { res, json, fetchFailed } = await apiFetch("/bank/send-money", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (fetchFailed || !res) {
    return { ok: false, message: networkMessage() };
  }

  if (!res.ok || json.ok !== true) {
    return { ok: false, message: messageFrom(json, "Could not send money") };
  }

  const row = json.data;
  if (!row || typeof row !== "object") {
    return { ok: false, message: "Unexpected response from server" };
  }

  return { ok: true, data: row as Record<string, unknown> };
}

export type PayBillPayload = {
  from_account_id: number;
  company: string;
  amount: number;
};

export async function payBill(payload: PayBillPayload): Promise<ApiResult<Record<string, unknown>>> {
  const { res, json, fetchFailed } = await apiFetch("/bank/pay-bill", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (fetchFailed || !res) {
    return { ok: false, message: networkMessage() };
  }

  if (!res.ok || json.ok !== true) {
    return { ok: false, message: messageFrom(json, "Could not pay bill") };
  }

  const row = json.data;
  if (!row || typeof row !== "object") {
    return { ok: false, message: "Unexpected response from server" };
  }

  return { ok: true, data: row as Record<string, unknown> };
}
