import {
  CredentialPayload,
  DIDDocComponent,
  DIDDocument,
  IAgentContext,
  IKey,
  IResolver,
  PresentationPayload,
  TKeyType,
} from '@veramo/core-types';
import { RequiredAgentMethods } from '.';

export abstract class VeramoLdSignature {
  abstract getSupportedVerificationType(): string;
  abstract getSupportedVeramoKeyType(): TKeyType;

  abstract getSuiteForSigning(
    key: IKey,
    issuerDid: string,
    verificationMethodId: string,
    context: IAgentContext<RequiredAgentMethods>
  ): any;

  abstract getSuiteForVerification(): any;

  abstract preDidResolutionModification(
    didUrl: string,
    didDoc: DIDDocument | DIDDocComponent,
    context: IAgentContext<IResolver>
  ): Promise<DIDDocument | DIDDocComponent>;

  abstract preSigningCredModification(credential: CredentialPayload): void;

  preSigningPresModification(presentation: PresentationPayload): void {
    // TODO: Remove invalid field 'verifiers' from Presentation. Needs to be adapted for LD credentials
    // Only remove empty array (vc.signPresentation will throw then)
    const sanitizedPresentation = presentation as any;
    if (sanitizedPresentation?.verifier?.length == 0) {
      delete sanitizedPresentation.verifier;
    }
  }
}
