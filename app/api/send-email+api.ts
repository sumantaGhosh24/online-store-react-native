import {transporter} from "@/utils/mail-server";

export async function POST(req: Request) {
  const {
    email,
    userName,
    orderId,
    orderDate,
    paymentStatus,
    userEmail,
    products,
    subtotal,
    couponCode,
    discount,
    finalPrice,
    city,
    state,
    country,
    zip,
    addressline,
  } = await req.json();

  await transporter.sendMail({
    from: "Online Store",
    to: email,
    subject: "Online Store - Order Confirmation",
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Order Confirmation - Thank You for Your Purchase!</title><style>body {margin: 0;padding: 0;font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;-webkit-font-smoothing: antialiased;background-color: #f4f4f7;color: #333333;}.container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);}.header { background-color: #007bff; color: #ffffff; padding: 20px 30px; text-align: center;}.content-section { padding: 30px;}.item-table { width: 100%; border-collapse: collapse; margin-top: 20px;}.item-table th, .item-table td { padding: 12px 0; text-align: left; border-bottom: 1px solid #eeeeee;}.item-table th { font-weight: 600; color: #555555;}.summary-row td { padding: 10px 0;}.total-row { font-size: 1.1em; font-weight: bold; border-top: 2px solid #007bff;}.footer { padding: 20px 30px; text-align: center; font-size: 0.85em; color: #999999; border-top: 1px solid #eeeeee;}.address-box { border: 1px solid #dddddd; padding: 15px; border-radius: 4px; margin-top: 15px; background-color: #f9f9f9;}.cta-button { display: inline-block; background-color: #28a745; color: #ffffff !important; padding: 12px 25px; border-radius: 4px; text-decoration: none; font-weight: bold; margin-top: 20px;}</style></head><body><div class="container"><div class="header"><h1 style="margin: 0; font-size: 24px;">🎉 Order Confirmed!</h1></div><div class="content-section"><p>Hi ${userName}, 👋</p><p>Thank you for your recent purchase! Your order is confirmed and we're preparing it for shipment. Here are the details of your order:</p><table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td width="50%" style="padding-bottom: 10px;"><strong>Order ID:</strong> ${orderId}</td><td width="50%" style="padding-bottom: 10px;"><strong>Order Date:</strong> ${new Date(orderDate).toLocaleString()}</td></tr><tr><td width="50%"><strong>Payment Status:</strong> <span style="color: #28a745;">${paymentStatus}</span></td><td width="50%"><strong>User Email:</strong> <span style="color: #28a745;">${userEmail}</span></td></tr></table><h2 style="font-size: 18px; margin-top: 30px; color: #007bff; border-bottom: 1px solid #eeeeee; padding-bottom: 10px;">Order Summary</h2><table class="item-table" role="presentation" border="0" cellpadding="0" cellspacing="0"><thead><tr><th width="40%">Item</th><th width="20%">Quantity</th><th width="20%" style="text-align: right;">Price</th><th width="20%" style="text-align: right;">Total Price</th></tr></thead><tbody>${products.map((product: any) => `<tr><td>${product.product.title}</td><td>${product.quantity}</td><td style="text-align: right;">${product.product.price}</td><td style="text-align: right;">${product.product.price * product.quantity}</td></tr>`)}</tbody></table><table class="item-table" role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin-top: 0; border-top: none;"><tbody><tr class="summary-row"><td colspan="2" style="text-align: right; font-weight: 500;">Subtotal:</td><td style="text-align: right; width: 30%;">₹${subtotal}</td></tr><tr class="summary-row"><td colspan="2" style="text-align: right; font-weight: 500;">Discount (${couponCode}):</td><td style="text-align: right; color: #dc3545;">-₹${discount}</td></tr><tr class="total-row"><td colspan="2" style="text-align: right; padding: 15px 0;">Final Price:</td><td style="text-align: right; padding: 15px 0;">₹${finalPrice}</td></tr></tbody></table><h2 style="font-size: 18px; margin-top: 30px; color: #007bff; border-bottom: 1px solid #eeeeee; padding-bottom: 10px;">Shipping Address</h2><div class="address-box"><p style="margin: 0;">${addressline}</p><p style="margin: 5px 0;">${city}, ${state} - ${zip}</p><p style="margin: 0;">${country}</p></div><p style="margin-top: 30px;">If you have any questions, please reply to this email or contact our support team.</p></div><div class="footer"><p style="margin: 0 0 5px;">&copy; 2025 Your Company Name. All rights reserved.</p><p style="margin: 0;"><a href="/privacy" style="color: #007bff; text-decoration: none;">Privacy Policy</a> | <a href="/terms" style="color: #007bff; text-decoration: none;">Terms of Service</a></p></div></div></body></html>`,
  });

  return Response.json({message: "Email sent successfully"});
}
