# installment-via-stripe-subscription-PoC

# use for testing in postman

**POST:**
```javascript
localhost:4242/booking/installment
```
**Body:**
```javascript
{
    "name": "boat#12-installment",
    "description": "boat#12-installment",
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