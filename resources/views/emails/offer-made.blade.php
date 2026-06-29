<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
</head>
<body style="margin:0;padding:0;background-color:#0c1625;font-family:Inter,Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#0c1625;">
    <tr>
      <td align="center" style="padding:48px 16px 32px;">

        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:520px;">

          <!-- Top accent bar -->
          <tr>
            <td style="height:2px;background:linear-gradient(90deg,#1ac98a,#0ea572);border-radius:4px 4px 0 0;"></td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background-color:#121d2f;border:1px solid #1e2d45;border-top:none;border-radius:0 0 16px 16px;">

              <!-- Brand header -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="padding:28px 40px 24px;border-bottom:1px solid #1a2840;">
                    <span style="font-size:20px;font-weight:900;color:#1ac98a;letter-spacing:-0.5px;font-family:Georgia,'Times New Roman',serif;">Mohi</span>
                    <span style="font-size:12px;color:#3a5570;margin-left:8px;font-family:Arial,sans-serif;font-weight:400;letter-spacing:0.5px;text-transform:uppercase;">Portfolio</span>
                  </td>
                </tr>
              </table>

              <!-- Body -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="padding:36px 40px 40px;">

                    <!-- Amount badge -->
                    <table cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:24px;">
                      <tr>
                        <td style="padding:10px 18px;background-color:#0f2e20;border:1px solid rgba(26,201,138,0.2);border-radius:8px;">
                          <span style="font-size:13px;color:#8ba3bf;font-family:Arial,sans-serif;text-transform:uppercase;letter-spacing:0.5px;">Offer amount</span>
                          <br>
                          <span style="font-size:28px;font-weight:800;color:#1ac98a;letter-spacing:-0.5px;font-family:Georgia,'Times New Roman',serif;">${{ $amount }}</span>
                        </td>
                      </tr>
                    </table>

                    <h1 style="margin:0 0 14px;font-size:24px;font-weight:800;color:#edf5f2;letter-spacing:-0.5px;line-height:1.25;font-family:Georgia,'Times New Roman',serif;">
                      New offer on your listing
                    </h1>
                    <p style="margin:0 0 28px;font-size:15px;line-height:1.65;color:#8ba3bf;">
                      Someone has made an offer of
                      <strong style="color:#edf5f2;font-weight:600;">${{ $amount }}</strong>
                      on one of your listings. Log in to review and respond.
                    </p>

                    <!-- CTA -->
                    <table cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td style="border-radius:8px;background-color:#1ac98a;box-shadow:0 0 20px rgba(26,201,138,0.25);">
                          <a href="{{ $listingUrl }}" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:#081a10;text-decoration:none;letter-spacing:0.1px;font-family:Arial,sans-serif;">
                            View listing
                          </a>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>

              <!-- Footer -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="padding:20px 40px;background-color:#0d1929;border-top:1px solid #1a2840;border-radius:0 0 16px 16px;">
                    <p style="margin:0;font-size:12px;line-height:1.5;color:#3d5770;">
                      You&rsquo;re receiving this because you have an active listing on Mohi Portfolio.
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Bottom note -->
          <tr>
            <td align="center" style="padding:20px 0;">
              <p style="margin:0;font-size:11px;color:#253c55;font-family:Arial,sans-serif;">
                &copy; {{ date('Y') }} Mohi &middot;
                <a href="https://mohiebi.com" style="color:#253c55;text-decoration:none;">mohiebi.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
