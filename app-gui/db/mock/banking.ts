export type Account = {
  id: string;
  label: string;
  code: string;
  type: string;
  balance: number;
};

export type Transaction = {
  id: string;
  accountId: string;
  description: string;
  amount: number;
  date: string;
};

export const accounts: Account[] = [
  { id: '1', label: 'Est Expedita', code: '47603445', type: 'Checking', balance: 6570.77 },
  { id: '2', label: 'Vel Qui', code: '55383977', type: 'Checking', balance: 8776.23 },
  { id: '3', label: 'Voluptatem Sit', code: '81662100', type: 'Savings', balance: 8547.34 },
  { id: '4', label: 'Ipsum In', code: '97800554', type: 'Checking', balance: 7447.39 },
];

export const transactions: Transaction[] = [
  { id: 'a', accountId: '1', description: 'Monthly salary', amount: 12000, date: '2026-04-12' },
  { id: 'b', accountId: '1', description: 'Coffee shop', amount: -320.5, date: '2026-04-14' },
  { id: 'c', accountId: '2', description: 'Utility payment', amount: -1250, date: '2026-04-13' },
  { id: 'd', accountId: '2', description: 'Interest credit', amount: 84.25, date: '2026-04-11' },
  { id: 'e', accountId: '3', description: 'Savings deposit', amount: 5000, date: '2026-04-10' },
  { id: 'f', accountId: '3', description: 'Online transfer', amount: -2200, date: '2026-04-15' },
  { id: 'g', accountId: '4', description: 'Groceries', amount: -890.75, date: '2026-04-14' },
  { id: 'h', accountId: '4', description: 'Loan repayment', amount: -1750, date: '2026-04-16' },
];

export const getAccounts = () => accounts;
export const getTransactions = () => transactions;
export const getTransactionsForAccount = (accountId: string) =>
  transactions.filter((item) => item.accountId === accountId);
