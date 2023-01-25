# installment-via-stripe-subscription-PoC

## Introduction
The experience that we want to share to our valued customer has a possibility that some of it can't afford.


## use for testing in postman

**POST:**
```javascript
localhost:4242/booking/installment
```
**Body:**
```javascript
{
    "name": "product#12-installment",
    "description": "product#12-installment",
    "prices": [
        {
        "unit_amount": 70000,
        "currency": "sgd",
        "nickname": "upfront",
        "recurring": {}
        },
        {
        "unit_amount": 90000,
        "currency": "sgd",
        "recurring": {"interval": "month"},
        "nickname": "subscription"
        }
    ]
}
```