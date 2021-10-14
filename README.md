## Getting Started
First, run the development server:

```bash
npm run dev
```


## Add this default documents on your mongoDB
## On users Database
{
    "_id": {
        "$oid": "614cf73b6d3ea250882984b6"
    },
    "status": true,
    "firstName": "Gabriel",
    "lastName": "Murillo",
    "birthDate": {
        "$date": "1995-11-14T06:00:00.000Z"
    },
    "email": "gabrielmurillo66@gmail.com",
    "password": "$2a$10$acDBGVFDp6ZUR/bRNXvOOuVdqwo7gw37OfkDtjMmXV/7X9XOQnpKS",
    "role": {
        "$oid": "615cc7b6986a3d145c903fce"
    }
}

## On roles Database
{
    "_id": {
        "$oid": "615cc7b6986a3d145c903fce"
    },
    "createPermissions": ["users", "roles"],
    "updatePermissions": ["roles"],
    "deletePermissions": ["roles"],
    "readPermissions": ["roles"],
    "priority": 0,
    "role": "ADMIN_ROLE",
    "__v": 0
}

# On currencies Database
{
    "_id": {
        "$oid": "6167cdbcc69857625c33780b"
    },
    "name": "Ethereum",
    "slug": "ethereum",
    "symbol": "ETH",
    "investmentValue": 4.2

{
    "_id": {
        "$oid": "6167cd98c69857625c337801"
    },
    "name": "Bitcoin",
    "slug": "bitcoin",
    "symbol": "BTC",
    "investmentValue": 5
}

{
    "_id": {
        "$oid": "6167cd78c69857625c3377fd"
    },
    "name": "Cardano",
    "slug": "cardano",
    "symbol": "ADA",
    "investmentValue": 1
}
