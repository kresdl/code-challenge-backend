# code-challenge-backend

### Dockerized backend for subscribing to traffic notifications

#### API hosted at https://w36.dev/traffic

##### Development setup:

`make dev`

##### Authentication:

Google oAuth

Authenticate with header `Authorization: Bearer <Id-token>`

##### Endpoint spec:

`POST /subscribe { phoneNumber: string }` (Subscribe to service)

`POST /update { latitude: number, longitude: number }` (Update position)

`POST /signout` (Sign out)

[Related React Native app](https://github.com/kresdl/code-challenge-frontend)
