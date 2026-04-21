export type BankAccountView = {
  id: string;
  label: string;
  code: string;
  type: string;
  balance: number;
};

export type TransactionView = {
  id: string;
  accountId: string;
  description: string;
  amount: number;
  date: string;
};

export function mapAccountFromApi(row: Record<string, unknown>): BankAccountView {
  const balanceRaw = row.balance;
  const balance =
    typeof balanceRaw === "string" ? parseFloat(balanceRaw) : Number(balanceRaw);

  return {
    id: String(row.id),
    label: String(row.nickname),
    code: String(row.code),
    type: String(row.account_type),
    balance: Number.isFinite(balance) ? balance : 0,
  };
}

export function mapTransactionFromApi(row: Record<string, unknown>, accountId: string): TransactionView {
  const amountRaw = row.amount;
  const amount = typeof amountRaw === "string" ? parseFloat(amountRaw) : Number(amountRaw);
  const created = row.created_at;
  const date =
    typeof created === "string" && created.length >= 10 ? created.slice(0, 10) : String(created ?? "");

  return {
    id: String(row.id),
    accountId,
    description: String(row.description),
    amount: Number.isFinite(amount) ? amount : 0,
    date,
  };
}
