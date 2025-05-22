# authRouter
- POST /signup
- POST /login
- POST /logout

# profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

# connectionRequestRouter
- POST /request/send/interested/:userid
- POST /request/send/ignored/:userid
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

# userRouter
- GET /connections
- GET /requests/received
- GET /feed - Gets you the profiles of other users

Status : ignored, interested, accepted, rejected