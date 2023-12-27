# Taiwan DID

Taiwan Decentralized Identifiers (tw-did) is a bridging service that integrates [TW FidO](https://fido.moi.gov.tw/pt/) with W3C [Decentralized Identifiers (DIDs)](https://www.w3.org/TR/did-core/) and [Verifiable Credentials](https://www.w3.org/TR/vc-data-model-2.0/) standards. After verifying a user's Taiwanese residency through TW FidO, the user's identity is linked to a specified decentralized identity, providing various identity verification use cases.

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

Firstly, configure the environment variables by referencing `apps/server/.env.example`. Copy its contents into a new file named `.env.local` within the same directory. The default settings in `.env.example` should work out of the box, with the exception of the `VERAMO_INFURA_PROJECT_ID` variable. You will need to create a project on [Infura](https://www.infura.io/) and provide the project id for `VERAMO_INFURA_PROJECT_ID` in your `.env.local` file.

Next, for local development, you'll need to spin up a MongoDB instance using Docker. Execute the following command to start the database:

```shell
$ nx start-db server
```

For testing purposes, you can simultaneously start both the server and the mock Twfido API service using the following command:

```shell
$ npm run dev
```

Executing the `npm run dev` command will actually start both the `server` and `mock-twfido` projects. The `server` project will be running on port `3000` and the `mock-twfido` project will be running on port `3001`. This is a convenient way to have both services running at the same time for local development and testing.

`mock-twfido` is a mock version of the Twfido API service provided by the Taiwanese government for identity verification. Due to the necessity of registration and IP whitelisting with the actual Twfido API, a mock service like `mock-twfido` is used during development. All requests sent to `mock-twfido` will automatically pass verification, making it a useful tool for testing purposes without having to interact with the real Twfido API.

After the server is up and running, you can use the mock National ID `A123456789` to sign in, it will be automatically passed in 5 seconds.

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

## Running End-to-End (e2e) Tests

You can execute the e2e tests for this project using the following command:

```bash
nx run-many -t e2e
```

In this context, e2e tests refer to the testing process where the server is integrated with MongoDB to ensure that the entire process from the client request to the server and then to the database and back is functioning as expected. It's important to note that these e2e tests do not cover the User Interface (UI) testing.

## Contributors

A big thank you to everyone who has contributed to this project:

- **[Yuren Ju](https://github.com/yurenju)** - Research, Architecture Design, Documentation, Backend Implementation, Frontend Prototype Development
- **[Foo Jia Wen](https://github.com/fjwntut)** - Visual Design, Major Frontend Development
- **[Philip Hsu](https://github.com/JHong-Hsu)** - Kubernetes Deployment, Technical Support
- **[Timothy Chen](https://github.com/timothychen1999)** - Kubernetes Deployment, Technical Support
- **[Dennis Sung](https://github.com/S-H-Ming)** - Coordination, Technical Support
- **[Noah Yeh](https://github.com/noahda0)** - Project Management, Coordination
