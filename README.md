# tw-did

tw-did is a bridging service that integrates [TW FidO](https://fido.moi.gov.tw/pt/) with W3C [Decentralized Identifiers (DIDs)](https://www.w3.org/TR/did-core/) and [Verifiable Credentials](https://www.w3.org/TR/vc-data-model-2.0/) standards. After verifying a user's Taiwanese residency through TW FidO, the user's identity is linked to a specified decentralized identity, providing various identity verification use cases.

tw-did mainly has three functions:

- Binding: Through TW FidO, the identity of a Taiwanese resident is linked to a DID.
- Revocation: This is performed when users decide to revoke the link between their DID and their Taiwanese residency.
- Verification: Any third party can request to verify the credentials issued by tw-did.

This project supports the binding of TW FidO to Ethereum Address and Semaphore Identity. The former will issue a Verifiable Credential recording that an Ethereum Address holder is a Taiwanese resident. After tw-did has verified through TW FidO, the latter allows a holder to prove through Semaphore's zero-knowledge proof that they have passed TW FidO authentication as a Taiwanese resident. Furthermore, the following verification process does not require disclosure of the holder's identity. Neither the issuer nor the verifier can identify which Taiwanese resident is being verified during the verification process.

For more information, please refer to the following documents:

- [Use Cases](docs/use-cases.md)
- [User Interface Design Wireframes](docs/wireframes.md)
- Interaction Flow
  - [Registration](docs/registration.md)
  - [Revocation](docs/revocation.md)
  - [Verification](docs/verification.md)
