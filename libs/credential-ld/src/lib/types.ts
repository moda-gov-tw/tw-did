import {
  CredentialPayload,
  IAgentContext,
  IDIDManager,
  IKeyManager,
  IPluginMethodMap,
  IResolver,
  VerifiableCredential,
} from '@veramo/core-types';

export interface ICredentialIssuerLD extends IPluginMethodMap {
  createVerifiableCredentialLD(
    args: ICreateVerifiableCredentialLDArgs,
    context: IRequiredContext
  ): Promise<VerifiableCredential>;
  verifyCredentialLD(
    args: IVerifyCredentialLDArgs,
    context: IRequiredContext
  ): Promise<boolean>;
}

export interface ICreateVerifiableCredentialLDArgs {
  credential: CredentialPayload;
  keyRef?: string;
  [x: string]: any;
}

export interface IVerifyCredentialLDArgs {
  credential: VerifiableCredential;
  [x: string]: any;
}

export type IRequiredContext = IAgentContext<
  IResolver &
    Pick<IDIDManager, 'didManagerGet'> &
    Pick<IKeyManager, 'keyManagerGet' | 'keyManagerSign'>
>;

export const LdDefaultContexts = new Map([]);
export type RequiredAgentMethods = IResolver &
  Pick<IKeyManager, 'keyManagerGet' | 'keyManagerSign'>;
