# tw-did requirements

## Final Requirements

1. Integrate the Ministry of the Interior's TW FidO. After users validate their identities, a wallet address credential suitable for binding on the public blockchain is automatically produced.
2. In the event of a lost wallet address, the associated binding can be revoked.
3. When a credential gets revoked, users must reapply for a fresh wallet address binding.
4. The wallet address credential issued by integrating the TW FidO will be compatible with EVM-based blockchains.
5. The implementation must be based on the relevant standards for W3C certificate verification.

In addition to the original requirements, this project will also implement a credential type based on the Semaphore Zero-Knowledge Proof framework, serving as an enhanced privacy credential solution.

The final requirements have been refined based on our preferences and decisions. The context is provided below.

## Original Requirements (In Chinese)

### 以 W3C 國際標準實作數位憑證之對接驗證

1. 介接內政部行動自然人憑證，使用者使用行動自然人憑證驗證身分後，自動產生可綁定在公共區塊鏈上之錢包地址 (address) 或不可轉讓權杖 (token)。
2. 不可轉讓權杖與錢包地址是一對一綁定，如發生錢包地址遺失，將可撤消 (revoke) 與錢包地址綁定關係。
3. 不可轉讓權杖被撤銷後，使用者需透過重新申請新的不可轉讓代幣，並重新綁定錢包地址。
4. 以行動自然人憑證為基礎產生之錢包地址，其標準規格不限於單一區塊鏈，且可相容於各個區塊鏈。

## English Translation of Original Requirements:

### Implementing Digital Certificate Verification Based on W3C Standards

1. Integrate the Ministry of the Interior's TW FidO. Once users authenticate their identities, an automatic generation of a wallet address or non-transferable token is possible for binding on the public blockchain.
2. The non-transferable token and wallet address have a one-to-one binding relationship. In case of a lost wallet address, its binding can be revoked.
3. If the non-transferable token gets revoked, users are required to reapply for a new non-transferable token and rebind the wallet address.
4. Wallet addresses generated using the TW FidO are not confined to a single blockchain standard and is compatible with various blockchains.

Given our preference for binding to a wallet address over using a non-transferable token, and considering the challenge of ensuring compatibility with the rapidly expanding array of blockchains, we have chosen to focus on EVM-based blockchains. The final requirements reflect these decisions.
