import {
  CredentialPayload,
  IAgentContext,
  IAgentPlugin,
  IIdentifier,
  IKey,
  IResolver,
  VerifiableCredential,
} from '@veramo/core-types';
import {
  _ExtendedIKey,
  extractIssuer,
  MANDATORY_CREDENTIAL_CONTEXT,
  mapIdentifierKeysToDoc,
  processEntryToArray,
} from '@veramo/utils';
import {
  ICreateVerifiableCredentialLDArgs,
  ICredentialIssuerLD,
  IRequiredContext,
  IVerifyCredentialLDArgs,
  RequiredAgentMethods,
} from './types';
import { VeramoLdSignature } from './ld-suites';

export class TwDidCredentialIssuerLD implements IAgentPlugin {
  readonly methods: ICredentialIssuerLD;
  suites: VeramoLdSignature[];

  constructor(options: { suites: VeramoLdSignature[]; contextMaps?: any[] }) {
    this.methods = {
      createVerifiableCredentialLD:
        this.createVerifiableCredentialLD.bind(this),
      verifyCredentialLD: this.verifyCredentialLD.bind(this),
    };
    this.suites = options.suites;
  }

  public async createVerifiableCredentialLD(
    args: ICreateVerifiableCredentialLDArgs,
    context: IRequiredContext
  ): Promise<VerifiableCredential> {
    const credentialContext = processEntryToArray(
      args?.credential?.['@context'],
      MANDATORY_CREDENTIAL_CONTEXT
    );
    const credentialType = processEntryToArray(
      args?.credential?.type,
      'VerifiableCredential'
    );
    const credential: CredentialPayload = {
      ...args?.credential,
      '@context': credentialContext,
      type: credentialType,
    };

    const issuer = extractIssuer(credential, { removeParameters: true });
    if (!issuer || typeof issuer === 'undefined') {
      throw new Error(
        'invalid_argument: args.credential.issuer must not be empty'
      );
    }

    let identifier: IIdentifier;
    try {
      identifier = await context.agent.didManagerGet({ did: issuer });
    } catch (e) {
      throw new Error(
        `invalid_argument: args.credential.issuer must be a DID managed by this agent. ${e}`
      );
    }
    try {
      const { signingKey, verificationMethodId } =
        await this.findSigningKeyWithId(context, identifier, args.keyRef);

      let { now } = args;
      if (typeof now === 'number') {
        now = new Date(now * 1000);
      }

      return await this.issueCredential(
        credential,
        identifier.did,
        signingKey,
        verificationMethodId,
        { ...args, now },
        context
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async verifyCredentialLD(
    args: IVerifyCredentialLDArgs
  ): Promise<boolean> {
    const { credential } = args;
    let { now } = args;
    if (typeof now === 'number') {
      now = new Date(now * 1000);
    }

    const [suite] = this.suites;
    const { proof } = credential;
    return (suite as any).verifyProof({
      document: credential,
      proof,
    }) as boolean;
  }

  private async findSigningKeyWithId(
    context: IAgentContext<IResolver>,
    identifier: IIdentifier,
    keyRef?: string
  ): Promise<{ signingKey: _ExtendedIKey; verificationMethodId: string }> {
    const extendedKeys: _ExtendedIKey[] = await mapIdentifierKeysToDoc(
      identifier,
      'assertionMethod',
      context
    );
    const supportedTypes = this.getAllSignatureSuiteTypes();
    let signingKey: _ExtendedIKey | undefined;
    if (keyRef) {
      signingKey = extendedKeys.find((k) => k.kid === keyRef);
    }
    if (
      signingKey &&
      !supportedTypes.includes(signingKey.meta.verificationMethod.type)
    ) {
      signingKey = undefined;
    }
    if (!signingKey) {
      signingKey = extendedKeys.find((k) =>
        supportedTypes.includes(k.meta.verificationMethod.type)
      );
    }

    if (!signingKey)
      throw Error(
        `key_not_found: No suitable signing key found for ${identifier.did}`
      );
    const verificationMethodId = signingKey.meta.verificationMethod.id;
    return { signingKey, verificationMethodId };
  }

  private getAllSignatureSuiteTypes(): string[] {
    return this.suites.map((suite) => suite.getSupportedVeramoKeyType());
  }

  private async issueCredential(
    credential: CredentialPayload,
    issuerDid: string,
    key: IKey,
    verificationMethodId: string,
    options: any,
    context: IAgentContext<RequiredAgentMethods>
  ): Promise<VerifiableCredential> {
    const signatureSuite = this.getSignatureSuiteForKeyType(key.type);
    const suite = signatureSuite.getSuiteForSigning(
      key,
      issuerDid,
      verificationMethodId,
      context
    );

    const proof = await suite.createProof({
      document: credential,
    });

    const verifiableCredential = credential as VerifiableCredential;
    verifiableCredential.proof = proof;
    return verifiableCredential;
  }

  private getSignatureSuiteForKeyType(keyType: string): VeramoLdSignature {
    const [suite] = this.suites.filter(
      (s) => s.getSupportedVeramoKeyType() === keyType
    );

    if (!suite) {
      throw new Error(`No signature suite found for key type ${keyType}`);
    }

    return suite;
  }
}
