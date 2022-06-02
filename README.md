# code-challenge-backend

### API for subscribing to traffic notifications
#### Hosted at https://w36.dev/traffic

##### Node setup for development:

`npm run tsc:watch`

`npm run dev`

##### Authentication:

Google oAuth

Authenticate with header `Authorization: Bearer <Id-token>`

##### Endpoint spec:

`POST /subscribe { phoneNumber: string }` (Subscribe to service payload)

`POST /update { latitude: number, longitude: number }` (Update position)

`POST /signout` (Sign out)

[Related React Native app](https://github.com/kresdl/code-challenge-frontend)
