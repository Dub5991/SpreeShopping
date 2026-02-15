# Invoice Creation Skill

## Description
Creates professional invoices, tracks payments, manages billing cycles, and handles payment reminders. Supports multiple payment methods and currencies.

## Capabilities
- Generate itemized invoices
- Create recurring invoices
- Track invoice status (draft, sent, paid, overdue)
- Calculate taxes and discounts
- Support multiple currencies
- Generate payment reminders
- Track partial payments
- Create credit notes
- Export invoices to PDF
- Integrate with Stripe and other payment processors

## Example Usage

### Create Invoice
```
Create an invoice for TechCorp for the Website Redesign project:
- Frontend development: 40 hours @ $125/hour
- Backend API work: 20 hours @ $125/hour
- Project management: 10 hours @ $100/hour
Total due in 30 days with 8% sales tax.
```

### Send Payment Reminder
```
Send a payment reminder for invoice INV-2024-001 that was due 5 days ago. Keep tone professional and friendly.
```

### Record Payment
```
Record a payment of $5,400 received today via bank transfer for invoice INV-2024-001. Transaction ID: TXN123456.
```

### Generate Monthly Statement
```
Create a statement for TechCorp showing all invoices and payments for January 2024.
```

## Invoice Template Structure

### Header
- Your business name and logo
- Contact information
- Invoice number and date
- Payment terms (Net 30, Net 15, etc.)

### Bill To
- Client name and company
- Billing address
- Contact information

### Line Items
| Description | Quantity | Rate | Amount |
|-------------|----------|------|--------|
| Service 1   | 10 hrs   | $100 | $1,000 |
| Service 2   | 5 hrs    | $150 | $750   |

### Totals
- Subtotal
- Tax (if applicable)
- Discounts (if any)
- **Total Due**

### Footer
- Payment instructions
- Bank account details or payment link
- Thank you message
- Terms and conditions

## Payment Terms

### Standard Terms
- Net 30: Payment due within 30 days
- Net 15: Payment due within 15 days
- Due on Receipt: Payment due immediately
- 2/10 Net 30: 2% discount if paid within 10 days

### Late Payment Policy
"Invoices not paid within [X] days of due date will incur a late fee of [Y]% per month on the outstanding balance."

## Payment Reminders Timeline
1. **Invoice sent**: Payment due in 30 days
2. **Due date**: Friendly reminder
3. **7 days overdue**: First reminder
4. **14 days overdue**: Second reminder
5. **30 days overdue**: Final notice

## Integration
Integrates with Billing MCP Server for invoice management and Client MCP Server for client information. Supports Stripe integration for online payments.

## Best Practices
- Number invoices sequentially
- Include detailed descriptions
- Specify payment terms clearly
- Send invoices promptly
- Follow up on overdue payments
- Keep accurate payment records
- Offer multiple payment methods
- Include all necessary tax information
- Save copies of all invoices
- Track time to payment metrics

## Tax Considerations
- Know your sales tax obligations
- Charge appropriate tax rates
- Keep records for tax filing
- Issue 1099 forms when required
- Track business expenses separately
- Consult with tax professional
