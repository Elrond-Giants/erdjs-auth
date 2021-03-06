import { ITransaction as ExtensionTransaction } from '@elrondnetwork/erdjs-extension-provider/out/interface';
import { ITransaction as LedgerTransaction } from '@elrondnetwork/erdjs-hw-provider/out/interface';
import { ITransaction as WalletConnectTransaction } from '@elrondnetwork/erdjs-wallet-connect-provider/out/interface';
import { ISignable as PemWalletTransaction } from '@elrondnetwork/erdjs-walletcore/out/interface';
import { ITransaction as WebWalletTransaction } from '@elrondnetwork/erdjs-web-wallet-provider/out/interface';

export enum AuthProviderType {
  MAIAR = "maiar",
  WEBWALLET = "webwallet",
  EXTENSION = "extension",
  LEDGER = "ledger",
  PEM = "pem",
  NONE = "none",
}

export type Transaction =
  | WebWalletTransaction
  | WalletConnectTransaction
  | ExtensionTransaction
  | LedgerTransaction
  | PemWalletTransaction;

export interface IAuthState {
  address: string | null;
  authProviderType: AuthProviderType;
  authenticated: boolean;
}

export interface IAuthProvider {
  onChange: (() => void) | undefined;

  init(): Promise<boolean>;

  login(token?: string): Promise<string>;

  logout(): Promise<boolean>;

  signTransaction(tx: Transaction): Promise<Transaction | null>;

  getType(): AuthProviderType;

  toJson(): IAuthState;

  getAddress(): string | null;

  getSignature(): string | null;

  getBaseProvider(): any;
}

export interface IAuthProviderFactory {
  createProvider(): IAuthProvider;
}

export interface IWebConnectionOptions {
  loginRedirectUrl?: string;
  logoutRedirectUrl?: string;
  transactionRedirectUrl?: string;
}

export interface INetworkConfig {
  walletAddress: string;
  bridgeAddress: string;
}

export type NetworkEnv = "testnet" | "devnet" | "mainnet";
