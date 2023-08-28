import {
  IIdentifier,
  PresentationPayload,
  VerifiablePresentation,
} from '@veramo/core';
import {
  CredentialIssuerEIP712,
  ICreateVerifiablePresentationEIP712Args,
  IRequiredContext,
} from '@veramo/credential-eip712';
import {
  getChainIdForDidEthr,
  isDefined,
  MANDATORY_CREDENTIAL_CONTEXT,
  mapIdentifierKeysToDoc,
  processEntryToArray,
  removeDIDParameters,
} from '@veramo/utils';
import { getEthTypesFromInputDoc } from 'eip-712-types-generation';

export class TwDidCredentialIssuerEIP712 extends CredentialIssuerEIP712 {
  constructor() {
    super();
  }

  override async createVerifiablePresentationEIP712(
    args: ICreateVerifiablePresentationEIP712Args,
    context: IRequiredContext
  ): Promise<VerifiablePresentation> {
    const presentationContext = processEntryToArray(
      args?.presentation?.['@context'],
      MANDATORY_CREDENTIAL_CONTEXT
    );
    const presentationType = processEntryToArray(
      args?.presentation?.type,
      'VerifiablePresentation'
    );
    let issuanceDate =
      args?.presentation?.issuanceDate || new Date().toISOString();
    if (issuanceDate instanceof Date) {
      issuanceDate = issuanceDate.toISOString();
    }

    const presentation: PresentationPayload = {
      ...args?.presentation,
      '@context': presentationContext,
      type: presentationType,
      issuanceDate,
    };

    if (!isDefined(args.presentation.holder)) {
      throw new Error(
        'invalid_argument: presentation.holder must not be empty'
      );
    }

    if (args.presentation.verifiableCredential) {
      const credentials = args.presentation.verifiableCredential.map((cred) => {
        // map JWT credentials to their canonical form
        if (typeof cred === 'string') {
          return cred;
        } else if (cred.proof['jwt']) {
          return cred.proof['jwt'];
        } else {
          return JSON.stringify(cred);
        }
      });
      presentation.verifiableCredential = credentials;
    }

    const holder = removeDIDParameters(presentation.holder);

    let identifier: IIdentifier;
    try {
      identifier = await context.agent.didManagerGet({ did: holder });
    } catch (e) {
      throw new Error(
        'invalid_argument: presentation.holder must be a DID managed by this agent'
      );
    }

    let keyRef = args.keyRef;

    if (!keyRef) {
      const key = identifier.keys.find(
        (k) =>
          k.type === 'Secp256k1' &&
          k.meta?.algorithms?.includes('eth_signTypedData')
      );
      if (!key)
        throw Error(
          'key_not_found: No suitable signing key is known for ' +
            identifier.did
        );
      keyRef = key.kid;
    }

    const extendedKeys = await mapIdentifierKeysToDoc(
      identifier,
      'verificationMethod',
      context
    );
    const extendedKey = extendedKeys.find((key) => key.kid === keyRef);
    if (!extendedKey)
      throw Error(
        'key_not_found: The signing key is not available in the issuer DID document'
      );
    let chainId = 1;
    if (identifier.did.split(':')[1] === 'ethr')
      chainId = getChainIdForDidEthr(extendedKey.meta.verificationMethod);
    presentation['proof'] = {
      verificationMethod: extendedKey.meta.verificationMethod.id,
      created: issuanceDate,
      proofPurpose: 'assertionMethod',
      type: 'EthereumEip712Signature2021',
    };

    const message = presentation;
    const domain = {
      chainId,
      name: 'VerifiablePresentation',
      version: '1',
    };

    const primaryType = 'VerifiablePresentation';
    const allTypes = getEthTypesFromInputDoc(presentation, primaryType);
    const types = { ...allTypes };

    const data = JSON.stringify({ domain, types, message, primaryType });

    const signature = await context.agent.keyManagerSign({
      keyRef,
      data,
      algorithm: 'eth_signTypedData',
    });

    presentation['proof'].proofValue = signature;

    presentation['proof'].eip712 = {
      domain,
      types: allTypes,
      primaryType,
    };

    return presentation as VerifiablePresentation;
  }
}
