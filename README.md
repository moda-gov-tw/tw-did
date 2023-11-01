# tw-did

tw-did is a bridging service that integrates [TW FidO](https://fido.moi.gov.tw/pt/) with W3C [Decentralized Identifiers (DIDs)](https://www.w3.org/TR/did-core/) and [Verifiable Credentials](https://www.w3.org/TR/vc-data-model-2.0/) standards. After verifying a user's Taiwanese residency through TW FidO, the user's identity is linked to a specified decentralized identity, providing various identity verification use cases.

tw-did mainly has three functions:

- Binding: Through TW FidO, the identity of a Taiwanese resident is linked to a DID.
- Revocation: This is performed when users decide to revoke the link between their DID and their Taiwanese residency.
- Verification: Any third party can request to verify the credentials issued by tw-did.

This project supports the binding of TW FidO to Ethereum Address and [Semaphore](https://semaphore.appliedzkp.org/) Identity. The former will issue a Verifiable Credential recording that an Ethereum Address holder is a Taiwanese resident. After tw-did has verified through TW FidO, the latter allows a holder to prove through Semaphore's zero-knowledge proof that they have passed TW FidO authentication as a Taiwanese resident. Furthermore, the following verification process does not require disclosure of the holder's identity. Neither the issuer nor the verifier can identify which Taiwanese resident is being verified during the verification process.

For more information, please refer to the following documents:

- [Requirements](docs/requirements.md)
- [Use Cases](docs/use-cases.md)
- [User Interface Design Wireframes](docs/wireframes.md)
- Interaction Flow
  - [Registration](docs/registration.md)
  - [Revocation](docs/revocation.md)
  - [Verification](docs/verification.md)

# Usage

`tw-did` uses nx for monorepo management. Please use the command below to install the dependencies:

```shell
$ npm install
```

This command installs all necessary packages for the project.

# Server Setup

## Development Environment

For local development, you'll need to spin up a MongoDB instance using Docker. Execute the following command to start the database:

```shell
$ nx start-db server
```

Next, configure the environment variables by referencing `apps/server/.env.example`. Copy its contents into a new file named `.env.local` within the same directory. To start the server, run:

```shell
$ nx serve server
```

## Testing with Twfido API Service

If you require a mock Twfido API service for testing, you can start it on port 3001 using the following command:

```shell
$ PORT=3001 nx serve mock-twfido
```

Then, set the `TWFIDO_API_URL` and `TWFIDO_ENABLE_VALIDATION` environment variables. Relaunch the server using `nx serve server` with the new settings:

```shell
TWFIDO_API_URL=http://localhost:3001/api
TWFIDO_ENABLE_VALIDATION="0"
```

and you can use mock National ID `A123456789` to sign in, it will be automatically passed in 5 seconds.

## Sample Verifier

The Sample Verifier serves as a demonstration on how to use tw-did. Firstly, add a `.env.local` file to the `<rootFolder>/apps/sample-verifier` directory. You can simply copy `.env.local.example` to `.env.local` and insert your Infura project ID.

Next, to set up a minimal development environment, you'll need to start `sample-verifier` project. Execute the following commands to do so:

```shell
$ nx preview sample-verifier --watch
```

Once the servers are running, navigate to `http://localhost:4300/` in your browser.

We use the `preview` subcommand for the `sample-verifier` server due to an issue with the `ethr-did-resolver` package, which causes errors on the Vite development server. An issue has already been filed to address this. Note that the service may operate more slowly than usual because the `preview` subcommand triggers a rebuild of `sample-verifier` whenever you save changes. This is a temporary workaround.

## Docker Commands

We have a few Docker-related commands that enable the system to run within a Docker environment. If you want to run the environment using `docker-compose`, you can use the following command:

```bash
nx up docker
```

This command leverages Nx's dependency management to build the necessary projects and then initiates `docker-compose up` to start MongoDB, the server, and the front-end website together. When you are done and wish to shut down the services, you can use the following command:

```bash
nx down docker
```

If you simply want to build a Docker image, you can use this command:

```bash
nx build docker
```

## E2E Tests Locally

If you are planning to run e2e tests locally, you'll also need to set a `VITE_MOCK_WALLET_PRIVATE_KEY` in your `.env.local` file. Due to security reasons, please reach out to @yurenju to obtain this key.

```shell
$ nx run-many -t e2e
```

## Acceptance tests

You can also use the following command to run acceptance test cases:

```shell
$ npm run acceptance
```

This command runs end-to-end acceptance tests for the project.
