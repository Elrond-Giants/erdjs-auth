import { HWProvider } from '@elrondnetwork/erdjs-hw-provider/out';
import { ITransaction as LedgerTransaction } from '@elrondnetwork/erdjs-hw-provider/out/interface';

import { AuthProviderType, IAuthProvider, IAuthState, Transaction } from '../types';

export class LedgerProvider implements IAuthProvider {
  private provider: HWProvider;
  private authenticated: boolean = false;
  private address: string | null;
  private signature: string | null;
  private addressIndex: number;

  constructor(provider: HWProvider, addressIndex: number) {
    this.address = null;
    this.signature = null;
    this.addressIndex = addressIndex;
    this.provider = provider;
  }

  getAddress(): string | null {
    return this.address;
  }

  async init(): Promise<boolean> {
    if (this.provider.isInitialized()) {
      return true;
    }

    return this.provider.init();
  }

  async login(_token?: string): Promise<string> {
    if (_token) {
      const token = Buffer.from(_token, "utf-8");
      const { address, signature } = await this.provider.tokenLogin({
        addressIndex: this.addressIndex,
        token,
      });
      this.address = address;
      this.signature = signature.hex();
    } else {
      this.address = await this.provider.login({ addressIndex: this.addressIndex });
    }

    this.authenticated = true;
    return this.address;
  }

  async logout(): Promise<boolean> {
    const result = await this.provider.logout();
    if (result) {
      this.authenticated = false;
    }

    return result;
  }

  signTransaction(tx: Transaction): Promise<Transaction | null> {
    return this.provider.signTransaction(tx as LedgerTransaction);
  }

  getSignature() {
    return this.signature;
  }

  getType(): AuthProviderType {
    return AuthProviderType.LEDGER;
  }

  toJson(): IAuthState {
    return {
      address: this.getAddress(),
      authProviderType: this.getType(),
      authenticated: this.authenticated,
    };
  }
}