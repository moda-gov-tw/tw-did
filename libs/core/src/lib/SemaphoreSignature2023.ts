import {
  TKeyType,
  IKey,
  IAgentContext,
  DIDDocComponent,
  VerifiableCredential,
} from '@veramo/core-types';
import { DIDDocument, VerificationMethod } from 'did-resolver';
import { SEMAPHORE_TYPE } from './SemaphoreConstants';
import { ISemaphoreGroupService, TwDidService } from '.';
import { FullProof, verifyProof } from '@semaphore-protocol/proof';
import { RequiredAgentMethods, VeramoLdSignature } from '@tw-did/credential-ld';

type SemaphoreSignature2023Options = {
  context?: IAgentContext<RequiredAgentMethods>;
  verificationMethod?: string;
  key?: IKey;
  issuerDid?: string;
  groupService?: ISemaphoreGroupService;
};

type Purpose = {
  _termDefinedByDIDContext: boolean;
  maxTimestampDelta: number;
  term: string;
};

type DocumentLoaderReturns = {
  contextUrl?: string;
  documentUrl?: string;
  document: DIDDocument;
};

type CreateProofArgs = {
  document?: VerifiableCredential;
  purpose?: Purpose;
  documentLoader?: (url: string) => Promise<DocumentLoaderReturns>;
};

type SemaphoreSignatureProof = {
  type: string;
  verificationMethod: string;
  proofPurpose: string;
  created: string;
  fullProof: FullProof;
};

type MatchProofArgs = {
  proof: {
    type: string;
  };
};

type VerifyProofArgs = {
  proof: SemaphoreSignatureProof;
  document: VerifiableCredential;
};

type VerifyProofReturns = {
  verified: boolean;
  verificationMethod: VerificationMethod;
};

export class PropertyNotFountError extends Error {
  constructor(objectName: string, propertyName: string) {
    super(`property not found: ${objectName}.${propertyName}`);
    this.name = 'PropertyNotFountError';
  }
}

export class SemaphoreSignature2023 extends VeramoLdSignature {
  groupService: ISemaphoreGroupService;
  context?: IAgentContext<RequiredAgentMethods>;
  verificationMethod?: string;
  key?: IKey;
  issuerDid?: string;

  constructor({
    groupService = new TwDidService(''),
    context,
    verificationMethod,
    issuerDid,
    key,
  }: SemaphoreSignature2023Options = {}) {
    super();

    this.context = context;
    this.verificationMethod = verificationMethod;
    this.key = key;
    this.issuerDid = issuerDid;
    this.groupService = groupService;
  }

  override getSupportedVerificationType(): string {
    return SEMAPHORE_TYPE;
  }

  override getSupportedVeramoKeyType(): TKeyType {
    return SEMAPHORE_TYPE;
  }

  override getSuiteForSigning(
    key: IKey,
    issuerDid: string,
    verificationMethod: string,
    context: IAgentContext<RequiredAgentMethods>
  ) {
    return new SemaphoreSignature2023({
      verificationMethod,
      context,
      key,
      issuerDid,
    });
  }

  override getSuiteForVerification() {
    return new SemaphoreSignature2023();
  }

  override preDidResolutionModification(
    _didUrl: string,
    didDoc: DIDDocument | DIDDocComponent
  ): Promise<DIDDocument | DIDDocComponent> {
    return Promise.resolve(didDoc);
  }

  override preSigningCredModification(): void {
    // do nothing
  }

  ensureSuiteContext() {
    // do nothing
  }

  async createProof({
    document,
  }: CreateProofArgs): Promise<SemaphoreSignatureProof> {
    if (!this.context) {
      throw new PropertyNotFountError('SemaphoreSignature2023', 'context');
    }

    if (!this.context.agent) {
      throw new PropertyNotFountError(
        'SemaphoreSignature2023',
        'context.agent'
      );
    }

    if (!this.key) {
      throw new PropertyNotFountError('SemaphoreSignature2023', 'key');
    }

    if (!document) {
      throw new PropertyNotFountError('args', 'document');
    }

    const { credentialSubject } = document;
    const groupId = credentialSubject['group'];

    if (!groupId) {
      throw new PropertyNotFountError('document.credentialSubject', 'group');
    }

    const challenge = Date.now();
    const group = await this.groupService.fetchGroupInfo(groupId);
    const data = { challenge, group };

    const result = await this.context.agent.keyManagerSign({
      keyRef: this.key.kid,
      algorithm: this.getSupportedVeramoKeyType(),
      data: JSON.stringify(data),
    });

    const proof = {
      type: this.getSupportedVerificationType(),
      verificationMethod: this.verificationMethod,
      proofPurpose: 'assertionMethod',
      created: new Date().toISOString(),
      fullProof: JSON.parse(result),
    } as SemaphoreSignatureProof;

    return proof;
  }

  matchProof({ proof }: MatchProofArgs): Promise<boolean> {
    return Promise.resolve(proof.type === this.getSupportedVerificationType());
  }

  async verifyProof(args: VerifyProofArgs): Promise<VerifyProofReturns> {
    const { proof, document } = args;
    const id = proof.verificationMethod;
    const group = await this.groupService.fetchGroupInfo(
      document.credentialSubject['group']
    );

    const verified = await verifyProof(proof.fullProof, group.depth);
    const verificationMethod: VerificationMethod = {
      id,
      type: this.getSupportedVerificationType(),
      controller: this.issuerDid || '',
    };

    return { verified, verificationMethod };
  }
}
