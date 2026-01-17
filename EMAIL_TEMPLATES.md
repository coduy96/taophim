# Email Templates for Taophim.com

These templates have been pushed to the `email_templates` table in your Supabase database.
You can also copy-paste the HTML code below into the **Supabase Dashboard > Authentication > Email Templates** settings if you prefer to use the built-in Supabase SMTP service.

## 1. Confirm Account (Xác nhận đăng ký)
**Subject:** `Xác nhận đăng ký tài khoản Taophim.com`

```html
<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;line-height:1.6;color:#333}.container{max-width:600px;margin:0 auto;padding:20px}.header{text-align:center;margin-bottom:30px}.logo{font-size:24px;font-weight:bold;color:#000;text-decoration:none}.content{background:#ffffff;padding:30px;border-radius:8px;border:1px solid #e5e5e5}.button{display:inline-block;background-color:#000000;color:#ffffff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:500;margin-top:20px}.footer{text-align:center;margin-top:30px;font-size:12px;color:#666}</style></head><body style="background-color:#f9fafb;margin:0;padding:20px"><div class="container"><div class="header"><a href="{{ .SiteURL }}" class="logo">Taophim.com</a></div><div class="content"><h2>Xác thực tài khoản của bạn</h2><p>Cảm ơn bạn đã đăng ký tài khoản tại Taophim.com. Để bắt đầu sử dụng dịch vụ, vui lòng xác nhận địa chỉ email của bạn bằng cách bấm vào nút bên dưới.</p><a href="{{ .ConfirmationURL }}" class="button">Xác nhận Email</a><p style="margin-top:20px;font-size:14px;color:#666">Nếu bạn không đăng ký tài khoản này, vui lòng bỏ qua email này.</p></div><div class="footer">&copy; 2024 Taophim.com. All rights reserved.</div></div></body></html>
```

## 2. Reset Password (Đặt lại mật khẩu)
**Subject:** `Đặt lại mật khẩu Taophim.com`

```html
<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;line-height:1.6;color:#333}.container{max-width:600px;margin:0 auto;padding:20px}.header{text-align:center;margin-bottom:30px}.logo{font-size:24px;font-weight:bold;color:#000;text-decoration:none}.content{background:#ffffff;padding:30px;border-radius:8px;border:1px solid #e5e5e5}.button{display:inline-block;background-color:#000000;color:#ffffff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:500;margin-top:20px}.footer{text-align:center;margin-top:30px;font-size:12px;color:#666}</style></head><body style="background-color:#f9fafb;margin:0;padding:20px"><div class="container"><div class="header"><a href="{{ .SiteURL }}" class="logo">Taophim.com</a></div><div class="content"><h2>Đặt lại mật khẩu</h2><p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Bấm vào nút bên dưới để tạo mật khẩu mới.</p><a href="{{ .ConfirmationURL }}" class="button">Đặt lại mật khẩu</a><p style="margin-top:20px;font-size:14px;color:#666">Nếu bạn không yêu cầu thay đổi mật khẩu, tài khoản của bạn vẫn an toàn, hãy bỏ qua email này.</p></div><div class="footer">&copy; 2024 Taophim.com. All rights reserved.</div></div></body></html>
```

## 3. Magic Link (Đăng nhập không mật khẩu)
**Subject:** `Đăng nhập vào Taophim.com`

```html
<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;line-height:1.6;color:#333}.container{max-width:600px;margin:0 auto;padding:20px}.header{text-align:center;margin-bottom:30px}.logo{font-size:24px;font-weight:bold;color:#000;text-decoration:none}.content{background:#ffffff;padding:30px;border-radius:8px;border:1px solid #e5e5e5}.button{display:inline-block;background-color:#000000;color:#ffffff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:500;margin-top:20px}.footer{text-align:center;margin-top:30px;font-size:12px;color:#666}</style></head><body style="background-color:#f9fafb;margin:0;padding:20px"><div class="container"><div class="header"><a href="{{ .SiteURL }}" class="logo">Taophim.com</a></div><div class="content"><h2>Đăng nhập không cần mật khẩu</h2><p>Bấm vào nút bên dưới để đăng nhập ngay vào tài khoản của bạn.</p><a href="{{ .ConfirmationURL }}" class="button">Đăng nhập ngay</a><p style="margin-top:20px;font-size:14px;color:#666">Link này chỉ có hiệu lực trong thời gian ngắn.</p></div><div class="footer">&copy; 2024 Taophim.com. All rights reserved.</div></div></body></html>
```

## 4. Invite User (Lời mời)
**Subject:** `Bạn được mời tham gia Taophim.com`

```html
<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;line-height:1.6;color:#333}.container{max-width:600px;margin:0 auto;padding:20px}.header{text-align:center;margin-bottom:30px}.logo{font-size:24px;font-weight:bold;color:#000;text-decoration:none}.content{background:#ffffff;padding:30px;border-radius:8px;border:1px solid #e5e5e5}.button{display:inline-block;background-color:#000000;color:#ffffff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:500;margin-top:20px}.footer{text-align:center;margin-top:30px;font-size:12px;color:#666}</style></head><body style="background-color:#f9fafb;margin:0;padding:20px"><div class="container"><div class="header"><a href="{{ .SiteURL }}" class="logo">Taophim.com</a></div><div class="content"><h2>Lời mời tham gia</h2><p>Bạn đã nhận được lời mời tham gia đội ngũ tại Taophim.com.</p><a href="{{ .ConfirmationURL }}" class="button">Tham gia ngay</a><p style="margin-top:20px;font-size:14px;color:#666">Nếu bạn không mong đợi lời mời này, vui lòng bỏ qua.</p></div><div class="footer">&copy; 2024 Taophim.com. All rights reserved.</div></div></body></html>
```

## 5. Change Email (Thay đổi Email)
**Subject:** `Xác nhận thay đổi Email tại Taophim.com`

```html
<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;line-height:1.6;color:#333}.container{max-width:600px;margin:0 auto;padding:20px}.header{text-align:center;margin-bottom:30px}.logo{font-size:24px;font-weight:bold;color:#000;text-decoration:none}.content{background:#ffffff;padding:30px;border-radius:8px;border:1px solid #e5e5e5}.button{display:inline-block;background-color:#000000;color:#ffffff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:500;margin-top:20px}.footer{text-align:center;margin-top:30px;font-size:12px;color:#666}</style></head><body style="background-color:#f9fafb;margin:0;padding:20px"><div class="container"><div class="header"><a href="{{ .SiteURL }}" class="logo">Taophim.com</a></div><div class="content"><h2>Xác nhận thay đổi Email</h2><p>Chúng tôi nhận được yêu cầu thay đổi địa chỉ email cho tài khoản của bạn. Vui lòng xác nhận bằng cách bấm vào nút dưới đây.</p><a href="{{ .ConfirmationURL }}" class="button">Xác nhận Email mới</a><p style="margin-top:20px;font-size:14px;color:#666">Nếu bạn không yêu cầu thay đổi này, vui lòng liên hệ với hỗ trợ ngay lập tức.</p></div><div class="footer">&copy; 2024 Taophim.com. All rights reserved.</div></div></body></html>
```
