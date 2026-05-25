package com.example.hotelbooking.email;

public class EmailTemplateUtil {

    /**
     * Builds a premium HTML email for User Registration Welcome.
     */
    public static String buildWelcomeEmail(String userName) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "  <meta charset='utf-8'>" +
                "  <style>" +
                "    body { font-family: 'Outfit', 'Inter', 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }" +
                "    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05); }" +
                "    .header { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 40px 20px; text-align: center; color: #ffffff; }" +
                "    .header h1 { margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px; }" +
                "    .content { padding: 40px 30px; color: #374151; line-height: 1.6; }" +
                "    .content h2 { color: #111827; font-size: 22px; margin-top: 0; font-weight: 600; }" +
                "    .content p { font-size: 16px; color: #4b5563; margin-bottom: 24px; }" +
                "    .button-container { text-align: center; margin: 35px 0 15px; }" +
                "    .btn { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #ffffff !important; text-decoration: none; padding: 12px 30px; font-size: 16px; font-weight: 600; border-radius: 9999px; display: inline-block; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3); transition: all 0.2s; }" +
                "    .footer { background-color: #f9fafb; padding: 25px 20px; text-align: center; font-size: 14px; color: #9ca3af; border-top: 1px solid #f1f5f9; }" +
                "    .footer a { color: #4f46e5; text-decoration: none; font-weight: 500; }" +
                "  </style>" +
                "</head>" +
                "<body>" +
                "  <div class='container'>" +
                "    <div class='header'>" +
                "      <h1>Welcome to Hotel Booking!</h1>" +
                "    </div>" +
                "    <div class='content'>" +
                "      <h2>Hello " + userName + ",</h2>" +
                "      <p>Thank you for registering with us! We are thrilled to have you join our premier travel community. With your new account, you can easily discover, reserve, and manage stays at outstanding hotels around the globe.</p>" +
                "      <p>Whether you're planning a weekend getaway, a critical business trip, or a luxurious resort vacation, we are here to ensure your booking process is seamless, fast, and secure.</p>" +
                "      <div class='button-container'>" +
                "        <a href='#' class='btn'>Explore Hotels Now</a>" +
                "      </div>" +
                "    </div>" +
                "    <div class='footer'>" +
                "      <p>&copy; 2026 Hotel Booking Application. All rights reserved.</p>" +
                "      <p>Need support? <a href='#'>Contact our Help Center</a></p>" +
                "    </div>" +
                "  </div>" +
                "</body>" +
                "</html>";
    }

    /**
     * Builds a premium HTML email for Hotel Booking Confirmation.
     */
    public static String buildBookingConfirmationEmail(String userName, String hotelName, String roomDetails, String checkIn, String checkOut) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "  <meta charset='utf-8'>" +
                "  <style>" +
                "    body { font-family: 'Outfit', 'Inter', 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }" +
                "    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05); }" +
                "    .header { background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 40px 20px; text-align: center; color: #ffffff; }" +
                "    .header h1 { margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px; }" +
                "    .content { padding: 40px 30px; color: #374151; line-height: 1.6; }" +
                "    .content h2 { color: #111827; font-size: 22px; margin-top: 0; font-weight: 600; }" +
                "    .content p { font-size: 16px; color: #4b5563; margin-bottom: 24px; }" +
                "    .invoice-card { background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 25px; margin: 25px 0; }" +
                "    .invoice-title { font-size: 14px; font-weight: 700; text-transform: uppercase; color: #9ca3af; letter-spacing: 1px; margin-bottom: 15px; }" +
                "    .invoice-item { display: flex; justify-content: space-between; border-bottom: 1px dashed #e5e7eb; padding: 12px 0; font-size: 15px; }" +
                "    .invoice-item:last-child { border-bottom: none; padding-bottom: 0; }" +
                "    .invoice-label { color: #6b7280; font-weight: 500; min-width: 120px; }" +
                "    .invoice-value { color: #111827; font-weight: 600; text-align: right; }" +
                "    .footer { background-color: #f9fafb; padding: 25px 20px; text-align: center; font-size: 14px; color: #9ca3af; border-top: 1px solid #f1f5f9; }" +
                "    .footer a { color: #059669; text-decoration: none; font-weight: 500; }" +
                "  </style>" +
                "</head>" +
                "<body>" +
                "  <div class='container'>" +
                "    <div class='header'>" +
                "      <h1>Booking Confirmed!</h1>" +
                "    </div>" +
                "    <div class='content'>" +
                "      <h2>Hello " + userName + ",</h2>" +
                "      <p>Pack your bags! Your reservation has been successfully booked and confirmed. Below is a detailed summary of your upcoming stay. Please keep this email for your records.</p>" +
                "      " +
                "      <div class='invoice-card'>" +
                "        <div class='invoice-title'>Reservation Summary</div>" +
                "        <div class='invoice-item'>" +
                "          <span class='invoice-label'>Hotel</span>" +
                "          <span class='invoice-value'>" + hotelName + "</span>" +
                "        </div>" +
                "        <div class='invoice-item'>" +
                "          <span class='invoice-label'>Room Details</span>" +
                "          <span class='invoice-value'>" + roomDetails + "</span>" +
                "        </div>" +
                "        <div class='invoice-item'>" +
                "          <span class='invoice-label'>Check-in</span>" +
                "          <span class='invoice-value'>" + checkIn + "</span>" +
                "        </div>" +
                "        <div class='invoice-item'>" +
                "          <span class='invoice-label'>Check-out</span>" +
                "          <span class='invoice-value'>" + checkOut + "</span>" +
                "        </div>" +
                "      </div>" +
                "      " +
                "      <p>If you need to make changes to your stay, or cancel your booking, you can do so directly from your booking history portal on our website.</p>" +
                "    </div>" +
                "    <div class='footer'>" +
                "      <p>&copy; 2026 Hotel Booking Application. All rights reserved.</p>" +
                "      <p>Need support? <a href='#'>Contact our Help Center</a></p>" +
                "    </div>" +
                "  </div>" +
                "</body>" +
                "</html>";
    }

    /**
     * Builds a premium HTML email for Booking Cancellation.
     */
    public static String buildBookingCancellationEmail(String userName, String hotelDetails, String cancellationMessage) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "  <meta charset='utf-8'>" +
                "  <style>" +
                "    body { font-family: 'Outfit', 'Inter', 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }" +
                "    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05); }" +
                "    .header { background: linear-gradient(135deg, #dc2626 0%, #f87171 100%); padding: 40px 20px; text-align: center; color: #ffffff; }" +
                "    .header h1 { margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px; }" +
                "    .content { padding: 40px 30px; color: #374151; line-height: 1.6; }" +
                "    .content h2 { color: #111827; font-size: 22px; margin-top: 0; font-weight: 600; }" +
                "    .content p { font-size: 16px; color: #4b5563; margin-bottom: 24px; }" +
                "    .cancellation-card { background-color: #fffbeb; border: 1px solid #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 25px 0; }" +
                "    .cancellation-title { font-size: 14px; font-weight: 700; text-transform: uppercase; color: #b45309; letter-spacing: 0.5px; margin-bottom: 8px; }" +
                "    .cancellation-text { font-size: 15px; color: #78350f; font-weight: 500; }" +
                "    .detail-card { background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin: 20px 0; }" +
                "    .detail-item { display: flex; justify-content: space-between; font-size: 15px; padding: 4px 0; }" +
                "    .detail-label { color: #6b7280; font-weight: 500; }" +
                "    .detail-value { color: #111827; font-weight: 600; text-align: right; }" +
                "    .footer { background-color: #f9fafb; padding: 25px 20px; text-align: center; font-size: 14px; color: #9ca3af; border-top: 1px solid #f1f5f9; }" +
                "    .footer a { color: #dc2626; text-decoration: none; font-weight: 500; }" +
                "  </style>" +
                "</head>" +
                "<body>" +
                "  <div class='container'>" +
                "    <div class='header'>" +
                "      <h1>Booking Cancelled</h1>" +
                "    </div>" +
                "    <div class='content'>" +
                "      <h2>Hello " + userName + ",</h2>" +
                "      <p>This email serves as official confirmation that your hotel booking has been successfully cancelled. We are sorry you won't be checking in, but hope to serve you again in the future.</p>" +
                "      " +
                "      <div class='cancellation-card'>" +
                "        <div class='cancellation-title'>Cancellation Info</div>" +
                "        <div class='cancellation-text'>" + cancellationMessage + "</div>" +
                "      </div>" +
                "      " +
                "      <div class='detail-card'>" +
                "        <div class='detail-item'>" +
                "          <span class='detail-label'>Cancelled Reservation</span>" +
                "          <span class='detail-value'>" + hotelDetails + "</span>" +
                "        </div>" +
                "      </div>" +
                "      " +
                "      <p>If a refund is applicable under the hotel's cancellation policy, it will be automatically processed to your original payment method within 5-7 business days.</p>" +
                "    </div>" +
                "    <div class='footer'>" +
                "      <p>&copy; 2026 Hotel Booking Application. All rights reserved.</p>" +
                "      <p>Need support? <a href='#'>Contact our Help Center</a></p>" +
                "    </div>" +
                "  </div>" +
                "</body>" +
                "</html>";
    }
}
