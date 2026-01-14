# payOS Embedded Form - Complete Guide

This page contains all possible combinations of frontend and backend implementations for the payOS Embedded Form integration.

## HTML + Node.js[​](#html--nodejs "Đường dẫn trực tiếp đến HTML + Node.js")

## Thiết lập Server[​](#thiết-lập-server "Đường dẫn trực tiếp đến Thiết lập Server")

### Cài đặt thư viện payOS cho NodeJS[​](#cài-đặt-thư-viện-payos-cho-nodejs "Đường dẫn trực tiếp đến Cài đặt thư viện payOS cho NodeJS")

```
npm install @payos/node
# hoặc
yarn add @payos/node
```

### Khởi tạo đối tượng `PayOS`[​](#khởi-tạo-đối-tượng-payos "Đường dẫn trực tiếp đến khởi-tạo-đối-tượng-payos")

Bạn cần khởi tạo đối tượng `PayOS` bằng `Client ID`, `API Key` và `Checksum Key` của kênh thanh toán mà bạn đã tạo trên trang [payOS](https://my.payos.vn).

### Tạo link thanh toán[​](#tạo-link-thanh-toán "Đường dẫn trực tiếp đến Tạo link thanh toán")

Link thanh toán kiểm soát những gì khách hàng của bạn nhìn thấy trên trang thanh toán, chẳng hạn như Tên sản phẩm, số lượng đặt, số tiền cũng như số tài khoản thụ hưởng, tên ngân hàng.

### Cung cấp returnUrl và cancelUrl[​](#cung-cấp-returnurl-và-cancelurl "Đường dẫn trực tiếp đến Cung cấp returnUrl và cancelUrl")

Chỉ định URL công khai cho trang thanh toán thành công và hủy thanh toán. Bạn cũng có thể xử lý cả trạng thái thành công và hủy với cùng một URL.

### Chuyển hướng tới trang thanh toán[​](#chuyển-hướng-tới-trang-thanh-toán "Đường dẫn trực tiếp đến Chuyển hướng tới trang thanh toán")

Sau khi tạo link thanh toán thành công, chuyển hướng khách hàng tới trang thanh toán trả về trong phản hồi.

## Xây dựng giao diện[​](#xây-dựng-giao-diện "Đường dẫn trực tiếp đến Xây dựng giao diện")

### Cài đặt thư viện payos-checkout bằng link cdn[​](#cài-đặt-thư-viện-payos-checkout-bằng-link-cdn "Đường dẫn trực tiếp đến Cài đặt thư viện payos-checkout bằng link cdn")

```
<script src="https://cdn.payos.vn/payos-checkout/v1/stable/payos-initialize.js"></script>
```

### Thêm nút tạo link thanh toán và thêm div nhúng giao diện thanh toán[​](#thêm-nút-tạo-link-thanh-toán-và-thêm-div-nhúng-giao-diện-thanh-toán "Đường dẫn trực tiếp đến Thêm nút tạo link thanh toán và thêm div nhúng giao diện thanh toán")

Thêm 1 nút bấm tạo link thanh toán trên trang xem thông tin đơn hàng để gọi API tạo link thanh toán và 1 div có trường id riêng biệt được sử dụng để nhúng giao diện thanh toán trên trang web

### Khởi tạo config cho hook usePayOS[​](#khởi-tạo-config-cho-hook-usepayos "Đường dẫn trực tiếp đến Khởi tạo config cho hook usePayOS")

Có 3 trường bắt buộc phải khởi tạo:

* **RETURN\_URL**: url dẫn đến trang web khi thanh toán thành công.
* **ELEMENT\_ID**: id của 1 component mà bạn muốn nhúng giao diện thanh toán của payOS vào
* **CHECKOUT\_URL**: đường link dẫn đến giao diện thanh toán sẽ được nhúng vào trang web của bạn

Vì thực hiện giao diện thanh toán nhúng nên ta sẽ sử dụng thêm các property như sau:

* `embedded: true` để sử dụng giao diện nhúng
* **onSuccess(event)**: gọi hàm bạn truyền vào nếu như người dùng thực hiện thanh toán thành công

Thông tin chi tiết hơn tại: [payos-checkout](https://payos.vn/docs/sdks/front-end/script-js/)

### Thực hiện gọi hook usePayOS với config đã khởi tạo trước đó[​](#thực-hiện-gọi-hook-usepayos-với-config-đã-khởi-tạo-trước-đó "Đường dẫn trực tiếp đến Thực hiện gọi hook usePayOS với config đã khởi tạo trước đó")

usePayOS hook trả về 2 hàm **open()** và **exit()**.

## Chạy thử[​](#chạy-thử "Đường dẫn trực tiếp đến Chạy thử")

Chạy server của bạn và truy cập vào [`http://localhost:3030`](http://localhost:3030) để bắt đầu tạo link thanh toán.

```
npm start
```

### Mã nguồn[​](#mã-nguồn "Đường dẫn trực tiếp đến Mã nguồn")

* server.js
* index.html
* index.js

/server.js

```
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { PayOS } = require('@payos/node');

const app = express();
dotenv.config();
const payOS = new PayOS({
  clientId: process.env.PAYOS_CLIENT_ID,
  apiKey: process.env.PAYOS_API_KEY,
  checksumKey: process.env.PAYOS_CHECKSUM_KEY,
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/create-embedded-payment-link', async (req, res) => {
  const YOUR_DOMAIN = `http://localhost:3000/`;
  const body = {
    orderCode: Number(String(Date.now()).slice(-6)),
    amount: 10000,
    description: 'Thanh toan don hang',
    returnUrl: `${YOUR_DOMAIN}`,
    cancelUrl: `${YOUR_DOMAIN}`,
  };

  try {
    const paymentLinkResponse = await payOS.paymentRequests.create(body);

    res.send(paymentLinkResponse);
  } catch (error) {
    console.error(error);
    res.send('Something went error');
  }
});

app.listen(3030, function () {
  console.log(`Server is listening on port 3030`);
});
```

/public/index.html

```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tạo Link thanh toán</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body style="display: flex">
    <div style="padding-top: 10px; display: flex; flex-direction: column">
      <div
        style="border: 2px solid blue; border-radius: 10px; overflow: hidden"
      >
        <div id="content-container" style="padding: 10px">
          <p><strong>Tên sản phẩm:</strong> Mì tôm Hảo Hảo ly</p>
          <p><strong>Giá tiền:</strong> 2000 VNĐ</p>
          <p><strong>Số lượng:</strong> 1</p>
        </div>
        <div id="button-container">
          <button
            type="submit"
            id="create-payment-link-btn"
            style="
              width: 100%;
              background-color: blue;
              color: white;
              border: none;
              padding: 10px;
              font-size: 15px;
            "
          >
            Tạo Link thanh toán
          </button>
        </div>
      </div>
      <div id="embeded-payment-container" style="height: 350px"></div>
    </div>
  </body>
</html>
<script src="https://cdn.payos.vn/payos-checkout/v1/stable/payos-initialize.js"></script>
<script src="index.js"></script>
```

/public/index.js

```
/* eslint-disable no-undef */
const buttonContainer = document.getElementById("button-container");
const contentContainer = document.getElementById("content-container");
let isOpen = false;
let config = {
  RETURN_URL: window.location.href,
  ELEMENT_ID: "embeded-payment-container",
  CHECKOUT_URL: "",
  embedded: true,
  onSuccess: (event) => {
    contentContainer.innerHTML = `
        <div style="padding-top: 20px; padding-bottom:20px">
            Thanh toan thanh cong
        </div>
    `;
    buttonContainer.innerHTML = `
        <button
            type="submit"
            id="create-payment-link-btn"
            style="
            width: 100%;
            background-color: blue;
            color: white;
            border: none;
            padding: 10px;
            font-size: 15px;
            "
        >
            Quay lại trang thanh toán
        </button>
    `;
  },
};
buttonContainer.addEventListener("click", async (event) => {
  if (isOpen) {
    const { exit } = PayOSCheckout.usePayOS(config);
    exit();
    contentContainer.innerHTML = `
        <p><strong>Tên sản phẩm:</strong> Mì tôm Hảo Hảo ly</p>
        <p><strong>Giá tiền:</strong> 2000 VNĐ</p>
        <p><strong>Số lượng:</strong> 1</p>
    `;
  } else {
    const checkoutUrl = await getPaymentLink();
    config = {
      ...config,
      CHECKOUT_URL: checkoutUrl,
    };
    const { open } = PayOSCheckout.usePayOS(config);
    open();
  }
  isOpen = !isOpen;
  changeButton();
});

const getPaymentLink = async () => {
  const response = await fetch(
    "http://localhost:3030/create-embedded-payment-link",
    {
      method: "POST",
    }
  );
  if (!response.ok) {
    console.log("server doesn't response!");
  }
  const result = await response.json();
  return result.checkoutUrl;
};

const changeButton = () => {
  if (isOpen) {
    buttonContainer.innerHTML = `
        <button
            type="submit"
            id="create-payment-link-btn"
            style="
            width: 100%;
            background-color: gray;
            color: white;
            border: none;
            padding: 10px;
            font-size: 15px;
            "
        >
            Đóng link thanh toán
        </button>
      `;
  } else {
    buttonContainer.innerHTML = `
        <button
            type="submit"
            id="create-payment-link-btn"
            style="
                width: 100%;
                background-color: blue;
                color: white;
                border: none;
                padding: 10px;
                font-size: 15px;
            "
            >
            Tạo Link thanh toán
        </button> 
    `;
  }
};
```

## HTML + PHP[​](#html--php "Đường dẫn trực tiếp đến HTML + PHP")

## Thiết lập Server[​](#thiết-lập-server "Đường dẫn trực tiếp đến Thiết lập Server")

### Cài đặt thư viện payOS cho PHP[​](#cài-đặt-thư-viện-payos-cho-php "Đường dẫn trực tiếp đến Cài đặt thư viện payOS cho PHP")

```
composer require payos/payos
```

### Khởi tạo đối tượng `PayOS`[​](#khởi-tạo-đối-tượng-payos "Đường dẫn trực tiếp đến khởi-tạo-đối-tượng-payos")

Bạn cần khởi tạo đối tượng `PayOS` bằng `Client ID`, `API Key` và `Checksum Key` của kênh thanh toán mà bạn đã tạo trên trang [payOS](https://my.payos.vn).

### Tạo link thanh toán[​](#tạo-link-thanh-toán "Đường dẫn trực tiếp đến Tạo link thanh toán")

Link thanh toán kiểm soát những gì khách hàng của bạn nhìn thấy trên trang thanh toán, chẳng hạn như Tên sản phẩm, số lượng đặt, số tiền cũng như số tài khoản thụ hưởng, tên ngân hàng.

### Cung cấp returnUrl và cancelUrl[​](#cung-cấp-returnurl-và-cancelurl "Đường dẫn trực tiếp đến Cung cấp returnUrl và cancelUrl")

Chỉ định URL công khai cho trang thanh toán thành công và hủy thanh toán. Bạn cũng có thể xử lý cả trạng thái thành công và hủy với cùng một URL.

### Chuyển hướng tới trang thanh toán[​](#chuyển-hướng-tới-trang-thanh-toán "Đường dẫn trực tiếp đến Chuyển hướng tới trang thanh toán")

Sau khi tạo link thanh toán thành công, chuyển hướng khách hàng tới trang thanh toán trả về trong phản hồi.

## Xây dựng giao diện[​](#xây-dựng-giao-diện "Đường dẫn trực tiếp đến Xây dựng giao diện")

### Cài đặt thư viện payos-checkout bằng link cdn[​](#cài-đặt-thư-viện-payos-checkout-bằng-link-cdn "Đường dẫn trực tiếp đến Cài đặt thư viện payos-checkout bằng link cdn")

```
<script src="https://cdn.payos.vn/payos-checkout/v1/stable/payos-initialize.js"></script>
```

### Thêm nút tạo link thanh toán và thêm div nhúng giao diện thanh toán[​](#thêm-nút-tạo-link-thanh-toán-và-thêm-div-nhúng-giao-diện-thanh-toán "Đường dẫn trực tiếp đến Thêm nút tạo link thanh toán và thêm div nhúng giao diện thanh toán")

Thêm 1 nút bấm tạo link thanh toán trên trang xem thông tin đơn hàng để gọi API tạo link thanh toán và 1 div có trường id riêng biệt được sử dụng để nhúng giao diện thanh toán trên trang web

### Khởi tạo config cho hook usePayOS[​](#khởi-tạo-config-cho-hook-usepayos "Đường dẫn trực tiếp đến Khởi tạo config cho hook usePayOS")

Có 3 trường bắt buộc phải khởi tạo:

* **RETURN\_URL**: url dẫn đến trang web khi thanh toán thành công.
* **ELEMENT\_ID**: id của 1 component mà bạn muốn nhúng giao diện thanh toán của payOS vào
* **CHECKOUT\_URL**: đường link dẫn đến giao diện thanh toán sẽ được nhúng vào trang web của bạn

Vì thực hiện giao diện thanh toán nhúng nên ta sẽ sử dụng thêm các property như sau:

* `embedded: true` để sử dụng giao diện nhúng
* **onSuccess(event)**: gọi hàm bạn truyền vào nếu như người dùng thực hiện thanh toán thành công

Thông tin chi tiết hơn tại: [payos-checkout](https://payos.vn/docs/sdks/front-end/script-js/)

### Thực hiện gọi hook usePayOS với config đã khởi tạo trước đó[​](#thực-hiện-gọi-hook-usepayos-với-config-đã-khởi-tạo-trước-đó "Đường dẫn trực tiếp đến Thực hiện gọi hook usePayOS với config đã khởi tạo trước đó")

usePayOS hook trả về 2 hàm **open()** và **exit()**.

## Chạy thử[​](#chạy-thử "Đường dẫn trực tiếp đến Chạy thử")

Chạy server của bạn và truy cập vào [`http://localhost:3030`](http://localhost:3030) để bắt đầu tạo link thanh toán.

```
php -S localhost:3030 --docroot=public
```

### Mã nguồn[​](#mã-nguồn-1 "Đường dẫn trực tiếp đến Mã nguồn")

* checkout.php
* index.html
* index.js

/checkout.php

```
<?php

require_once  '../vendor/autoload.php';
require_once '../payos_secrets.php';

use PayOS\PayOS;

$payOS = new PayOS(
    clientId: $payOSClientId,
    apiKey: $payOSApiKey,
    checksumKey: $payOSChecksumKey
);

$YOUR_DOMAIN = 'http://localhost:3030/';

$data = [
    "orderCode" => intval(substr(strval(microtime(true) * 10000), -6)),
    "amount" => 2000,
    "description" => "Thanh toán đơn hàng",
    "returnUrl" => $YOUR_DOMAIN,
    "cancelUrl" => $YOUR_DOMAIN
];

$response = $payOS->paymentRequests->create($data);
$checkoutUrl = $response['checkoutUrl'];
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>PayOS Checkout</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="style.css" />
    <script src="https://cdn.payos.vn/payos-checkout/v1/stable/payos-initialize.js"></script>
</head>

<body>
    <div class="main-box">
        <div class="checkout">
            <div class="product">
                <p><strong>Tên sản phẩm:</strong> Mì tôm Hảo Hảo ly</p>
                <p><strong>Giá tiền:</strong> 2000 VNĐ</p>
                <p><strong>Số lượng:</strong> 1</p>
            </div>
            <button id="create-payment-link-btn">Đóng thanh toán</button>
        </div>
        <div id="embedded-payment-container" style="width:400px;height:400px;max-width:100%;margin:30px auto 0 auto;"></div>
    </div>
    <script>
        let payosInstance = null;
        const config = {
            RETURN_URL: "<?php echo $YOUR_DOMAIN; ?>",
            ELEMENT_ID: "embedded-payment-container",
            CHECKOUT_URL: "<?php echo $checkoutUrl; ?>",
            embedded: true,
            onSuccess: function(event) {
                document.querySelector('.main-box').innerHTML = '<h2>Thanh toán thành công!</h2>';
                document.getElementById('embedded-payment-container').innerHTML = '';
                document.getElementById('create-payment-link-btn').style.display = 'none';
            }
        };
        window.addEventListener('DOMContentLoaded', function() {
            payosInstance = PayOSCheckout.usePayOS(config);
            payosInstance.open();
            document.getElementById('create-payment-link-btn').style.display = 'block';
            document.getElementById('create-payment-link-btn').onclick = function() {
                if (payosInstance) payosInstance.exit();
                document.getElementById('embedded-payment-container').innerHTML = '';
                this.style.display = 'none';
                window.location.href = '/';
            };
        });
    </script>
</body>

</html>
```

/public/index.html

```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tạo Link thanh toán</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body style="display: flex">
    <div style="padding-top: 10px; display: flex; flex-direction: column">
      <div
        style="border: 2px solid blue; border-radius: 10px; overflow: hidden"
      >
        <div id="content-container" style="padding: 10px">
          <p><strong>Tên sản phẩm:</strong> Mì tôm Hảo Hảo ly</p>
          <p><strong>Giá tiền:</strong> 2000 VNĐ</p>
          <p><strong>Số lượng:</strong> 1</p>
        </div>
        <div id="button-container">
          <button
            type="submit"
            id="create-payment-link-btn"
            style="
              width: 100%;
              background-color: blue;
              color: white;
              border: none;
              padding: 10px;
              font-size: 15px;
            "
          >
            Tạo Link thanh toán
          </button>
        </div>
      </div>
      <div id="embeded-payment-container" style="height: 350px"></div>
    </div>
  </body>
</html>
<script src="https://cdn.payos.vn/payos-checkout/v1/stable/payos-initialize.js"></script>
<script src="index.js"></script>
```

/public/index.js

```
/* eslint-disable no-undef */
const buttonContainer = document.getElementById("button-container");
const contentContainer = document.getElementById("content-container");
let isOpen = false;
let config = {
  RETURN_URL: window.location.href,
  ELEMENT_ID: "embeded-payment-container",
  CHECKOUT_URL: "",
  embedded: true,
  onSuccess: (event) => {
    contentContainer.innerHTML = `
        <div style="padding-top: 20px; padding-bottom:20px">
            Thanh toan thanh cong
        </div>
    `;
    buttonContainer.innerHTML = `
        <button
            type="submit"
            id="create-payment-link-btn"
            style="
            width: 100%;
            background-color: blue;
            color: white;
            border: none;
            padding: 10px;
            font-size: 15px;
            "
        >
            Quay lại trang thanh toán
        </button>
    `;
  },
};
buttonContainer.addEventListener("click", async (event) => {
  if (isOpen) {
    const { exit } = PayOSCheckout.usePayOS(config);
    exit();
    contentContainer.innerHTML = `
        <p><strong>Tên sản phẩm:</strong> Mì tôm Hảo Hảo ly</p>
        <p><strong>Giá tiền:</strong> 2000 VNĐ</p>
        <p><strong>Số lượng:</strong> 1</p>
    `;
  } else {
    const checkoutUrl = await getPaymentLink();
    config = {
      ...config,
      CHECKOUT_URL: checkoutUrl,
    };
    const { open } = PayOSCheckout.usePayOS(config);
    open();
  }
  isOpen = !isOpen;
  changeButton();
});

const getPaymentLink = async () => {
  const response = await fetch(
    "http://localhost:3030/create-embedded-payment-link",
    {
      method: "POST",
    }
  );
  if (!response.ok) {
    console.log("server doesn't response!");
  }
  const result = await response.json();
  return result.checkoutUrl;
};

const changeButton = () => {
  if (isOpen) {
    buttonContainer.innerHTML = `
        <button
            type="submit"
            id="create-payment-link-btn"
            style="
            width: 100%;
            background-color: gray;
            color: white;
            border: none;
            padding: 10px;
            font-size: 15px;
            "
        >
            Đóng link thanh toán
        </button>
      `;
  } else {
    buttonContainer.innerHTML = `
        <button
            type="submit"
            id="create-payment-link-btn"
            style="
                width: 100%;
                background-color: blue;
                color: white;
                border: none;
                padding: 10px;
                font-size: 15px;
            "
            >
            Tạo Link thanh toán
        </button> 
    `;
  }
};
```

## HTML + Python[​](#html--python "Đường dẫn trực tiếp đến HTML + Python")

## Thiết lập Server[​](#thiết-lập-server "Đường dẫn trực tiếp đến Thiết lập Server")

### Cài đặt thư viện payOS cho Python[​](#cài-đặt-thư-viện-payos-cho-python "Đường dẫn trực tiếp đến Cài đặt thư viện payOS cho Python")

```
pip install payos
```

### Khởi tạo đối tượng `PayOS`[​](#khởi-tạo-đối-tượng-payos "Đường dẫn trực tiếp đến khởi-tạo-đối-tượng-payos")

Bạn cần khởi tạo đối tượng `PayOS` bằng `Client ID`, `API Key` và `Checksum Key` của kênh thanh toán mà bạn đã tạo trên trang [payOS](https://my.payos.vn).

### Tạo link thanh toán[​](#tạo-link-thanh-toán "Đường dẫn trực tiếp đến Tạo link thanh toán")

Link thanh toán kiểm soát những gì khách hàng của bạn nhìn thấy trên trang thanh toán, chẳng hạn như Tên sản phẩm, số lượng đặt, số tiền cũng như số tài khoản thụ hưởng, tên ngân hàng.

### Cung cấp returnUrl và cancelUrl[​](#cung-cấp-returnurl-và-cancelurl "Đường dẫn trực tiếp đến Cung cấp returnUrl và cancelUrl")

Chỉ định URL công khai cho trang thanh toán thành công và hủy thanh toán. Bạn cũng có thể xử lý cả trạng thái thành công và hủy với cùng một URL.

### Chuyển hướng tới trang thanh toán[​](#chuyển-hướng-tới-trang-thanh-toán "Đường dẫn trực tiếp đến Chuyển hướng tới trang thanh toán")

Sau khi tạo link thanh toán thành công, chuyển hướng khách hàng tới trang thanh toán trả về trong phản hồi.

## Xây dựng giao diện[​](#xây-dựng-giao-diện "Đường dẫn trực tiếp đến Xây dựng giao diện")

### Cài đặt thư viện payos-checkout bằng link cdn[​](#cài-đặt-thư-viện-payos-checkout-bằng-link-cdn "Đường dẫn trực tiếp đến Cài đặt thư viện payos-checkout bằng link cdn")

```
<script src="https://cdn.payos.vn/payos-checkout/v1/stable/payos-initialize.js"></script>
```

### Thêm nút tạo link thanh toán và thêm div nhúng giao diện thanh toán[​](#thêm-nút-tạo-link-thanh-toán-và-thêm-div-nhúng-giao-diện-thanh-toán "Đường dẫn trực tiếp đến Thêm nút tạo link thanh toán và thêm div nhúng giao diện thanh toán")

Thêm 1 nút bấm tạo link thanh toán trên trang xem thông tin đơn hàng để gọi API tạo link thanh toán và 1 div có trường id riêng biệt được sử dụng để nhúng giao diện thanh toán trên trang web

### Khởi tạo config cho hook usePayOS[​](#khởi-tạo-config-cho-hook-usepayos "Đường dẫn trực tiếp đến Khởi tạo config cho hook usePayOS")

Có 3 trường bắt buộc phải khởi tạo:

* **RETURN\_URL**: url dẫn đến trang web khi thanh toán thành công.
* **ELEMENT\_ID**: id của 1 component mà bạn muốn nhúng giao diện thanh toán của payOS vào
* **CHECKOUT\_URL**: đường link dẫn đến giao diện thanh toán sẽ được nhúng vào trang web của bạn

Vì thực hiện giao diện thanh toán nhúng nên ta sẽ sử dụng thêm các property như sau:

* `embedded: true` để sử dụng giao diện nhúng
* **onSuccess(event)**: gọi hàm bạn truyền vào nếu như người dùng thực hiện thanh toán thành công

Thông tin chi tiết hơn tại: [payos-checkout](https://payos.vn/docs/sdks/front-end/script-js/)

### Thực hiện gọi hook usePayOS với config đã khởi tạo trước đó[​](#thực-hiện-gọi-hook-usepayos-với-config-đã-khởi-tạo-trước-đó "Đường dẫn trực tiếp đến Thực hiện gọi hook usePayOS với config đã khởi tạo trước đó")

usePayOS hook trả về 2 hàm **open()** và **exit()**.

## Chạy thử[​](#chạy-thử "Đường dẫn trực tiếp đến Chạy thử")

Chạy server của bạn và truy cập vào [`http://localhost:3030`](http://localhost:3030) để bắt đầu tạo link thanh toán.

```
flask run --port=3030
```

### Mã nguồn[​](#mã-nguồn-2 "Đường dẫn trực tiếp đến Mã nguồn")

* server.py
* index.html
* index.js

/server.py

```
"""
server.py
PayOS Sample.
Python 3.6 or newer required.
"""

import time

from flask import Flask, send_from_directory
from payos import CreatePaymentLinkRequest, PayOS

# Keep your PayOS key protected by including it by an environment variable
client_id = "YOUR_CLIENT_ID"
api_key = "YOUR_API_KEY"
checksum_key = "YOUR_CHECKSUM_KEY"

payos = PayOS(client_id, api_key, checksum_key)

app = Flask(__name__, static_url_path="", static_folder="public")

YOUR_DOMAIN = "http://localhost:3030/"


@app.route("/")
def index():
    return send_from_directory("public", "index.html")


@app.route("/create-embedded-payment-link", methods=["POST"])
def create_payment_link():
    try:
        payment_data = CreatePaymentLinkRequest(
            orderCode=int(time.time()),
            amount=2000,
            description="Thanh toan don hang",
            cancelUrl=YOUR_DOMAIN,
            returnUrl=YOUR_DOMAIN,
        )
        payment_link_response = payos.payment_requests.create(payment_data)
    except Exception as e:
        return str(e)

    return payment_link_response.to_json()


if __name__ == "__main__":
    app.run(port=3030)
```

/public/index.html

```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tạo Link thanh toán</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body style="display: flex">
    <div style="padding-top: 10px; display: flex; flex-direction: column">
      <div
        style="border: 2px solid blue; border-radius: 10px; overflow: hidden"
      >
        <div id="content-container" style="padding: 10px">
          <p><strong>Tên sản phẩm:</strong> Mì tôm Hảo Hảo ly</p>
          <p><strong>Giá tiền:</strong> 2000 VNĐ</p>
          <p><strong>Số lượng:</strong> 1</p>
        </div>
        <div id="button-container">
          <button
            type="submit"
            id="create-payment-link-btn"
            style="
              width: 100%;
              background-color: blue;
              color: white;
              border: none;
              padding: 10px;
              font-size: 15px;
            "
          >
            Tạo Link thanh toán
          </button>
        </div>
      </div>
      <div id="embeded-payment-container" style="height: 350px"></div>
    </div>
  </body>
</html>
<script src="https://cdn.payos.vn/payos-checkout/v1/stable/payos-initialize.js"></script>
<script src="index.js"></script>
```

/public/index.js

```
/* eslint-disable no-undef */
const buttonContainer = document.getElementById("button-container");
const contentContainer = document.getElementById("content-container");
let isOpen = false;
let config = {
  RETURN_URL: window.location.href,
  ELEMENT_ID: "embeded-payment-container",
  CHECKOUT_URL: "",
  embedded: true,
  onSuccess: (event) => {
    contentContainer.innerHTML = `
        <div style="padding-top: 20px; padding-bottom:20px">
            Thanh toan thanh cong
        </div>
    `;
    buttonContainer.innerHTML = `
        <button
            type="submit"
            id="create-payment-link-btn"
            style="
            width: 100%;
            background-color: blue;
            color: white;
            border: none;
            padding: 10px;
            font-size: 15px;
            "
        >
            Quay lại trang thanh toán
        </button>
    `;
  },
};
buttonContainer.addEventListener("click", async (event) => {
  if (isOpen) {
    const { exit } = PayOSCheckout.usePayOS(config);
    exit();
    contentContainer.innerHTML = `
        <p><strong>Tên sản phẩm:</strong> Mì tôm Hảo Hảo ly</p>
        <p><strong>Giá tiền:</strong> 2000 VNĐ</p>
        <p><strong>Số lượng:</strong> 1</p>
    `;
  } else {
    const checkoutUrl = await getPaymentLink();
    config = {
      ...config,
      CHECKOUT_URL: checkoutUrl,
    };
    const { open } = PayOSCheckout.usePayOS(config);
    open();
  }
  isOpen = !isOpen;
  changeButton();
});

const getPaymentLink = async () => {
  const response = await fetch(
    "http://localhost:3030/create-embedded-payment-link",
    {
      method: "POST",
    }
  );
  if (!response.ok) {
    console.log("server doesn't response!");
  }
  const result = await response.json();
  return result.checkoutUrl;
};

const changeButton = () => {
  if (isOpen) {
    buttonContainer.innerHTML = `
        <button
            type="submit"
            id="create-payment-link-btn"
            style="
            width: 100%;
            background-color: gray;
            color: white;
            border: none;
            padding: 10px;
            font-size: 15px;
            "
        >
            Đóng link thanh toán
        </button>
      `;
  } else {
    buttonContainer.innerHTML = `
        <button
            type="submit"
            id="create-payment-link-btn"
            style="
                width: 100%;
                background-color: blue;
                color: white;
                border: none;
                padding: 10px;
                font-size: 15px;
            "
            >
            Tạo Link thanh toán
        </button> 
    `;
  }
};
```

## HTML + Go[​](#html--go "Đường dẫn trực tiếp đến HTML + Go")

## Thiết lập Server[​](#thiết-lập-server "Đường dẫn trực tiếp đến Thiết lập Server")

### Cài đặt thư viện payOS cho Go[​](#cài-đặt-thư-viện-payos-cho-go "Đường dẫn trực ti��ếp đến Cài đặt thư viện payOS cho Go")

```
go get github.com/payOSHQ/payos-lib-golang/v2
```

### Khởi tạo đối tượng `PayOS`[​](#khởi-tạo-đối-tượng-payos "Đường dẫn trực tiếp đến khởi-tạo-đối-tượng-payos")

Bạn cần khởi tạo đối tượng `PayOS` bằng `Client ID`, `API Key` và `Checksum Key` của kênh thanh toán mà bạn đã tạo trên trang [payOS](https://my.payos.vn).

### Tạo link thanh toán[​](#tạo-link-thanh-toán "Đường dẫn trực tiếp đến Tạo link thanh toán")

Link thanh toán kiểm soát những gì khách hàng của bạn nhìn thấy trên trang thanh toán, chẳng hạn như Tên sản phẩm, số lượng đặt, số tiền cũng như số tài khoản thụ hưởng, tên ngân hàng.

### Cung cấp returnUrl và cancelUrl[​](#cung-cấp-returnurl-và-cancelurl "Đường dẫn trực tiếp đến Cung cấp returnUrl và cancelUrl")

Chỉ định URL công khai cho trang thanh toán thành công và hủy thanh toán. Bạn cũng có thể xử lý cả trạng thái thành công và hủy với cùng một URL.

### Chuyển hướng tới trang thanh toán[​](#chuyển-hướng-tới-trang-thanh-toán "Đường dẫn trực tiếp đến Chuyển hướng tới trang thanh toán")

Sau khi tạo link thanh toán thành công, chuyển hướng khách hàng tới trang thanh toán trả về trong phản hồi.

## Xây dựng giao diện[​](#xây-dựng-giao-diện "Đường dẫn trực tiếp đến Xây dựng giao diện")

### Cài đặt thư viện payos-checkout bằng link cdn[​](#cài-đặt-thư-viện-payos-checkout-bằng-link-cdn "Đường dẫn trực tiếp đến Cài đặt thư viện payos-checkout bằng link cdn")

```
<script src="https://cdn.payos.vn/payos-checkout/v1/stable/payos-initialize.js"></script>
```

### Thêm nút tạo link thanh toán và thêm div nhúng giao diện thanh toán[​](#thêm-nút-tạo-link-thanh-toán-và-thêm-div-nhúng-giao-diện-thanh-toán "Đường dẫn trực tiếp đến Thêm nút tạo link thanh toán và thêm div nhúng giao diện thanh toán")

Thêm 1 nút bấm tạo link thanh toán trên trang xem thông tin đơn hàng để gọi API tạo link thanh toán và 1 div có trường id riêng biệt được sử dụng để nhúng giao diện thanh toán trên trang web

### Khởi tạo config cho hook usePayOS[​](#khởi-tạo-config-cho-hook-usepayos "Đường dẫn trực tiếp đến Khởi tạo config cho hook usePayOS")

Có 3 trường bắt buộc phải khởi tạo:

* **RETURN\_URL**: url dẫn đến trang web khi thanh toán thành công.
* **ELEMENT\_ID**: id của 1 component mà bạn muốn nhúng giao diện thanh toán của payOS vào
* **CHECKOUT\_URL**: đường link dẫn đến giao diện thanh toán sẽ được nhúng vào trang web của bạn

Vì thực hiện giao diện thanh toán nhúng nên ta sẽ sử dụng thêm các property như sau:

* `embedded: true` để sử dụng giao diện nhúng
* **onSuccess(event)**: gọi hàm bạn truyền vào nếu như người dùng thực hiện thanh toán thành công

Thông tin chi tiết hơn tại: [payos-checkout](https://payos.vn/docs/sdks/front-end/script-js/)

### Thực hiện gọi hook usePayOS với config đã khởi tạo trước đó[​](#thực-hiện-gọi-hook-usepayos-với-config-đã-khởi-tạo-trước-đó "Đường dẫn trực tiếp đến Thực hiện gọi hook usePayOS với config đã khởi tạo trước đó")

usePayOS hook trả về 2 hàm **open()** và **exit()**.

## Chạy thử[​](#chạy-thử "Đường dẫn trực tiếp đến Chạy thử")

Chạy server của bạn và truy cập vào [`http://localhost:3030`](http://localhost:3030) để bắt đầu tạo link thanh toán.

```
go run server.go
```

### Mã nguồn[​](#mã-nguồn-3 "Đường dẫn trực tiếp đến Mã nguồn")

* server.go
* index.html
* index.js

/server.go

```
package main

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/payOSHQ/payos-lib-golang/v2"
)

var payOSClient *payos.PayOS

func main() {
	// Keep your PayOS key protected by including it by an env variable
	const clientId = "YOUR_CLIENT_ID"
	const apiKey = "YOUR_API_KEY"
	const checksumKey = "YOUR_CHECKSUM_KEY"

	var err error
	payOSClient, err = payos.NewPayOS(&payos.PayOSOptions{
		ClientID:    clientId,
		APIKey:      apiKey,
		ChecksumKey: checksumKey,
	})
	if err != nil {
		log.Fatalf("Failed to create PayOS client: %v", err)
	}

	http.Handle("/", http.FileServer(http.Dir("public")))
	http.HandleFunc("/create-embedded-payment-link", createPaymentLink)
	addr := "localhost:3030"
	log.Printf("Listening on %s", addr)
	log.Fatal(http.ListenAndServe(addr, nil))
}

func createPaymentLink(w http.ResponseWriter, r *http.Request) {
	domain := "http://localhost:3030/"
	paymentLinkRequest := payos.CreatePaymentLinkRequest{
		OrderCode:   time.Now().UnixNano() / int64(time.Millisecond),
		Amount:      2000,
		Description: "Thanh toan don hang",
		CancelUrl:   domain,
		ReturnUrl:   domain,
	}

	paymentLinkResponse, err := payOSClient.PaymentRequests.Create(r.Context(), &paymentLinkRequest)

	if err != nil {
		log.Printf("Create payment link failed: %v", err)
	}

	// Return paymentLinkResponse as JSON instead of redirect
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(paymentLinkResponse); err != nil {
		log.Printf("Failed to encode response: %v", err)
	}
}
```

/public/index.html

```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tạo Link thanh toán</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body style="display: flex">
    <div style="padding-top: 10px; display: flex; flex-direction: column">
      <div
        style="border: 2px solid blue; border-radius: 10px; overflow: hidden"
      >
        <div id="content-container" style="padding: 10px">
          <p><strong>Tên sản phẩm:</strong> Mì tôm Hảo Hảo ly</p>
          <p><strong>Giá tiền:</strong> 2000 VNĐ</p>
          <p><strong>Số lượng:</strong> 1</p>
        </div>
        <div id="button-container">
          <button
            type="submit"
            id="create-payment-link-btn"
            style="
              width: 100%;
              background-color: blue;
              color: white;
              border: none;
              padding: 10px;
              font-size: 15px;
            "
          >
            Tạo Link thanh toán
          </button>
        </div>
      </div>
      <div id="embeded-payment-container" style="height: 350px"></div>
    </div>
  </body>
</html>
<script src="https://cdn.payos.vn/payos-checkout/v1/stable/payos-initialize.js"></script>
<script src="index.js"></script>
```

/public/index.js

```
/* eslint-disable no-undef */
const buttonContainer = document.getElementById("button-container");
const contentContainer = document.getElementById("content-container");
let isOpen = false;
let config = {
  RETURN_URL: window.location.href,
  ELEMENT_ID: "embeded-payment-container",
  CHECKOUT_URL: "",
  embedded: true,
  onSuccess: (event) => {
    contentContainer.innerHTML = `
        <div style="padding-top: 20px; padding-bottom:20px">
            Thanh toan thanh cong
        </div>
    `;
    buttonContainer.innerHTML = `
        <button
            type="submit"
            id="create-payment-link-btn"
            style="
            width: 100%;
            background-color: blue;
            color: white;
            border: none;
            padding: 10px;
            font-size: 15px;
            "
        >
            Quay lại trang thanh toán
        </button>
    `;
  },
};
buttonContainer.addEventListener("click", async (event) => {
  if (isOpen) {
    const { exit } = PayOSCheckout.usePayOS(config);
    exit();
    contentContainer.innerHTML = `
        <p><strong>Tên sản phẩm:</strong> Mì tôm Hảo Hảo ly</p>
        <p><strong>Giá tiền:</strong> 2000 VNĐ</p>
        <p><strong>Số lượng:</strong> 1</p>
    `;
  } else {
    const checkoutUrl = await getPaymentLink();
    config = {
      ...config,
      CHECKOUT_URL: checkoutUrl,
    };
    const { open } = PayOSCheckout.usePayOS(config);
    open();
  }
  isOpen = !isOpen;
  changeButton();
});

const getPaymentLink = async () => {
  const response = await fetch(
    "http://localhost:3030/create-embedded-payment-link",
    {
      method: "POST",
    }
  );
  if (!response.ok) {
    console.log("server doesn't response!");
  }
  const result = await response.json();
  return result.checkoutUrl;
};

const changeButton = () => {
  if (isOpen) {
    buttonContainer.innerHTML = `
        <button
            type="submit"
            id="create-payment-link-btn"
            style="
            width: 100%;
            background-color: gray;
            color: white;
            border: none;
            padding: 10px;
            font-size: 15px;
            "
        >
            Đóng link thanh toán
        </button>
      `;
  } else {
    buttonContainer.innerHTML = `
        <button
            type="submit"
            id="create-payment-link-btn"
            style="
                width: 100%;
                background-color: blue;
                color: white;
                border: none;
                padding: 10px;
                font-size: 15px;
            "
            >
            Tạo Link thanh toán
        </button> 
    `;
  }
};
```

## HTML + .NET[​](#html--net "Đường dẫn trực tiếp đến HTML + .NET")

## Thiết lập Server[​](#thiết-lập-server "Đường dẫn trực tiếp đến Thiết lập Server")

### Cài đặt thư viện payOS cho .NET[​](#cài-đặt-thư-viện-payos-cho-net "Đường dẫn trực tiếp đến Cài đặt thư viện payOS cho .NET")

<!-- -->

* dotnet
* NuGet

```
dotnet add package payOS
```

```
Install-Package payOS
```

### Khởi tạo đối tượng `PayOS`[​](#khởi-tạo-đối-tượng-payos "Đường dẫn trực tiếp đến khởi-tạo-đối-tượng-payos")

Bạn cần khởi tạo đối tượng `PayOS` bằng `Client ID`, `API Key` và `Checksum Key` của kênh thanh toán mà bạn đã tạo trên trang [payOS](https://my.payos.vn).

### Tạo link thanh toán[​](#tạo-link-thanh-toán "Đường dẫn trực tiếp đến Tạo link thanh toán")

Link thanh toán kiểm soát những gì khách hàng của bạn nhìn thấy trên trang thanh toán, chẳng hạn như Tên sản phẩm, số lượng đặt, số tiền cũng như số tài khoản thụ hưởng, tên ngân hàng.

### Cung cấp returnUrl và cancelUrl[​](#cung-cấp-returnurl-và-cancelurl "Đường dẫn trực tiếp đến Cung cấp returnUrl và cancelUrl")

Chỉ định URL công khai cho trang thanh toán thành công và hủy thanh toán. Bạn cũng có thể xử lý cả trạng thái thành công và hủy với cùng một URL.

### Chuyển hướng tới trang thanh toán[​](#chuyển-hướng-tới-trang-thanh-toán "Đường dẫn trực tiếp đến Chuyển hướng tới trang thanh toán")

Sau khi tạo link thanh toán thành công, chuyển hướng khách hàng tới trang thanh toán trả về trong phản hồi.

## Xây dựng giao diện[​](#xây-dựng-giao-diện "Đường dẫn trực tiếp đến Xây dựng giao diện")

### Cài đặt thư viện payos-checkout bằng link cdn[​](#cài-đặt-thư-viện-payos-checkout-bằng-link-cdn "Đường dẫn trực tiếp đến Cài đặt thư viện payos-checkout bằng link cdn")

```
<script src="https://cdn.payos.vn/payos-checkout/v1/stable/payos-initialize.js"></script>
```

### Thêm nút tạo link thanh toán và thêm div nhúng giao diện thanh toán[​](#thêm-nút-tạo-link-thanh-toán-và-thêm-div-nhúng-giao-diện-thanh-toán "Đường dẫn trực tiếp đến Thêm nút tạo link thanh toán và thêm div nhúng giao diện thanh toán")

Thêm 1 nút bấm tạo link thanh toán trên trang xem thông tin đơn hàng để gọi API tạo link thanh toán và 1 div có trường id riêng biệt được sử dụng để nhúng giao diện thanh toán trên trang web

### Khởi tạo config cho hook usePayOS[​](#khởi-tạo-config-cho-hook-usepayos "Đường dẫn trực tiếp đến Khởi tạo config cho hook usePayOS")

Có 3 trường bắt buộc phải khởi tạo:

* **RETURN\_URL**: url dẫn đến trang web khi thanh toán thành công.
* **ELEMENT\_ID**: id của 1 component mà bạn muốn nhúng giao diện thanh toán của payOS vào
* **CHECKOUT\_URL**: đường link dẫn đến giao diện thanh toán sẽ được nhúng vào trang web của bạn

Vì thực hiện giao diện thanh toán nhúng nên ta sẽ sử dụng thêm các property như sau:

* `embedded: true` để sử dụng giao diện nhúng
* **onSuccess(event)**: gọi hàm bạn truyền vào nếu như người dùng thực hiện thanh toán thành công

Thông tin chi tiết hơn tại: [payos-checkout](https://payos.vn/docs/sdks/front-end/script-js/)

### Thực hiện gọi hook usePayOS với config đã khởi tạo trước đó[​](#thực-hiện-gọi-hook-usepayos-với-config-đã-khởi-tạo-trước-đó "Đường dẫn trực tiếp đến Thực hiện gọi hook usePayOS với config đã khởi tạo trước đó")

usePayOS hook trả về 2 hàm **open()** và **exit()**.

## Chạy thử[​](#chạy-thử "Đường dẫn trực tiếp đến Chạy thử")

Chạy server của bạn và truy cập vào [`http://localhost:3030`](http://localhost:3030) để bắt đầu tạo link thanh toán.

```
dotnet run
```

### Mã nguồn[​](#mã-nguồn-4 "Đường dẫn trực tiếp đến Mã nguồn")

* Server.cs
* index.html
* index.js

/Server.cs

```
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Mvc;
using PayOS;
using PayOS.Models;

namespace server.Controllers
{
    public class Program
    {
        public static void Main(string[] args)
        {
            WebHost.CreateDefaultBuilder(args)
              .UseUrls("http://localhost:3030/")
              .UseWebRoot("public")
              .UseStartup<Startup>()
              .Build()
              .Run();
        }
    }

    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
        }
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment()) app.UseDeveloperExceptionPage();
            app.UseRouting();
            app.UseStaticFiles();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapGet("/", context =>
                {
                    context.Response.Redirect("/index.html");
                    return Task.CompletedTask;
                });
            });
        }
    }

    [Route("create-embedded-payment-link")]
    [ApiController]
    public class CheckoutApiController : Controller
    {
        [HttpPost]
        public async Task<IActionResult> Create()
        {
            // Keep your PayOS key protected by including it by an env variable
            var clientId = "YOUR_CLIENT_ID";
            var apiKey = "YOUR_API_KEY";
            var checksumKey = "YOUR_CHECKSUM_KEY";

            var payOS = new PayOSClient(clientId, apiKey, checksumKey);

            var domain = "http://localhost:3030";

            var paymentLinkRequest = new CreatePaymentLinkRequest
            {
                OrderCode = int.Parse(DateTimeOffset.Now.ToString("ffffff")),
                Amount = 2000,
                Description = "Thanh toan don hang",
                ReturnUrl = domain,
                CancelUrl = domain
            };
            var response = await payOS.PaymentRequests.CreateAsync(paymentLinkRequest);

            return json(response);
        }
    }
}
```

/public/index.html

```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tạo Link thanh toán</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body style="display: flex">
    <div style="padding-top: 10px; display: flex; flex-direction: column">
      <div
        style="border: 2px solid blue; border-radius: 10px; overflow: hidden"
      >
        <div id="content-container" style="padding: 10px">
          <p><strong>Tên sản phẩm:</strong> Mì tôm Hảo Hảo ly</p>
          <p><strong>Giá tiền:</strong> 2000 VNĐ</p>
          <p><strong>Số lượng:</strong> 1</p>
        </div>
        <div id="button-container">
          <button
            type="submit"
            id="create-payment-link-btn"
            style="
              width: 100%;
              background-color: blue;
              color: white;
              border: none;
              padding: 10px;
              font-size: 15px;
            "
          >
            Tạo Link thanh toán
          </button>
        </div>
      </div>
      <div id="embeded-payment-container" style="height: 350px"></div>
    </div>
  </body>
</html>
<script src="https://cdn.payos.vn/payos-checkout/v1/stable/payos-initialize.js"></script>
<script src="index.js"></script>
```

/public/index.js

```
/* eslint-disable no-undef */
const buttonContainer = document.getElementById("button-container");
const contentContainer = document.getElementById("content-container");
let isOpen = false;
let config = {
  RETURN_URL: window.location.href,
  ELEMENT_ID: "embeded-payment-container",
  CHECKOUT_URL: "",
  embedded: true,
  onSuccess: (event) => {
    contentContainer.innerHTML = `
        <div style="padding-top: 20px; padding-bottom:20px">
            Thanh toan thanh cong
        </div>
    `;
    buttonContainer.innerHTML = `
        <button
            type="submit"
            id="create-payment-link-btn"
            style="
            width: 100%;
            background-color: blue;
            color: white;
            border: none;
            padding: 10px;
            font-size: 15px;
            "
        >
            Quay lại trang thanh toán
        </button>
    `;
  },
};
buttonContainer.addEventListener("click", async (event) => {
  if (isOpen) {
    const { exit } = PayOSCheckout.usePayOS(config);
    exit();
    contentContainer.innerHTML = `
        <p><strong>Tên sản phẩm:</strong> Mì tôm Hảo Hảo ly</p>
        <p><strong>Giá tiền:</strong> 2000 VNĐ</p>
        <p><strong>Số lượng:</strong> 1</p>
    `;
  } else {
    const checkoutUrl = await getPaymentLink();
    config = {
      ...config,
      CHECKOUT_URL: checkoutUrl,
    };
    const { open } = PayOSCheckout.usePayOS(config);
    open();
  }
  isOpen = !isOpen;
  changeButton();
});

const getPaymentLink = async () => {
  const response = await fetch(
    "http://localhost:3030/create-embedded-payment-link",
    {
      method: "POST",
    }
  );
  if (!response.ok) {
    console.log("server doesn't response!");
  }
  const result = await response.json();
  return result.checkoutUrl;
};

const changeButton = () => {
  if (isOpen) {
    buttonContainer.innerHTML = `
        <button
            type="submit"
            id="create-payment-link-btn"
            style="
            width: 100%;
            background-color: gray;
            color: white;
            border: none;
            padding: 10px;
            font-size: 15px;
            "
        >
            Đóng link thanh toán
        </button>
      `;
  } else {
    buttonContainer.innerHTML = `
        <button
            type="submit"
            id="create-payment-link-btn"
            style="
                width: 100%;
                background-color: blue;
                color: white;
                border: none;
                padding: 10px;
                font-size: 15px;
            "
            >
            Tạo Link thanh toán
        </button> 
    `;
  }
};
```

## HTML + Java[​](#html--java "Đường dẫn trực tiếp đến HTML + Java")

## Thiết lập Server[​](#thiết-lập-server "Đường dẫn trực tiếp đến Thiết lập Server")

### Cài đặt thư viện payOS cho Java[​](#cài-đặt-thư-viện-payos-cho-java "Đường dẫn trực tiếp đến Cài đặt thư viện payOS cho Java")

<!-- -->

* Maven
* Gradle

Thêm đoạn code sau vào POM và thay VERSION bằng phiên bản bạn muốn sử dụng.

```
<dependency>
  <groupId>vn.payos</groupId>
  <artifactId>payos-java</artifactId>
  <version>{VERSION}</version>
</dependency>
```

Thêm đoạn code sau vào build.gradle và thay VERSION bằng phiên bản bạn muốn sử dụng.

```
implementation 'vn.payos:payos-java:{VERSION}'
```

### Khởi tạo đối tượng `PayOS`[​](#khởi-tạo-đối-tượng-payos "Đường dẫn trực tiếp đến khởi-tạo-đối-tượng-payos")

Bạn cần khởi tạo đối tượng `PayOS` bằng `Client ID`, `API Key` và `Checksum Key` của kênh thanh toán mà bạn đã tạo trên trang [payOS](https://my.payos.vn).

### Tạo link thanh toán[​](#tạo-link-thanh-toán "Đường dẫn trực tiếp đến Tạo link thanh toán")

Link thanh toán kiểm soát những gì khách hàng của bạn nhìn thấy trên trang thanh toán, chẳng hạn như Tên sản phẩm, số lượng đặt, số tiền cũng như số tài khoản thụ hưởng, tên ngân hàng.

### Cung cấp returnUrl và cancelUrl[​](#cung-cấp-returnurl-và-cancelurl "Đường dẫn trực tiếp đến Cung cấp returnUrl và cancelUrl")

Chỉ định URL công khai cho trang thanh toán thành công và hủy thanh toán. Bạn cũng có thể xử lý cả trạng thái thành công và hủy với cùng một URL.

### Chuyển hướng tới trang thanh toán[​](#chuyển-hướng-tới-trang-thanh-toán "Đường dẫn trực tiếp đến Chuyển hướng tới trang thanh toán")

Sau khi tạo link thanh toán thành công, chuyển hướng khách hàng tới trang thanh toán trả về trong phản hồi.

## Xây dựng giao diện[​](#xây-dựng-giao-diện "Đường dẫn trực tiếp đến Xây dựng giao diện")

### Cài đặt thư viện payos-checkout bằng link cdn[​](#cài-đặt-thư-viện-payos-checkout-bằng-link-cdn "Đường dẫn trực tiếp đến Cài đặt thư viện payos-checkout bằng link cdn")

```
<script src="https://cdn.payos.vn/payos-checkout/v1/stable/payos-initialize.js"></script>
```

### Thêm nút tạo link thanh toán và thêm div nhúng giao diện thanh toán[​](#thêm-nút-tạo-link-thanh-toán-và-thêm-div-nhúng-giao-diện-thanh-toán "Đường dẫn trực tiếp đến Thêm nút tạo link thanh toán và thêm div nhúng giao diện thanh toán")

Thêm 1 nút bấm tạo link thanh toán trên trang xem thông tin đơn hàng để gọi API tạo link thanh toán và 1 div có trường id riêng biệt được sử dụng để nhúng giao diện thanh toán trên trang web

### Khởi tạo config cho hook usePayOS[​](#khởi-tạo-config-cho-hook-usepayos "Đường dẫn trực tiếp đến Khởi tạo config cho hook usePayOS")

Có 3 trường bắt buộc phải khởi tạo:

* **RETURN\_URL**: url dẫn đến trang web khi thanh toán thành công.
* **ELEMENT\_ID**: id của 1 component mà bạn muốn nhúng giao diện thanh toán của payOS vào
* **CHECKOUT\_URL**: đường link dẫn đến giao diện thanh toán sẽ được nhúng vào trang web của bạn

Vì thực hiện giao diện thanh toán nhúng nên ta sẽ sử dụng thêm các property như sau:

* `embedded: true` để sử dụng giao diện nhúng
* **onSuccess(event)**: gọi hàm bạn truyền vào nếu như người dùng thực hiện thanh toán thành công

Thông tin chi tiết hơn tại: [payos-checkout](https://payos.vn/docs/sdks/front-end/script-js/)

### Thực hiện gọi hook usePayOS với config đã khởi tạo trước đó[​](#thực-hiện-gọi-hook-usepayos-với-config-đã-khởi-tạo-trước-đó "Đường dẫn trực tiếp đến Thực hiện gọi hook usePayOS với config đã khởi tạo trước đó")

usePayOS hook trả về 2 hàm **open()** và **exit()**.

## Chạy thử[​](#chạy-thử "Đường dẫn trực tiếp đến Chạy thử")

Chạy server của bạn và truy cập vào [`http://localhost:3030`](http://localhost:3030) để bắt đầu tạo link thanh toán.

```
java -cp .\target\payos-payment-1.0-SNAPSHOT-jar-with-dependencies.jar vn.payos.sample.Server
```

### Mã nguồn[​](#mã-nguồn-5 "Đường dẫn trực tiếp đến Mã nguồn")

* Server.java
* pom.xml
* index.html
* index.js

/Server.java

```
package vn.payos.sample;

import static spark.Spark.port;
import static spark.Spark.post;
import static spark.Spark.staticFiles;

import java.nio.file.Paths;
import vn.payos.PayOS;
import vn.payos.model.v2.paymentRequests.CreatePaymentLinkRequest;
import vn.payos.model.v2.paymentRequests.CreatePaymentLinkResponse;

public class Server {
  public static void main(String[] args) {
    port(3000);
    String clientId = "YOUR_CLIENT_ID";
    String apiKey = "YOUR_API_KEY";
    String checksumKey = "YOUR_CHECKSUM_KEY";

    final PayOS payOS = new PayOS(clientId, apiKey, checksumKey);

    staticFiles.externalLocation(Paths.get("public").toAbsolutePath().toString());

    post(
        "/create-embedded-payment-link",
        (request, response) -> {
          String domain = "http://localhost:3000/";
          Long orderCode = System.currentTimeMillis() / 1000;
          CreatePaymentLinkRequest paymentData =
              CreatePaymentLinkRequest.builder()
                  .orderCode(orderCode)
                  .amount(2000)
                  .description("Thanh toán đơn hàng")
                  .returnUrl(domain)
                  .cancelUrl(domain)
                  .build();

          CreatePaymentLinkResponse result = payOS.paymentRequests().create(paymentData);
          response.type("application/json");
          return new com.google.gson.Gson().toJson(result);
        });
  }
}
```

/pom.xml

```
<?xml version="1.0" encoding="UTF-8"?>

<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>vn.payos.sample</groupId>
  <artifactId>payos-payment</artifactId>
  <version>1.0-SNAPSHOT</version>

  <name>sample</name>
  <!-- FIXME change it to the project's website -->
  <url>http://www.example.com</url>

  <properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
  </properties>

  <dependencies>
    <dependency>
      <groupId>com.sparkjava</groupId>
      <artifactId>spark-core</artifactId>
      <version>2.9.4</version>
    </dependency>
    <dependency>
      <groupId>vn.payos</groupId>
      <artifactId>payos-java</artifactId>
      <version>1.0.1</version>
    </dependency>
  </dependencies>

  <build>
    <pluginManagement><!-- lock down plugins versions to avoid using Maven defaults (may be moved to parent pom) -->
      <plugins>
        <!-- clean lifecycle, see https://maven.apache.org/ref/current/maven-core/lifecycles.html#clean_Lifecycle -->
        <plugin>
          <artifactId>maven-clean-plugin</artifactId>
          <version>3.1.0</version>
        </plugin>
        <!-- default lifecycle, jar packaging: see https://maven.apache.org/ref/current/maven-core/default-bindings.html#Plugin_bindings_for_jar_packaging -->
        <plugin>
          <artifactId>maven-resources-plugin</artifactId>
          <version>3.0.2</version>
        </plugin>
        <plugin>
          <artifactId>maven-compiler-plugin</artifactId>
          <version>3.8.0</version>
        </plugin>
        <plugin>
          <artifactId>maven-surefire-plugin</artifactId>
          <version>2.22.1</version>
        </plugin>
        <plugin>
          <artifactId>maven-jar-plugin</artifactId>
          <version>3.0.2</version>
        </plugin>
        <plugin>
          <artifactId>maven-install-plugin</artifactId>
          <version>2.5.2</version>
        </plugin>
        <plugin>
          <artifactId>maven-deploy-plugin</artifactId>
          <version>2.8.2</version>
        </plugin>
        <!-- site lifecycle, see https://maven.apache.org/ref/current/maven-core/lifecycles.html#site_Lifecycle -->
        <plugin>
          <artifactId>maven-site-plugin</artifactId>
          <version>3.7.1</version>
        </plugin>
        <plugin>
          <artifactId>maven-project-info-reports-plugin</artifactId>
          <version>3.0.0</version>
        </plugin>
        <plugin>
            <artifactId>maven-assembly-plugin</artifactId>
            <executions>
            <execution>
                <phase>package</phase>
                <goals>
                <goal>single</goal>
                </goals>
            </execution>
            </executions>
            <configuration>
            <descriptorRefs>
                <!-- This tells Maven to include all dependencies -->
                <descriptorRef>jar-with-dependencies</descriptorRef>
            </descriptorRefs>
            <archive>
                <manifest>
                <mainClass>vn.payos.sample.Server</mainClass>
                </manifest>
            </archive>
            </configuration>
        </plugin>
      </plugins>
    </pluginManagement>
  </build>
</project>
```

/public/index.html

```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tạo Link thanh toán</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body style="display: flex">
    <div style="padding-top: 10px; display: flex; flex-direction: column">
      <div
        style="border: 2px solid blue; border-radius: 10px; overflow: hidden"
      >
        <div id="content-container" style="padding: 10px">
          <p><strong>Tên sản phẩm:</strong> Mì tôm Hảo Hảo ly</p>
          <p><strong>Giá tiền:</strong> 2000 VNĐ</p>
          <p><strong>Số lượng:</strong> 1</p>
        </div>
        <div id="button-container">
          <button
            type="submit"
            id="create-payment-link-btn"
            style="
              width: 100%;
              background-color: blue;
              color: white;
              border: none;
              padding: 10px;
              font-size: 15px;
            "
          >
            Tạo Link thanh toán
          </button>
        </div>
      </div>
      <div id="embeded-payment-container" style="height: 350px"></div>
    </div>
  </body>
</html>
<script src="https://cdn.payos.vn/payos-checkout/v1/stable/payos-initialize.js"></script>
<script src="index.js"></script>
```

/public/index.js

```
/* eslint-disable no-undef */
const buttonContainer = document.getElementById("button-container");
const contentContainer = document.getElementById("content-container");
let isOpen = false;
let config = {
  RETURN_URL: window.location.href,
  ELEMENT_ID: "embeded-payment-container",
  CHECKOUT_URL: "",
  embedded: true,
  onSuccess: (event) => {
    contentContainer.innerHTML = `
        <div style="padding-top: 20px; padding-bottom:20px">
            Thanh toan thanh cong
        </div>
    `;
    buttonContainer.innerHTML = `
        <button
            type="submit"
            id="create-payment-link-btn"
            style="
            width: 100%;
            background-color: blue;
            color: white;
            border: none;
            padding: 10px;
            font-size: 15px;
            "
        >
            Quay lại trang thanh toán
        </button>
    `;
  },
};
buttonContainer.addEventListener("click", async (event) => {
  if (isOpen) {
    const { exit } = PayOSCheckout.usePayOS(config);
    exit();
    contentContainer.innerHTML = `
        <p><strong>Tên sản phẩm:</strong> Mì tôm Hảo Hảo ly</p>
        <p><strong>Giá tiền:</strong> 2000 VNĐ</p>
        <p><strong>Số lượng:</strong> 1</p>
    `;
  } else {
    const checkoutUrl = await getPaymentLink();
    config = {
      ...config,
      CHECKOUT_URL: checkoutUrl,
    };
    const { open } = PayOSCheckout.usePayOS(config);
    open();
  }
  isOpen = !isOpen;
  changeButton();
});

const getPaymentLink = async () => {
  const response = await fetch(
    "http://localhost:3030/create-embedded-payment-link",
    {
      method: "POST",
    }
  );
  if (!response.ok) {
    console.log("server doesn't response!");
  }
  const result = await response.json();
  return result.checkoutUrl;
};

const changeButton = () => {
  if (isOpen) {
    buttonContainer.innerHTML = `
        <button
            type="submit"
            id="create-payment-link-btn"
            style="
            width: 100%;
            background-color: gray;
            color: white;
            border: none;
            padding: 10px;
            font-size: 15px;
            "
        >
            Đóng link thanh toán
        </button>
      `;
  } else {
    buttonContainer.innerHTML = `
        <button
            type="submit"
            id="create-payment-link-btn"
            style="
                width: 100%;
                background-color: blue;
                color: white;
                border: none;
                padding: 10px;
                font-size: 15px;
            "
            >
            Tạo Link thanh toán
        </button> 
    `;
  }
};
```

## React + Node.js[​](#react--nodejs "Đường dẫn trực tiếp đến React + Node.js")

## Thiết lập Server[​](#thiết-lập-server "Đường dẫn trực tiếp đến Thiết lập Server")

### Cài đặt thư viện payOS cho NodeJS[​](#cài-đặt-thư-viện-payos-cho-nodejs "Đường dẫn trực tiếp đến Cài đặt thư viện payOS cho NodeJS")

```
npm install @payos/node
# hoặc
yarn add @payos/node
```

### Khởi tạo đối tượng `PayOS`[​](#khởi-tạo-đối-tượng-payos "Đường dẫn trực tiếp đến khởi-tạo-đối-tượng-payos")

Bạn cần khởi tạo đối tượng `PayOS` bằng `Client ID`, `API Key` và `Checksum Key` của kênh thanh toán mà bạn đã tạo trên trang [payOS](https://my.payos.vn).

### Tạo link thanh toán[​](#tạo-link-thanh-toán "Đường dẫn trực tiếp đến Tạo link thanh toán")

Link thanh toán kiểm soát những gì khách hàng của bạn nhìn thấy trên trang thanh toán, chẳng hạn như Tên sản phẩm, số lượng đặt, số tiền cũng như số tài khoản thụ hưởng, tên ngân hàng.

### Cung cấp returnUrl và cancelUrl[​](#cung-cấp-returnurl-và-cancelurl "Đường dẫn trực tiếp đến Cung cấp returnUrl và cancelUrl")

Chỉ định URL công khai cho trang thanh toán thành công và hủy thanh toán. Bạn cũng có thể xử lý cả trạng thái thành công và hủy với cùng một URL.

### Chuyển hướng tới trang thanh toán[​](#chuyển-hướng-tới-trang-thanh-toán "Đường dẫn trực tiếp đến Chuyển hướng tới trang thanh toán")

Sau khi tạo link thanh toán thành công, chuyển hướng khách hàng tới trang thanh toán trả về trong phản hồi.

## Xây dựng giao diện[​](#xây-dựng-giao-diện "Đường dẫn trực tiếp đến Xây dựng giao diện")

### Cài đặt thư viện payos-checkout và import usePayOS[​](#cài-đặt-thư-viện-payos-checkout-và-import-usepayos "Đường dẫn trực tiếp đến Cài đặt thư viện payos-checkout và import usePayOS")

```
npm install @payos/payos-checkout
# hoặc
yarn add @payos/payos-checkout
```

### Khởi tạo config cho việc gọi hook usePayOS[​](#khởi-tạo-config-cho-việc-gọi-hook-usepayos "Đường dẫn trực tiếp đến Khởi tạo config cho việc gọi hook usePayOS")

Có 3 trường bắt buộc phải khởi tạo:

* **RETURN\_URL**: url dẫn đến trang web khi thanh toán thành công.
* **ELEMENT\_ID**: id của 1 component mà bạn muốn nhúng giao diện thanh toán của payOS vào
* **CHECKOUT\_URL**: đường link dẫn đến giao diện thanh toán sẽ được nhúng vào trang web của bạn

Vì thực hiện giao diện thanh toán nhúng nên ta sẽ sử dụng thêm các property như sau:

* `embedded: true` để sử dụng giao diện nhúng
* **onSuccess(event)**: gọi hàm bạn truyền vào nếu như người dùng thực hiện thanh toán thành công

Thông tin chi tiết hơn tại: [payos-checkout](https://payos.vn/docs/sdks/front-end/script-js/)

### Sử dụng thư viện payos-checkout để thực hiện việc nhúng link thanh toán[​](#sử-dụng-thư-viện-payos-checkout-để-thực-hiện-việc-nhúng-link-thanh-toán "Đường dẫn trực tiếp đến Sử dụng thư viện payos-checkout để thực hiện việc nhúng link thanh toán")

Gọi hook usePayOS trong thư viện PayOSCheckout để sử dụng 2 phương thức open() và exit() để lần lượt nhúng và gỡ bỏ giao diện thanh toán trên trang web.

## Chạy thử[​](#chạy-thử "Đường dẫn trực tiếp đến Chạy thử")

Thêm những trường sau vào file `package.json`:

```
"proxy": "http://localhost:3030",
"scripts": {
    # another scripts
    "start-client": "react-scripts start",
    "start-server": "nodemon server.js",
    "start": "concurrently \"npm run start-client\" \"npm run start-server\""
},
```

Chạy server và client của bạn và truy cập vào [`http://localhost:3000`](http://localhost:3000) để bắt đầu tạo link thanh toán.

```
npm run start
```

### Mã nguồn[​](#mã-nguồn-6 "Đường dẫn trực tiếp đến Mã nguồn")

* server.js
* App.js

/server.js

```
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { PayOS } = require('@payos/node');

const app = express();
dotenv.config();
const payOS = new PayOS({
  clientId: process.env.PAYOS_CLIENT_ID,
  apiKey: process.env.PAYOS_API_KEY,
  checksumKey: process.env.PAYOS_CHECKSUM_KEY,
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/create-embedded-payment-link', async (req, res) => {
  const YOUR_DOMAIN = `http://localhost:3000/`;
  const body = {
    orderCode: Number(String(Date.now()).slice(-6)),
    amount: 10000,
    description: 'Thanh toan don hang',
    returnUrl: `${YOUR_DOMAIN}`,
    cancelUrl: `${YOUR_DOMAIN}`,
  };

  try {
    const paymentLinkResponse = await payOS.paymentRequests.create(body);

    res.send(paymentLinkResponse);
  } catch (error) {
    console.error(error);
    res.send('Something went error');
  }
});

app.listen(3030, function () {
  console.log(`Server is listening on port 3030`);
});
```

/client/src/App.js

```
import React, { useState, useEffect } from "react";
import { usePayOS } from "@payos/payos-checkout";
import "./App.css";

const ProductDisplay = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isCreatingLink, setIsCreatingLink] = useState(false);

  const [payOSConfig, setPayOSConfig] = useState({
    RETURN_URL: window.location.href, // required
    ELEMENT_ID: "embedded-payment-container", // required
    CHECKOUT_URL: null, // required
    embedded: true, // Nếu dùng giao diện nhúng
    onSuccess: (event) => {
      //TODO: Hành động sau khi người dùng thanh toán đơn hàng thành công
      setIsOpen(false);
      setMessage("Thanh toan thanh cong");
    },
  });

  const { open, exit } = usePayOS(payOSConfig);

  const handleGetPaymentLink = async () => {
    setIsCreatingLink(true);
    exit();
    const response = await fetch(
      "http://localhost:3030/create-embedded-payment-link",
      {
        method: "POST",
      }
    );
    if (!response.ok) {
      console.log("Server doesn't response");
    }

    const result = await response.json();
    setPayOSConfig((oldConfig) => ({
      ...oldConfig,
      CHECKOUT_URL: result.checkoutUrl,
    }));

    setIsOpen(true);
    setIsCreatingLink(false);
  };

  useEffect(() => {
    if (payOSConfig.CHECKOUT_URL != null) {
      open();
    }
  }, [payOSConfig]);
  return message ? (
    <Message message={message} />
  ) : (
    <div className="main-box">
      <div>
        <div className="checkout">
          <div className="product">
            <p>
              <strong>Tên sản phẩm:</strong> Mì tôm Hảo Hảo ly
            </p>
            <p>
              <strong>Giá tiền:</strong> 2000 VNĐ
            </p>
            <p>
              <strong>Số lượng:</strong> 1
            </p>
          </div>
          <div className="flex">
            {!isOpen ? (
              <div>
                {isCreatingLink ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "10px",
                      fontWeight: "600",
                    }}
                  >
                    Creating Link...
                  </div>
                ) : (
                  <button
                    id="create-payment-link-btn"
                    onClick={(event) => {
                      event.preventDefault();
                      handleGetPaymentLink();
                    }}
                  >
                    Tạo Link thanh toán Embedded
                  </button>
                )}
              </div>
            ) : (
              <button
                style={{
                  backgroundColor: "gray",
                  color: "white",
                  width: "100%",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  fontSize: "14px",
                  marginTop: "5px",
                }}
                onClick={(event) => {
                  event.preventDefault();
                  setIsOpen(false);
                  exit();
                }}
              >
                Đóng Link
              </button>
            )}
          </div>
        </div>
        {isOpen && (
          <div style={{ maxWidth: "400px", padding: "2px" }}>
            Sau khi thực hiện thanh toán thành công, vui lòng đợi từ 5 - 10s để
            hệ thống tự động cập nhật.
          </div>
        )}
        <div
          id="embedded-payment-container"
          style={{
            height: "350px",
          }}
        ></div>
      </div>
    </div>
  );
};

const Message = ({ message }) => (
  <div className="main-box">
    <div className="checkout">
      <div class="product" style={{ textAlign: "center", fontWeight: "500" }}>
        <p>{message}</p>
      </div>
      <form action="/">
        <button type="submit" id="create-payment-link-btn">
          Quay lại trang thanh toán
        </button>
      </form>
    </div>
  </div>
);

export default function App() {
  return <ProductDisplay />;
}
```

## React + PHP[​](#react--php "Đường dẫn trực tiếp đến React + PHP")

## Thiết lập Server[​](#thiết-lập-server "Đường dẫn trực tiếp đến Thiết lập Server")

### Cài đặt thư viện payOS cho PHP[​](#cài-đặt-thư-viện-payos-cho-php "Đường dẫn trực tiếp đến Cài đặt thư viện payOS cho PHP")

```
composer require payos/payos
```

### Khởi tạo đối tượng `PayOS`[​](#khởi-tạo-đối-tượng-payos "Đường dẫn trực tiếp đến khởi-tạo-đối-tượng-payos")

Bạn cần khởi tạo đối tượng `PayOS` bằng `Client ID`, `API Key` và `Checksum Key` của kênh thanh toán mà bạn đã tạo trên trang [payOS](https://my.payos.vn).

### Tạo link thanh toán[​](#tạo-link-thanh-toán "Đường dẫn trực tiếp đến Tạo link thanh toán")

Link thanh toán kiểm soát những gì khách hàng của bạn nhìn thấy trên trang thanh toán, chẳng hạn như Tên sản phẩm, số lượng đặt, số tiền cũng như số tài khoản thụ hưởng, tên ngân hàng.

### Cung cấp returnUrl và cancelUrl[​](#cung-cấp-returnurl-và-cancelurl "Đường dẫn trực tiếp đến Cung cấp returnUrl và cancelUrl")

Chỉ định URL công khai cho trang thanh toán thành công và hủy thanh toán. Bạn cũng có thể xử lý cả trạng thái thành công và hủy với cùng một URL.

### Chuyển hướng tới trang thanh toán[​](#chuyển-hướng-tới-trang-thanh-toán "Đường dẫn trực tiếp đến Chuyển hướng tới trang thanh toán")

Sau khi tạo link thanh toán thành công, chuyển hướng khách hàng tới trang thanh toán trả về trong phản hồi.

## Xây dựng giao diện[​](#xây-dựng-giao-diện "Đường dẫn trực tiếp đến Xây dựng giao diện")

### Cài đặt thư viện payos-checkout và import usePayOS[​](#cài-đặt-thư-viện-payos-checkout-và-import-usepayos "Đường dẫn trực tiếp đến Cài đặt thư viện payos-checkout và import usePayOS")

```
npm install @payos/payos-checkout
# hoặc
yarn add @payos/payos-checkout
```

### Khởi tạo config cho việc gọi hook usePayOS[​](#khởi-tạo-config-cho-việc-gọi-hook-usepayos "Đường dẫn trực tiếp đến Khởi tạo config cho việc gọi hook usePayOS")

Có 3 trường bắt buộc phải khởi tạo:

* **RETURN\_URL**: url dẫn đến trang web khi thanh toán thành công.
* **ELEMENT\_ID**: id của 1 component mà bạn muốn nhúng giao diện thanh toán của payOS vào
* **CHECKOUT\_URL**: đường link dẫn đến giao diện thanh toán sẽ được nhúng vào trang web của bạn

Vì thực hiện giao diện thanh toán nhúng nên ta sẽ sử dụng thêm các property như sau:

* `embedded: true` để sử dụng giao diện nhúng
* **onSuccess(event)**: gọi hàm bạn truyền vào nếu như người dùng thực hiện thanh toán thành công

Thông tin chi tiết hơn tại: [payos-checkout](https://payos.vn/docs/sdks/front-end/script-js/)

### Sử dụng thư viện payos-checkout để thực hiện việc nhúng link thanh toán[​](#sử-dụng-thư-viện-payos-checkout-để-thực-hiện-việc-nhúng-link-thanh-toán "Đường dẫn trực tiếp đến Sử dụng thư viện payos-checkout để thực hiện việc nhúng link thanh toán")

Gọi hook usePayOS trong thư viện PayOSCheckout để sử dụng 2 phương thức open() và exit() để lần lượt nhúng và gỡ bỏ giao diện thanh toán trên trang web.

## Chạy thử[​](#chạy-thử "Đường dẫn trực tiếp đ��ến Chạy thử")

Thêm `"proxy": "http://localhost:3030"` vào file `package.json`.

Chạy server của bạn và truy cập vào [`http://localhost:3000`](http://localhost:3000) để bắt đầu tạo link thanh toán.

```
# server side
php -S localhost:3030 --docroot=public

# client side
npm start
```

### Mã nguồn[​](#mã-nguồn-7 "Đường dẫn trực ti�ếp đến Mã nguồn")

* checkout.php
* App.js

/checkout.php

```
<?php

require_once  '../vendor/autoload.php';
require_once '../payos_secrets.php';

use PayOS\PayOS;

$payOS = new PayOS(
    clientId: $payOSClientId,
    apiKey: $payOSApiKey,
    checksumKey: $payOSChecksumKey
);

$YOUR_DOMAIN = 'http://localhost:3030/';

$data = [
    "orderCode" => intval(substr(strval(microtime(true) * 10000), -6)),
    "amount" => 2000,
    "description" => "Thanh toán đơn hàng",
    "returnUrl" => $YOUR_DOMAIN,
    "cancelUrl" => $YOUR_DOMAIN
];

$response = $payOS->paymentRequests->create($data);
$checkoutUrl = $response['checkoutUrl'];
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>PayOS Checkout</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="style.css" />
    <script src="https://cdn.payos.vn/payos-checkout/v1/stable/payos-initialize.js"></script>
</head>

<body>
    <div class="main-box">
        <div class="checkout">
            <div class="product">
                <p><strong>Tên sản phẩm:</strong> Mì tôm Hảo Hảo ly</p>
                <p><strong>Giá tiền:</strong> 2000 VNĐ</p>
                <p><strong>Số lượng:</strong> 1</p>
            </div>
            <button id="create-payment-link-btn">Đóng thanh toán</button>
        </div>
        <div id="embedded-payment-container" style="width:400px;height:400px;max-width:100%;margin:30px auto 0 auto;"></div>
    </div>
    <script>
        let payosInstance = null;
        const config = {
            RETURN_URL: "<?php echo $YOUR_DOMAIN; ?>",
            ELEMENT_ID: "embedded-payment-container",
            CHECKOUT_URL: "<?php echo $checkoutUrl; ?>",
            embedded: true,
            onSuccess: function(event) {
                document.querySelector('.main-box').innerHTML = '<h2>Thanh toán thành công!</h2>';
                document.getElementById('embedded-payment-container').innerHTML = '';
                document.getElementById('create-payment-link-btn').style.display = 'none';
            }
        };
        window.addEventListener('DOMContentLoaded', function() {
            payosInstance = PayOSCheckout.usePayOS(config);
            payosInstance.open();
            document.getElementById('create-payment-link-btn').style.display = 'block';
            document.getElementById('create-payment-link-btn').onclick = function() {
                if (payosInstance) payosInstance.exit();
                document.getElementById('embedded-payment-container').innerHTML = '';
                this.style.display = 'none';
                window.location.href = '/';
            };
        });
    </script>
</body>

</html>
```

/client/src/App.js

```
import React, { useState, useEffect } from "react";
import { usePayOS } from "@payos/payos-checkout";
import "./App.css";

const ProductDisplay = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isCreatingLink, setIsCreatingLink] = useState(false);

  const [payOSConfig, setPayOSConfig] = useState({
    RETURN_URL: window.location.href, // required
    ELEMENT_ID: "embedded-payment-container", // required
    CHECKOUT_URL: null, // required
    embedded: true, // Nếu dùng giao diện nhúng
    onSuccess: (event) => {
      //TODO: Hành động sau khi người dùng thanh toán đơn hàng thành công
      setIsOpen(false);
      setMessage("Thanh toan thanh cong");
    },
  });

  const { open, exit } = usePayOS(payOSConfig);

  const handleGetPaymentLink = async () => {
    setIsCreatingLink(true);
    exit();
    const response = await fetch(
      "http://localhost:3030/create-embedded-payment-link",
      {
        method: "POST",
      }
    );
    if (!response.ok) {
      console.log("Server doesn't response");
    }

    const result = await response.json();
    setPayOSConfig((oldConfig) => ({
      ...oldConfig,
      CHECKOUT_URL: result.checkoutUrl,
    }));

    setIsOpen(true);
    setIsCreatingLink(false);
  };

  useEffect(() => {
    if (payOSConfig.CHECKOUT_URL != null) {
      open();
    }
  }, [payOSConfig]);
  return message ? (
    <Message message={message} />
  ) : (
    <div className="main-box">
      <div>
        <div className="checkout">
          <div className="product">
            <p>
              <strong>Tên sản phẩm:</strong> Mì tôm Hảo Hảo ly
            </p>
            <p>
              <strong>Giá tiền:</strong> 2000 VNĐ
            </p>
            <p>
              <strong>Số lượng:</strong> 1
            </p>
          </div>
          <div className="flex">
            {!isOpen ? (
              <div>
                {isCreatingLink ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "10px",
                      fontWeight: "600",
                    }}
                  >
                    Creating Link...
                  </div>
                ) : (
                  <button
                    id="create-payment-link-btn"
                    onClick={(event) => {
                      event.preventDefault();
                      handleGetPaymentLink();
                    }}
                  >
                    Tạo Link thanh toán Embedded
                  </button>
                )}
              </div>
            ) : (
              <button
                style={{
                  backgroundColor: "gray",
                  color: "white",
                  width: "100%",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  fontSize: "14px",
                  marginTop: "5px",
                }}
                onClick={(event) => {
                  event.preventDefault();
                  setIsOpen(false);
                  exit();
                }}
              >
                Đóng Link
              </button>
            )}
          </div>
        </div>
        {isOpen && (
          <div style={{ maxWidth: "400px", padding: "2px" }}>
            Sau khi thực hiện thanh toán thành công, vui lòng đợi từ 5 - 10s để
            hệ thống tự động cập nhật.
          </div>
        )}
        <div
          id="embedded-payment-container"
          style={{
            height: "350px",
          }}
        ></div>
      </div>
    </div>
  );
};

const Message = ({ message }) => (
  <div className="main-box">
    <div className="checkout">
      <div class="product" style={{ textAlign: "center", fontWeight: "500" }}>
        <p>{message}</p>
      </div>
      <form action="/">
        <button type="submit" id="create-payment-link-btn">
          Quay lại trang thanh toán
        </button>
      </form>
    </div>
  </div>
);

export default function App() {
  return <ProductDisplay />;
}
```

## React + Python[​](#react--python "Đường dẫn trực tiếp đến React + Python")

## Thiết lập Server[​](#thiết-lập-server "Đường dẫn trực tiếp đến Thiết lập Server")

### Cài đặt thư viện payOS cho Python[​](#cài-đặt-thư-viện-payos-cho-python "Đường dẫn trực tiếp đến Cài đặt thư viện payOS cho Python")

```
pip install payos
```

### Khởi tạo đối tượng `PayOS`[​](#khởi-tạo-đối-tượng-payos "Đường dẫn trực tiếp đến khởi-tạo-đối-tượng-payos")

Bạn cần khởi tạo đối tượng `PayOS` bằng `Client ID`, `API Key` và `Checksum Key` của kênh thanh toán mà bạn đã tạo trên trang [payOS](https://my.payos.vn).

### Tạo link thanh toán[​](#tạo-link-thanh-toán "Đường dẫn trực tiếp đến Tạo link thanh toán")

Link thanh toán kiểm soát những gì khách hàng của bạn nhìn thấy trên trang thanh toán, chẳng hạn như Tên sản phẩm, số lượng đặt, số tiền cũng như số tài khoản thụ hưởng, tên ngân hàng.

### Cung cấp returnUrl và cancelUrl[​](#cung-cấp-returnurl-và-cancelurl "Đường dẫn trực tiếp đến Cung cấp returnUrl và cancelUrl")

Chỉ định URL công khai cho trang thanh toán thành công và hủy thanh toán. Bạn cũng có thể xử lý cả trạng thái thành công và hủy với cùng một URL.

### Chuyển hướng tới trang thanh toán[​](#chuyển-hướng-tới-trang-thanh-toán "Đường dẫn trực tiếp đến Chuyển hướng tới trang thanh toán")

Sau khi tạo link thanh toán thành công, chuyển hướng khách hàng tới trang thanh toán trả về trong phản hồi.

## Xây dựng giao diện[​](#xây-dựng-giao-diện "Đường dẫn trực tiếp đến Xây dựng giao diện")

### Cài đặt thư viện payos-checkout và import usePayOS[​](#cài-đặt-thư-viện-payos-checkout-và-import-usepayos "Đường dẫn trực tiếp đến Cài đặt thư viện payos-checkout và import usePayOS")

```
npm install @payos/payos-checkout
# hoặc
yarn add @payos/payos-checkout
```

### Khởi tạo config cho việc gọi hook usePayOS[​](#khởi-tạo-config-cho-việc-gọi-hook-usepayos "Đường dẫn trực tiếp đến Khởi tạo config cho việc gọi hook usePayOS")

Có 3 trường bắt buộc phải khởi tạo:

* **RETURN\_URL**: url dẫn đến trang web khi thanh toán thành công.
* **ELEMENT\_ID**: id của 1 component mà bạn muốn nhúng giao diện thanh toán của payOS vào
* **CHECKOUT\_URL**: đường link dẫn đến giao diện thanh toán sẽ được nhúng vào trang web của bạn

Vì thực hiện giao diện thanh toán nhúng nên ta sẽ sử dụng thêm các property như sau:

* `embedded: true` để sử dụng giao diện nhúng
* **onSuccess(event)**: gọi hàm bạn truyền vào nếu như người dùng thực hiện thanh toán thành công

Thông tin chi tiết hơn tại: [payos-checkout](https://payos.vn/docs/sdks/front-end/script-js/)

### Sử dụng thư viện payos-checkout để thực hiện việc nhúng link thanh toán[​](#sử-dụng-thư-viện-payos-checkout-để-thực-hiện-việc-nhúng-link-thanh-toán "Đường dẫn trực tiếp đến Sử dụng thư viện payos-checkout để thực hiện việc nhúng link thanh toán")

Gọi hook usePayOS trong thư viện PayOSCheckout để sử dụng 2 phương thức open() và exit() để lần lượt nhúng và gỡ bỏ giao diện thanh toán trên trang web.

## Chạy thử[​](#chạy-thử "Đường dẫn trực tiếp đến Chạy thử")

Thêm `"proxy": "http://localhost:3030"` vào file `package.json`.

Chạy server của bạn và truy cập vào [`http://localhost:3000`](http://localhost:3000) để bắt đầu tạo link thanh toán.

```
# server side
flask run --port=3030

# client side
npm start
```

### Mã nguồn[​](#mã-nguồn-8 "Đường dẫn trực tiếp đến Mã nguồn")

* server.py
* App.js

/server.py

```
"""
server.py
PayOS Sample.
Python 3.6 or newer required.
"""

import time

from flask import Flask, send_from_directory
from payos import CreatePaymentLinkRequest, PayOS

# Keep your PayOS key protected by including it by an environment variable
client_id = "YOUR_CLIENT_ID"
api_key = "YOUR_API_KEY"
checksum_key = "YOUR_CHECKSUM_KEY"

payos = PayOS(client_id, api_key, checksum_key)

app = Flask(__name__, static_url_path="", static_folder="public")

YOUR_DOMAIN = "http://localhost:3030/"


@app.route("/")
def index():
    return send_from_directory("public", "index.html")


@app.route("/create-embedded-payment-link", methods=["POST"])
def create_payment_link():
    try:
        payment_data = CreatePaymentLinkRequest(
            orderCode=int(time.time()),
            amount=2000,
            description="Thanh toan don hang",
            cancelUrl=YOUR_DOMAIN,
            returnUrl=YOUR_DOMAIN,
        )
        payment_link_response = payos.payment_requests.create(payment_data)
    except Exception as e:
        return str(e)

    return payment_link_response.to_json()


if __name__ == "__main__":
    app.run(port=3030)
```

/client/src/App.js

```
import React, { useState, useEffect } from "react";
import { usePayOS } from "@payos/payos-checkout";
import "./App.css";

const ProductDisplay = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isCreatingLink, setIsCreatingLink] = useState(false);

  const [payOSConfig, setPayOSConfig] = useState({
    RETURN_URL: window.location.href, // required
    ELEMENT_ID: "embedded-payment-container", // required
    CHECKOUT_URL: null, // required
    embedded: true, // Nếu dùng giao diện nhúng
    onSuccess: (event) => {
      //TODO: Hành động sau khi người dùng thanh toán đơn hàng thành công
      setIsOpen(false);
      setMessage("Thanh toan thanh cong");
    },
  });

  const { open, exit } = usePayOS(payOSConfig);

  const handleGetPaymentLink = async () => {
    setIsCreatingLink(true);
    exit();
    const response = await fetch(
      "http://localhost:3030/create-embedded-payment-link",
      {
        method: "POST",
      }
    );
    if (!response.ok) {
      console.log("Server doesn't response");
    }

    const result = await response.json();
    setPayOSConfig((oldConfig) => ({
      ...oldConfig,
      CHECKOUT_URL: result.checkoutUrl,
    }));

    setIsOpen(true);
    setIsCreatingLink(false);
  };

  useEffect(() => {
    if (payOSConfig.CHECKOUT_URL != null) {
      open();
    }
  }, [payOSConfig]);
  return message ? (
    <Message message={message} />
  ) : (
    <div className="main-box">
      <div>
        <div className="checkout">
          <div className="product">
            <p>
              <strong>Tên sản phẩm:</strong> Mì tôm Hảo Hảo ly
            </p>
            <p>
              <strong>Giá tiền:</strong> 2000 VNĐ
            </p>
            <p>
              <strong>Số lượng:</strong> 1
            </p>
          </div>
          <div className="flex">
            {!isOpen ? (
              <div>
                {isCreatingLink ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "10px",
                      fontWeight: "600",
                    }}
                  >
                    Creating Link...
                  </div>
                ) : (
                  <button
                    id="create-payment-link-btn"
                    onClick={(event) => {
                      event.preventDefault();
                      handleGetPaymentLink();
                    }}
                  >
                    Tạo Link thanh toán Embedded
                  </button>
                )}
              </div>
            ) : (
              <button
                style={{
                  backgroundColor: "gray",
                  color: "white",
                  width: "100%",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  fontSize: "14px",
                  marginTop: "5px",
                }}
                onClick={(event) => {
                  event.preventDefault();
                  setIsOpen(false);
                  exit();
                }}
              >
                Đóng Link
              </button>
            )}
          </div>
        </div>
        {isOpen && (
          <div style={{ maxWidth: "400px", padding: "2px" }}>
            Sau khi thực hiện thanh toán thành công, vui lòng đợi từ 5 - 10s để
            hệ thống tự động cập nhật.
          </div>
        )}
        <div
          id="embedded-payment-container"
          style={{
            height: "350px",
          }}
        ></div>
      </div>
    </div>
  );
};

const Message = ({ message }) => (
  <div className="main-box">
    <div className="checkout">
      <div class="product" style={{ textAlign: "center", fontWeight: "500" }}>
        <p>{message}</p>
      </div>
      <form action="/">
        <button type="submit" id="create-payment-link-btn">
          Quay lại trang thanh toán
        </button>
      </form>
    </div>
  </div>
);

export default function App() {
  return <ProductDisplay />;
}
```

## React + Go[​](#react--go "Đường dẫn trực tiếp đến React + Go")

## Thiết lập Server[​](#thiết-lập-server "Đường dẫn trực tiếp đến Thiết lập Server")

### Cài đặt thư viện payOS cho Go[​](#cài-đặt-thư-viện-payos-cho-go "Đường dẫn trực tiếp đến Cài đặt thư viện payOS cho Go")

```
go get github.com/payOSHQ/payos-lib-golang/v2
```

### Khởi tạo đối tượng `PayOS`[​](#khởi-tạo-đối-tượng-payos "Đường dẫn trực tiếp đến khởi-tạo-đối-tượng-payos")

Bạn cần khởi tạo đối tượng `PayOS` bằng `Client ID`, `API Key` và `Checksum Key` của kênh thanh toán mà bạn đã tạo trên trang [payOS](https://my.payos.vn).

### Tạo link thanh toán[​](#tạo-link-thanh-toán "Đường dẫn trực tiếp đến Tạo link thanh toán")

Link thanh toán kiểm soát những gì khách hàng của bạn nhìn thấy trên trang thanh toán, chẳng hạn như Tên sản phẩm, số lượng đặt, số tiền cũng như số tài khoản thụ hưởng, tên ngân hàng.

### Cung cấp returnUrl và cancelUrl[​](#cung-cấp-returnurl-và-cancelurl "Đường dẫn trực tiếp đến Cung cấp returnUrl và cancelUrl")

Chỉ định URL công khai cho trang thanh toán thành công và hủy thanh toán. Bạn cũng có thể xử lý cả trạng thái thành công và hủy với cùng một URL.

### Chuyển hướng tới trang thanh toán[​](#chuyển-hướng-tới-trang-thanh-toán "Đường dẫn trực tiếp đến Chuyển hướng tới trang thanh toán")

Sau khi tạo link thanh toán thành công, chuyển hướng khách hàng tới trang thanh toán trả về trong phản hồi.

## Xây dựng giao diện[​](#xây-dựng-giao-diện "Đường dẫn trực tiếp đến Xây dựng giao diện")

### Cài đặt thư viện payos-checkout và import usePayOS[​](#cài-đặt-thư-viện-payos-checkout-và-import-usepayos "Đường dẫn trực tiếp đến Cài đặt thư viện payos-checkout và import usePayOS")

```
npm install @payos/payos-checkout
# hoặc
yarn add @payos/payos-checkout
```

### Khởi tạo config cho việc gọi hook usePayOS[​](#khởi-tạo-config-cho-việc-gọi-hook-usepayos "Đường dẫn trực tiếp đến Khởi tạo config cho việc gọi hook usePayOS")

Có 3 trường bắt buộc phải khởi tạo:

* **RETURN\_URL**: url dẫn đến trang web khi thanh toán thành công.
* **ELEMENT\_ID**: id của 1 component mà bạn muốn nhúng giao diện thanh toán của payOS vào
* **CHECKOUT\_URL**: đường link dẫn đến giao diện thanh toán sẽ được nhúng vào trang web của bạn

Vì thực hiện giao diện thanh toán nhúng nên ta sẽ sử dụng thêm các property như sau:

* `embedded: true` để sử dụng giao diện nhúng
* **onSuccess(event)**: gọi hàm bạn truyền vào nếu như người dùng thực hiện thanh toán thành công

Thông tin chi tiết hơn tại: [payos-checkout](https://payos.vn/docs/sdks/front-end/script-js/)

### Sử dụng thư viện payos-checkout để thực hiện việc nhúng link thanh toán[​](#sử-dụng-thư-viện-payos-checkout-để-thực-hiện-việc-nhúng-link-thanh-toán "Đường dẫn trực tiếp đến Sử dụng thư viện payos-checkout để thực hiện việc nhúng link thanh toán")

Gọi hook usePayOS trong thư viện PayOSCheckout để sử dụng 2 phương thức open() và exit() để lần lượt nhúng và gỡ bỏ giao diện thanh toán trên trang web.

## Chạy thử[​](#chạy-thử "Đường dẫn trực tiếp đến Chạy thử")

Thêm `"proxy": "http://localhost:3030"` vào file `package.json`.

Chạy server của bạn và truy cập vào [`http://localhost:3000`](http://localhost:3000) để bắt đầu tạo link thanh toán.

```
# server side
go run server.go

# client side
npm start
```

### Mã nguồn[​](#mã-nguồn-9 "Đường dẫn trực tiếp đến Mã nguồn")

* server.go
* App.js

/server.go

```
package main

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/payOSHQ/payos-lib-golang/v2"
)

var payOSClient *payos.PayOS

func main() {
	// Keep your PayOS key protected by including it by an env variable
	const clientId = "YOUR_CLIENT_ID"
	const apiKey = "YOUR_API_KEY"
	const checksumKey = "YOUR_CHECKSUM_KEY"

	var err error
	payOSClient, err = payos.NewPayOS(&payos.PayOSOptions{
		ClientID:    clientId,
		APIKey:      apiKey,
		ChecksumKey: checksumKey,
	})
	if err != nil {
		log.Fatalf("Failed to create PayOS client: %v", err)
	}

	http.Handle("/", http.FileServer(http.Dir("public")))
	http.HandleFunc("/create-embedded-payment-link", createPaymentLink)
	addr := "localhost:3030"
	log.Printf("Listening on %s", addr)
	log.Fatal(http.ListenAndServe(addr, nil))
}

func createPaymentLink(w http.ResponseWriter, r *http.Request) {
	domain := "http://localhost:3030/"
	paymentLinkRequest := payos.CreatePaymentLinkRequest{
		OrderCode:   time.Now().UnixNano() / int64(time.Millisecond),
		Amount:      2000,
		Description: "Thanh toan don hang",
		CancelUrl:   domain,
		ReturnUrl:   domain,
	}

	paymentLinkResponse, err := payOSClient.PaymentRequests.Create(r.Context(), &paymentLinkRequest)

	if err != nil {
		log.Printf("Create payment link failed: %v", err)
	}

	// Return paymentLinkResponse as JSON instead of redirect
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(paymentLinkResponse); err != nil {
		log.Printf("Failed to encode response: %v", err)
	}
}
```

/client/src/App.js

```
import React, { useState, useEffect } from "react";
import { usePayOS } from "@payos/payos-checkout";
import "./App.css";

const ProductDisplay = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isCreatingLink, setIsCreatingLink] = useState(false);

  const [payOSConfig, setPayOSConfig] = useState({
    RETURN_URL: window.location.href, // required
    ELEMENT_ID: "embedded-payment-container", // required
    CHECKOUT_URL: null, // required
    embedded: true, // Nếu dùng giao diện nhúng
    onSuccess: (event) => {
      //TODO: Hành động sau khi người dùng thanh toán đơn hàng thành công
      setIsOpen(false);
      setMessage("Thanh toan thanh cong");
    },
  });

  const { open, exit } = usePayOS(payOSConfig);

  const handleGetPaymentLink = async () => {
    setIsCreatingLink(true);
    exit();
    const response = await fetch(
      "http://localhost:3030/create-embedded-payment-link",
      {
        method: "POST",
      }
    );
    if (!response.ok) {
      console.log("Server doesn't response");
    }

    const result = await response.json();
    setPayOSConfig((oldConfig) => ({
      ...oldConfig,
      CHECKOUT_URL: result.checkoutUrl,
    }));

    setIsOpen(true);
    setIsCreatingLink(false);
  };

  useEffect(() => {
    if (payOSConfig.CHECKOUT_URL != null) {
      open();
    }
  }, [payOSConfig]);
  return message ? (
    <Message message={message} />
  ) : (
    <div className="main-box">
      <div>
        <div className="checkout">
          <div className="product">
            <p>
              <strong>Tên sản phẩm:</strong> Mì tôm Hảo Hảo ly
            </p>
            <p>
              <strong>Giá tiền:</strong> 2000 VNĐ
            </p>
            <p>
              <strong>Số lượng:</strong> 1
            </p>
          </div>
          <div className="flex">
            {!isOpen ? (
              <div>
                {isCreatingLink ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "10px",
                      fontWeight: "600",
                    }}
                  >
                    Creating Link...
                  </div>
                ) : (
                  <button
                    id="create-payment-link-btn"
                    onClick={(event) => {
                      event.preventDefault();
                      handleGetPaymentLink();
                    }}
                  >
                    Tạo Link thanh toán Embedded
                  </button>
                )}
              </div>
            ) : (
              <button
                style={{
                  backgroundColor: "gray",
                  color: "white",
                  width: "100%",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  fontSize: "14px",
                  marginTop: "5px",
                }}
                onClick={(event) => {
                  event.preventDefault();
                  setIsOpen(false);
                  exit();
                }}
              >
                Đóng Link
              </button>
            )}
          </div>
        </div>
        {isOpen && (
          <div style={{ maxWidth: "400px", padding: "2px" }}>
            Sau khi thực hiện thanh toán thành công, vui lòng đợi từ 5 - 10s để
            hệ thống tự động cập nhật.
          </div>
        )}
        <div
          id="embedded-payment-container"
          style={{
            height: "350px",
          }}
        ></div>
      </div>
    </div>
  );
};

const Message = ({ message }) => (
  <div className="main-box">
    <div className="checkout">
      <div class="product" style={{ textAlign: "center", fontWeight: "500" }}>
        <p>{message}</p>
      </div>
      <form action="/">
        <button type="submit" id="create-payment-link-btn">
          Quay lại trang thanh toán
        </button>
      </form>
    </div>
  </div>
);

export default function App() {
  return <ProductDisplay />;
}
```

## React + .NET[​](#react--net "Đường dẫn trực tiếp đến React + .NET")

## Thiết lập Server[​](#thiết-lập-server "Đường dẫn trực tiếp đến Thiết lập Server")

### Cài đặt thư viện payOS cho .NET[​](#cài-đặt-thư-viện-payos-cho-net "Đường dẫn trực tiếp đến Cài đặt thư viện payOS cho .NET")

<!-- -->

* dotnet
* NuGet

```
dotnet add package payOS
```

```
Install-Package payOS
```

### Khởi tạo đối tượng `PayOS`[​](#khởi-tạo-đối-tượng-payos "Đường dẫn trực tiếp đến khởi-tạo-đối-tượng-payos")

Bạn cần khởi tạo đối tượng `PayOS` bằng `Client ID`, `API Key` và `Checksum Key` của kênh thanh toán mà bạn đã tạo trên trang [payOS](https://my.payos.vn).

### Tạo link thanh toán[​](#tạo-link-thanh-toán "Đường dẫn trực tiếp đến Tạo link thanh toán")

Link thanh toán kiểm soát những gì khách hàng của bạn nhìn thấy trên trang thanh toán, chẳng hạn như Tên sản phẩm, số lượng đặt, số tiền cũng như số tài khoản thụ hưởng, tên ngân hàng.

### Cung cấp returnUrl và cancelUrl[​](#cung-cấp-returnurl-và-cancelurl "Đường dẫn trực tiếp đến Cung cấp returnUrl và cancelUrl")

Chỉ định URL công khai cho trang thanh toán thành công và hủy thanh toán. Bạn cũng có thể xử lý cả trạng thái thành công và hủy với cùng một URL.

### Chuyển hướng tới trang thanh toán[​](#chuyển-hướng-tới-trang-thanh-toán "Đường dẫn trực tiếp đến Chuyển hướng tới trang thanh toán")

Sau khi tạo link thanh toán thành công, chuyển hướng khách hàng tới trang thanh toán trả về trong phản hồi.

## Xây dựng giao diện[​](#xây-dựng-giao-diện "Đường dẫn trực tiếp đến Xây dựng giao diện")

### Cài đặt thư viện payos-checkout và import usePayOS[​](#cài-đặt-thư-viện-payos-checkout-và-import-usepayos "Đường dẫn trực tiếp đến Cài đặt thư viện payos-checkout và import usePayOS")

```
npm install @payos/payos-checkout
# hoặc
yarn add @payos/payos-checkout
```

### Khởi tạo config cho việc gọi hook usePayOS[​](#khởi-tạo-config-cho-việc-gọi-hook-usepayos "Đường dẫn trực tiếp đến Khởi tạo config cho việc gọi hook usePayOS")

Có 3 trường bắt buộc phải khởi tạo:

* **RETURN\_URL**: url dẫn đến trang web khi thanh toán thành công.
* **ELEMENT\_ID**: id của 1 component mà bạn muốn nhúng giao diện thanh toán của payOS vào
* **CHECKOUT\_URL**: đường link dẫn đến giao diện thanh toán sẽ được nhúng vào trang web của bạn

Vì thực hiện giao diện thanh toán nhúng nên ta sẽ sử dụng thêm các property như sau:

* `embedded: true` để sử dụng giao diện nhúng
* **onSuccess(event)**: gọi hàm bạn truyền vào nếu như người dùng thực hiện thanh toán thành công

Thông tin chi tiết hơn tại: [payos-checkout](https://payos.vn/docs/sdks/front-end/script-js/)

### Sử dụng thư viện payos-checkout để thực hiện việc nhúng link thanh toán[​](#sử-dụng-thư-viện-payos-checkout-để-thực-hiện-việc-nhúng-link-thanh-toán "Đường dẫn trực tiếp đến Sử dụng thư viện payos-checkout để thực hiện việc nhúng link thanh toán")

Gọi hook usePayOS trong thư viện PayOSCheckout để sử dụng 2 phương thức open() và exit() để lần lượt nhúng và gỡ bỏ giao diện thanh toán trên trang web.

## Chạy thử[​](#chạy-thử "Đường dẫn trực tiếp đến Chạy thử")

Thêm `"proxy": "http://localhost:3030"` vào file `package.json`.

Chạy server của bạn và truy cập vào [`http://localhost:3000`](http://localhost:3000) để bắt đầu tạo link thanh toán.

```
# server side
dotnet run

# client side
npm start
```

### Mã nguồn[​](#mã-nguồn-10 "Đường dẫn trực tiếp đến Mã nguồn")

* Server.cs
* App.js

/Server.cs

```
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Mvc;
using PayOS;
using PayOS.Models;

namespace server.Controllers
{
    public class Program
    {
        public static void Main(string[] args)
        {
            WebHost.CreateDefaultBuilder(args)
              .UseUrls("http://localhost:3030/")
              .UseWebRoot("public")
              .UseStartup<Startup>()
              .Build()
              .Run();
        }
    }

    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
        }
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment()) app.UseDeveloperExceptionPage();
            app.UseRouting();
            app.UseStaticFiles();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapGet("/", context =>
                {
                    context.Response.Redirect("/index.html");
                    return Task.CompletedTask;
                });
            });
        }
    }

    [Route("create-embedded-payment-link")]
    [ApiController]
    public class CheckoutApiController : Controller
    {
        [HttpPost]
        public async Task<IActionResult> Create()
        {
            // Keep your PayOS key protected by including it by an env variable
            var clientId = "YOUR_CLIENT_ID";
            var apiKey = "YOUR_API_KEY";
            var checksumKey = "YOUR_CHECKSUM_KEY";

            var payOS = new PayOSClient(clientId, apiKey, checksumKey);

            var domain = "http://localhost:3030";

            var paymentLinkRequest = new CreatePaymentLinkRequest
            {
                OrderCode = int.Parse(DateTimeOffset.Now.ToString("ffffff")),
                Amount = 2000,
                Description = "Thanh toan don hang",
                ReturnUrl = domain,
                CancelUrl = domain
            };
            var response = await payOS.PaymentRequests.CreateAsync(paymentLinkRequest);

            return json(response);
        }
    }
}
```

/client/src/App.js

```
import React, { useState, useEffect } from "react";
import { usePayOS } from "@payos/payos-checkout";
import "./App.css";

const ProductDisplay = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isCreatingLink, setIsCreatingLink] = useState(false);

  const [payOSConfig, setPayOSConfig] = useState({
    RETURN_URL: window.location.href, // required
    ELEMENT_ID: "embedded-payment-container", // required
    CHECKOUT_URL: null, // required
    embedded: true, // Nếu dùng giao diện nhúng
    onSuccess: (event) => {
      //TODO: Hành động sau khi người dùng thanh toán đơn hàng thành công
      setIsOpen(false);
      setMessage("Thanh toan thanh cong");
    },
  });

  const { open, exit } = usePayOS(payOSConfig);

  const handleGetPaymentLink = async () => {
    setIsCreatingLink(true);
    exit();
    const response = await fetch(
      "http://localhost:3030/create-embedded-payment-link",
      {
        method: "POST",
      }
    );
    if (!response.ok) {
      console.log("Server doesn't response");
    }

    const result = await response.json();
    setPayOSConfig((oldConfig) => ({
      ...oldConfig,
      CHECKOUT_URL: result.checkoutUrl,
    }));

    setIsOpen(true);
    setIsCreatingLink(false);
  };

  useEffect(() => {
    if (payOSConfig.CHECKOUT_URL != null) {
      open();
    }
  }, [payOSConfig]);
  return message ? (
    <Message message={message} />
  ) : (
    <div className="main-box">
      <div>
        <div className="checkout">
          <div className="product">
            <p>
              <strong>Tên sản phẩm:</strong> Mì tôm Hảo Hảo ly
            </p>
            <p>
              <strong>Giá tiền:</strong> 2000 VNĐ
            </p>
            <p>
              <strong>Số lượng:</strong> 1
            </p>
          </div>
          <div className="flex">
            {!isOpen ? (
              <div>
                {isCreatingLink ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "10px",
                      fontWeight: "600",
                    }}
                  >
                    Creating Link...
                  </div>
                ) : (
                  <button
                    id="create-payment-link-btn"
                    onClick={(event) => {
                      event.preventDefault();
                      handleGetPaymentLink();
                    }}
                  >
                    Tạo Link thanh toán Embedded
                  </button>
                )}
              </div>
            ) : (
              <button
                style={{
                  backgroundColor: "gray",
                  color: "white",
                  width: "100%",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  fontSize: "14px",
                  marginTop: "5px",
                }}
                onClick={(event) => {
                  event.preventDefault();
                  setIsOpen(false);
                  exit();
                }}
              >
                Đóng Link
              </button>
            )}
          </div>
        </div>
        {isOpen && (
          <div style={{ maxWidth: "400px", padding: "2px" }}>
            Sau khi thực hiện thanh toán thành công, vui lòng đợi từ 5 - 10s để
            hệ thống tự động cập nhật.
          </div>
        )}
        <div
          id="embedded-payment-container"
          style={{
            height: "350px",
          }}
        ></div>
      </div>
    </div>
  );
};

const Message = ({ message }) => (
  <div className="main-box">
    <div className="checkout">
      <div class="product" style={{ textAlign: "center", fontWeight: "500" }}>
        <p>{message}</p>
      </div>
      <form action="/">
        <button type="submit" id="create-payment-link-btn">
          Quay lại trang thanh toán
        </button>
      </form>
    </div>
  </div>
);

export default function App() {
  return <ProductDisplay />;
}
```

## React + Java[​](#react--java "Đường dẫn trực tiếp đến React + Java")

## Thiết lập Server[​](#thiết-lập-server "Đường dẫn trực tiếp đến Thiết lập Server")

### Cài đặt thư viện payOS cho Java[​](#cài-đặt-thư-viện-payos-cho-java "Đường dẫn trực tiếp đến Cài đặt thư viện payOS cho Java")

<!-- -->

* Maven
* Gradle

Thêm đoạn code sau vào POM và thay VERSION bằng phiên bản bạn muốn sử dụng.

```
<dependency>
  <groupId>vn.payos</groupId>
  <artifactId>payos-java</artifactId>
  <version>{VERSION}</version>
</dependency>
```

Thêm đoạn code sau vào build.gradle và thay VERSION bằng phiên bản bạn muốn sử dụng.

```
implementation 'vn.payos:payos-java:{VERSION}'
```

### Khởi tạo đối tượng `PayOS`[​](#khởi-tạo-đối-tượng-payos "Đường dẫn trực tiếp đến khởi-tạo-đối-tượng-payos")

Bạn cần khởi tạo đối tượng `PayOS` bằng `Client ID`, `API Key` và `Checksum Key` của kênh thanh toán mà bạn đã tạo trên trang [payOS](https://my.payos.vn).

### Tạo link thanh toán[​](#tạo-link-thanh-toán "Đường dẫn trực tiếp đến Tạo link thanh toán")

Link thanh toán kiểm soát những gì khách hàng của bạn nhìn thấy trên trang thanh toán, chẳng hạn như Tên sản phẩm, số lượng đặt, số tiền cũng như số tài khoản thụ hưởng, tên ngân hàng.

### Cung cấp returnUrl và cancelUrl[​](#cung-cấp-returnurl-và-cancelurl "Đường dẫn trực tiếp đến Cung cấp returnUrl và cancelUrl")

Chỉ định URL công khai cho trang thanh toán thành công và hủy thanh toán. Bạn cũng có thể xử lý cả trạng thái thành công và hủy với cùng một URL.

### Chuyển hướng tới trang thanh toán[​](#chuyển-hướng-tới-trang-thanh-toán "Đường dẫn trực tiếp đến Chuyển hướng tới trang thanh toán")

Sau khi tạo link thanh toán thành công, chuyển hướng khách hàng tới trang thanh toán trả về trong phản hồi.

## Xây dựng giao diện[​](#xây-dựng-giao-diện "Đường dẫn trực tiếp đến Xây dựng giao diện")

### Cài đặt thư viện payos-checkout và import usePayOS[​](#cài-đặt-thư-viện-payos-checkout-và-import-usepayos "Đường dẫn trực tiếp đến Cài đặt thư viện payos-checkout và import usePayOS")

```
npm install @payos/payos-checkout
# hoặc
yarn add @payos/payos-checkout
```

### Khởi tạo config cho việc gọi hook usePayOS[​](#khởi-tạo-config-cho-việc-gọi-hook-usepayos "Đường dẫn trực tiếp đến Khởi tạo config cho việc gọi hook usePayOS")

Có 3 trường bắt buộc phải khởi tạo:

* **RETURN\_URL**: url dẫn đến trang web khi thanh toán thành công.
* **ELEMENT\_ID**: id của 1 component mà bạn muốn nhúng giao diện thanh toán của payOS vào
* **CHECKOUT\_URL**: đường link dẫn đến giao diện thanh toán sẽ được nhúng vào trang web của bạn

Vì thực hiện giao diện thanh toán nhúng nên ta sẽ sử dụng thêm các property như sau:

* `embedded: true` để sử dụng giao diện nhúng
* **onSuccess(event)**: gọi hàm bạn truyền vào nếu như người dùng thực hiện thanh toán thành công

Thông tin chi tiết hơn tại: [payos-checkout](https://payos.vn/docs/sdks/front-end/script-js/)

### Sử dụng thư viện payos-checkout để thực hiện việc nhúng link thanh toán[​](#sử-dụng-thư-viện-payos-checkout-để-thực-hiện-việc-nhúng-link-thanh-toán "Đường dẫn trực tiếp đến Sử dụng thư viện payos-checkout để thực hiện việc nhúng link thanh toán")

Gọi hook usePayOS trong thư viện PayOSCheckout để sử dụng 2 phương thức open() và exit() để lần lượt nhúng và gỡ bỏ giao diện thanh toán trên trang web.

## Chạy thử[​](#chạy-thử "Đường dẫn trực tiếp đến Chạy thử")

Thêm `"proxy": "http://localhost:3030"` vào file `package.json`.

Chạy server của bạn và truy cập vào [`http://localhost:3000`](http://localhost:3000) để bắt đầu tạo link thanh toán.

```
# server side
java -cp .\target\payos-payment-1.0-SNAPSHOT-jar-with-dependencies.jar vn.payos.sample.Server

# client side
npm start
```

### Mã nguồn[​](#mã-nguồn-11 "Đường dẫn trực tiếp đến Mã nguồn")

* Server.java
* pom.xml
* App.js

/Server.java

```
package vn.payos.sample;

import static spark.Spark.port;
import static spark.Spark.post;
import static spark.Spark.staticFiles;

import java.nio.file.Paths;
import vn.payos.PayOS;
import vn.payos.model.v2.paymentRequests.CreatePaymentLinkRequest;
import vn.payos.model.v2.paymentRequests.CreatePaymentLinkResponse;

public class Server {
  public static void main(String[] args) {
    port(3000);
    String clientId = "YOUR_CLIENT_ID";
    String apiKey = "YOUR_API_KEY";
    String checksumKey = "YOUR_CHECKSUM_KEY";

    final PayOS payOS = new PayOS(clientId, apiKey, checksumKey);

    staticFiles.externalLocation(Paths.get("public").toAbsolutePath().toString());

    post(
        "/create-embedded-payment-link",
        (request, response) -> {
          String domain = "http://localhost:3000/";
          Long orderCode = System.currentTimeMillis() / 1000;
          CreatePaymentLinkRequest paymentData =
              CreatePaymentLinkRequest.builder()
                  .orderCode(orderCode)
                  .amount(2000)
                  .description("Thanh toán đơn hàng")
                  .returnUrl(domain)
                  .cancelUrl(domain)
                  .build();

          CreatePaymentLinkResponse result = payOS.paymentRequests().create(paymentData);
          response.type("application/json");
          return new com.google.gson.Gson().toJson(result);
        });
  }
}
```

/pom.xml

```
<?xml version="1.0" encoding="UTF-8"?>

<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>vn.payos.sample</groupId>
  <artifactId>payos-payment</artifactId>
  <version>1.0-SNAPSHOT</version>

  <name>sample</name>
  <!-- FIXME change it to the project's website -->
  <url>http://www.example.com</url>

  <properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
  </properties>

  <dependencies>
    <dependency>
      <groupId>com.sparkjava</groupId>
      <artifactId>spark-core</artifactId>
      <version>2.9.4</version>
    </dependency>
    <dependency>
      <groupId>vn.payos</groupId>
      <artifactId>payos-java</artifactId>
      <version>1.0.1</version>
    </dependency>
  </dependencies>

  <build>
    <pluginManagement><!-- lock down plugins versions to avoid using Maven defaults (may be moved to parent pom) -->
      <plugins>
        <!-- clean lifecycle, see https://maven.apache.org/ref/current/maven-core/lifecycles.html#clean_Lifecycle -->
        <plugin>
          <artifactId>maven-clean-plugin</artifactId>
          <version>3.1.0</version>
        </plugin>
        <!-- default lifecycle, jar packaging: see https://maven.apache.org/ref/current/maven-core/default-bindings.html#Plugin_bindings_for_jar_packaging -->
        <plugin>
          <artifactId>maven-resources-plugin</artifactId>
          <version>3.0.2</version>
        </plugin>
        <plugin>
          <artifactId>maven-compiler-plugin</artifactId>
          <version>3.8.0</version>
        </plugin>
        <plugin>
          <artifactId>maven-surefire-plugin</artifactId>
          <version>2.22.1</version>
        </plugin>
        <plugin>
          <artifactId>maven-jar-plugin</artifactId>
          <version>3.0.2</version>
        </plugin>
        <plugin>
          <artifactId>maven-install-plugin</artifactId>
          <version>2.5.2</version>
        </plugin>
        <plugin>
          <artifactId>maven-deploy-plugin</artifactId>
          <version>2.8.2</version>
        </plugin>
        <!-- site lifecycle, see https://maven.apache.org/ref/current/maven-core/lifecycles.html#site_Lifecycle -->
        <plugin>
          <artifactId>maven-site-plugin</artifactId>
          <version>3.7.1</version>
        </plugin>
        <plugin>
          <artifactId>maven-project-info-reports-plugin</artifactId>
          <version>3.0.0</version>
        </plugin>
        <plugin>
            <artifactId>maven-assembly-plugin</artifactId>
            <executions>
            <execution>
                <phase>package</phase>
                <goals>
                <goal>single</goal>
                </goals>
            </execution>
            </executions>
            <configuration>
            <descriptorRefs>
                <!-- This tells Maven to include all dependencies -->
                <descriptorRef>jar-with-dependencies</descriptorRef>
            </descriptorRefs>
            <archive>
                <manifest>
                <mainClass>vn.payos.sample.Server</mainClass>
                </manifest>
            </archive>
            </configuration>
        </plugin>
      </plugins>
    </pluginManagement>
  </build>
</project>
```

/client/src/App.js

```
import React, { useState, useEffect } from "react";
import { usePayOS } from "@payos/payos-checkout";
import "./App.css";

const ProductDisplay = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isCreatingLink, setIsCreatingLink] = useState(false);

  const [payOSConfig, setPayOSConfig] = useState({
    RETURN_URL: window.location.href, // required
    ELEMENT_ID: "embedded-payment-container", // required
    CHECKOUT_URL: null, // required
    embedded: true, // Nếu dùng giao diện nhúng
    onSuccess: (event) => {
      //TODO: Hành động sau khi người dùng thanh toán đơn hàng thành công
      setIsOpen(false);
      setMessage("Thanh toan thanh cong");
    },
  });

  const { open, exit } = usePayOS(payOSConfig);

  const handleGetPaymentLink = async () => {
    setIsCreatingLink(true);
    exit();
    const response = await fetch(
      "http://localhost:3030/create-embedded-payment-link",
      {
        method: "POST",
      }
    );
    if (!response.ok) {
      console.log("Server doesn't response");
    }

    const result = await response.json();
    setPayOSConfig((oldConfig) => ({
      ...oldConfig,
      CHECKOUT_URL: result.checkoutUrl,
    }));

    setIsOpen(true);
    setIsCreatingLink(false);
  };

  useEffect(() => {
    if (payOSConfig.CHECKOUT_URL != null) {
      open();
    }
  }, [payOSConfig]);
  return message ? (
    <Message message={message} />
  ) : (
    <div className="main-box">
      <div>
        <div className="checkout">
          <div className="product">
            <p>
              <strong>Tên sản phẩm:</strong> Mì tôm Hảo Hảo ly
            </p>
            <p>
              <strong>Giá tiền:</strong> 2000 VNĐ
            </p>
            <p>
              <strong>Số lượng:</strong> 1
            </p>
          </div>
          <div className="flex">
            {!isOpen ? (
              <div>
                {isCreatingLink ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "10px",
                      fontWeight: "600",
                    }}
                  >
                    Creating Link...
                  </div>
                ) : (
                  <button
                    id="create-payment-link-btn"
                    onClick={(event) => {
                      event.preventDefault();
                      handleGetPaymentLink();
                    }}
                  >
                    Tạo Link thanh toán Embedded
                  </button>
                )}
              </div>
            ) : (
              <button
                style={{
                  backgroundColor: "gray",
                  color: "white",
                  width: "100%",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  fontSize: "14px",
                  marginTop: "5px",
                }}
                onClick={(event) => {
                  event.preventDefault();
                  setIsOpen(false);
                  exit();
                }}
              >
                Đóng Link
              </button>
            )}
          </div>
        </div>
        {isOpen && (
          <div style={{ maxWidth: "400px", padding: "2px" }}>
            Sau khi thực hiện thanh toán thành công, vui lòng đợi từ 5 - 10s để
            hệ thống tự động cập nhật.
          </div>
        )}
        <div
          id="embedded-payment-container"
          style={{
            height: "350px",
          }}
        ></div>
      </div>
    </div>
  );
};

const Message = ({ message }) => (
  <div className="main-box">
    <div className="checkout">
      <div class="product" style={{ textAlign: "center", fontWeight: "500" }}>
        <p>{message}</p>
      </div>
      <form action="/">
        <button type="submit" id="create-payment-link-btn">
          Quay lại trang thanh toán
        </button>
      </form>
    </div>
  </div>
);

export default function App() {
  return <ProductDisplay />;
}
```

# Webhook thông tin thanh toán

[![payOS Logo](https://payos.vn/wp-content/uploads/2025/06/Casso-payOSLogo-1.svg)](https://payos.vn)

* Webhook thanh toán
  * EventWebhook nhận thông tin thanh toán

[API docs by Redocly](https://redocly.com/redoc/)

# payOS Payment Webhook API<!-- --> (<!-- -->latest<!-- -->)

payOS support

<!-- -->

:

<!-- -->

<support@payos.vn> URL: <https://payos.vn>

<!-- -->

[Terms of Service](https://payos.vn/thoa-thuan-su-dung/)

Webhook API cho hệ thống thanh toán payOS.

### Trước khi bắt đầu

* Bạn đã tạo một tài khoản <https://my.payos.vn>.
* Bạn đã xác thực một doanh nghiệp hoặc cá nhân trên <https://my.payos.vn>, [xem hướng dẫn](https://payos.vn/docs/huong-dan-su-dung/xac-thuc-to-chuc/)
* Bạn đã tạo một kênh thanh toán, [xem hướng dẫn](https://payos.vn/docs/huong-dan-su-dung/tao-kenh-thanh-toan/).

### Môi trường

* Production: <https://api-merchant.payos.vn>

Đăng ký chương trình đối tác tích hợp payOS [Tại đây](https://payos.vn/chuong-trinh-doi-tac-tich-hop/)

## [](#tag/payment-webhook)Webhook thanh toán

Webhook thanh toán

## [](#tag/payment-webhook/operation/payment-webhook)Webhook nhận thông tin thanh toán<!-- --> <!-- -->Webhook

Webhook của cửa hàng dùng để nhận dữ liệu thanh toán từ payOS, [Dữ liệu mẫu](https://payos.vn/docs/tich-hop-webhook/kiem-tra-du-lieu-voi-signature/)

##### Request Body schema: application/json

|                   |                                                                                                                                    |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| coderequired      | stringMã lỗi                                                                                                                       |
| descrequired      | stringThông tin lỗi                                                                                                                |
| successrequired   | boolean                                                                                                                            |
| datarequired      | object                                                                                                                             |
| signaturerequired | stringChữ kí để kiểm tra thông tin, [chi tiết dữ liệu mẫu](https://payos.vn/docs/tich-hop-webhook/kiem-tra-du-lieu-voi-signature/) |

### Responses

**200<!-- -->**

Phản hồi trạng thái mã 2XX để xác nhận webhook gửi thành công

### <!-- -->Request samples<!-- -->

* Payload

Content type

application/json

Copy

Expand all  Collapse all

`{
"code": "00",
"desc": "success",
"success": true,
"data": {
"orderCode": 123,
"amount": 3000,
"description": "VQRIO123",
"accountNumber": "12345678",
"reference": "TF230204212323",
"transactionDateTime": "2023-02-04 18:25:00",
"currency": "VND",
"paymentLinkId": "124c33293c43417ab7879e14c8d9eb18",
"code": "00",
"desc": "Thành công",
"counterAccountBankId": "",
"counterAccountBankName": "",
"counterAccountName": "",
"counterAccountNumber": "",
"virtualAccountName": "",
"virtualAccountNumber": ""
},
"signature": "8d8640d802576397a1ce45ebda7f835055768ac7ad2e0bfb77f9b8f12cca4c7f"
}`

# Kiểm tra dữ liệu với signature

## Kiểm tra thông tin bằng chữ ký (payment-requests)[​](#kiểm-tra-thông-tin-bằng-chữ-ký-payment-requests "Đường dẫn trực tiếp đến Kiểm tra thông tin bằng chữ ký (payment-requests)")

Giá trị `signature` được dùng để kiểm tra tính chính xác của dữ liệu.

### Cách tạo signature[​](#cách-tạo-signature "Đường dẫn trực tiếp đến Cách tạo signature")

* Sử dụng thuật toán HMAC\_SHA256 để tạo signature.
* data tạo signature dạng: key1=value1\&key2=value2... (key1: tên field, value1 = giá trị của key1).
* Dữ liệu tạo signature sắp xếp theo key thứ tự alphabet.
* Cấu trúc: hash\_hmac("sha256", string $data , string $checksum\_key)

Lưu ý:

Checksum Key được tạo ra sau khi tạo cổng thanh toán thành công

<!-- -->

### Code mẫu kiểm tra chính xác dữ liệu[​](#code-mẫu-kiểm-tra-chính-xác-dữ-liệu "Đường dẫn trực tiếp đến Code mẫu kiểm tra chính xác dữ liệu")

* PHP
* Javascript
* Python
* Java

```
    <?php
      $checksum_key = "1a54716c8f0efb2744fb28b6e38b25da7f67a925d98bc1c18bd8faaecadd7675";
      $webhookData = array(
          "code" => "00",
          "desc" => "success",
          "success" => true,
          "data" => array(
              "orderCode"           => 123,
              "amount"              => 3000,
              "description"         => "VQRIO123",
              "accountNumber"       => "12345678",
              "reference"           => "TF230204212323",
              "transactionDateTime" => "2023-02-04 18:25:00",
              "currency"            => "VND",
              "paymentLinkId"       => "124c33293c43417ab7879e14c8d9eb18",
              "code"                => "00",
              "desc"                => "Thành công",
              "counterAccountBankId"    => "",
              "counterAccountBankName"  => "",
              "counterAccountName"      => "",
              "counterAccountNumber"    => "",
              "virtualAccountName"      => "",
              "virtualAccountNumber"    => ""
          ),
          "signature"             => "412e915d2871504ed31be63c8f62a149a4410d34c4c42affc9006ef9917eaa03"
      );

      function isValidData($transaction, $transaction_signature, $checksum_key)
      {
          ksort($transaction);
          $transaction_str_arr = [];
          foreach ($transaction as $key => $value) {
              if (in_array($value, ["undefined", "null"]) || gettype($value) == "NULL") {
                  $value = "";
              }

              if (is_array($value)) {
                  $valueSortedElementObj = array_map(function ($ele) {
                      ksort($ele);
                      return $ele;
                  }, $value);
                  $value = json_encode($valueSortedElementObj, JSON_UNESCAPED_UNICODE);
              }
              $transaction_str_arr[] = $key . "=" . $value;
          }
          $transaction_str = implode("&", $transaction_str_arr);
          dump($transaction_str);
          $signature = hash_hmac("sha256", $transaction_str, $checksum_key);
          dump($signature);
          return $signature == $transaction_signature;
      }

      isValidData($webhookData['data'], $webhookData['signature'], $checksum_key);
```

```
import { createHmac } from 'crypto';

const checksumKey = '1a54716c8f0efb2744fb28b6e38b25da7f67a925d98bc1c18bd8faaecadd7675';
const webhookData = {
  code: '00',
  desc: 'success',
  success: true,
  data: {
    orderCode: 123,
    amount: 3000,
    description: 'VQRIO123',
    accountNumber: '12345678',
    reference: 'TF230204212323',
    transactionDateTime: '2023-02-04 18:25:00',
    currency: 'VND',
    paymentLinkId: '124c33293c43417ab7879e14c8d9eb18',
    code: '00',
    desc: 'Thành công',
    counterAccountBankId: '',
    counterAccountBankName: '',
    counterAccountName: '',
    counterAccountNumber: '',
    virtualAccountName: '',
    virtualAccountNumber: '',
  },
  signature: '412e915d2871504ed31be63c8f62a149a4410d34c4c42affc9006ef9917eaa03',
};

function sortObjDataByKey(object) {
  const orderedObject = Object.keys(object)
    .sort()
    .reduce((obj, key) => {
      obj[key] = object[key];
      return obj;
    }, {});
  return orderedObject;
}

function convertObjToQueryStr(object) {
  return Object.keys(object)
    .filter((key) => object[key] !== undefined)
    .map((key) => {
      let value = object[key];
      // Sort nested object
      if (value && Array.isArray(value)) {
        value = JSON.stringify(value.map((val) => sortObjDataByKey(val)));
      }
      // Set empty string if null
      if ([null, undefined, 'undefined', 'null'].includes(value)) {
        value = '';
      }

      return `${key}=${value}`;
    })
    .join('&');
}

function isValidData(data, currentSignature, checksumKey) {
  const sortedDataByKey = sortObjDataByKey(data);
  const dataQueryStr = convertObjToQueryStr(sortedDataByKey);
  const dataToSignature = createHmac('sha256', checksumKey).update(dataQueryStr).digest('hex');
  return dataToSignature == currentSignature;
}

return isValidData(webhookData.data, webhookData.signature, checksumKey);
```

```
    // Python3
    import hmac
    import hashlib

    checksum_key = "1a54716c8f0efb2744fb28b6e38b25da7f67a925d98bc1c18bd8faaecadd7675"
    webhook_data = {
      "code": '00',
      "desc": 'success',
      "success": True,
      "data": {
          "orderCode": 123,
          "amount": 3000,
          "description": 'VQRIO123',
          "accountNumber": '12345678',
          "reference": 'TF230204212323',
          "transactionDateTime": '2023-02-04 18:25:00',
          "currency": 'VND',
          "paymentLinkId": '124c33293c43417ab7879e14c8d9eb18',
          "code": '00',
          "desc": 'Thành công',
          "counterAccountBankId": '',
          "counterAccountBankName": '',
          "counterAccountName": '',
          "counterAccountNumber": '',
          "virtualAccountName": '',
          "virtualAccountNumber": '',
      },
      "signature": '412e915d2871504ed31be63c8f62a149a4410d34c4c42affc9006ef9917eaa03'
    }

    def convertObjToQueryStr(obj: dict) -> str:
        query_string = []

        for key, value in obj.items():
            value_as_string = ""
            if isinstance(value, (int, float, bool)):
                value_as_string = str(value)
            elif value in [None, 'null', 'NULL']:
                value_as_string = ""
            elif isinstance(value, list):
                value_as_string = json.dumps([sortObjDataByKey(item) for item in value], separators=(',', ':')).replace('None', 'null')
            else:
                value_as_string = str(value)
            query_string.append(f"{key}={value_as_string}")

        return "&".join(query_string)

    def sortObjDataByKey(obj: dict) -> dict:
        return dict(sorted(obj.items()))

    def isValidData(data,signature,key):
        sorted_data_by_key = sortObjDataByKey(data)
        data_query_str = convertObjToQueryStr(sorted_data_by_key)
        print(data_query_str)
        data_to_signature =  hmac.new(key.encode("utf-8"), msg=data_query_str.encode("utf-8"), digestmod=hashlib.sha256).hexdigest()

        return data_to_signature == signature
```

```
    import java.util.*;

    import org.apache.commons.codec.digest.HmacUtils;
    import org.json.JSONObject;

    public class Main {

        static String checksumKey = "1a54716c8f0efb2744fb28b6e38b25da7f67a925d98bc1c18bd8faaecadd7675";

        static String transaction = "{'orderCode':123,'amount':3000,'description':'VQRIO123','accountNumber':'12345678','reference':'TF230204212323','transactionDateTime':'2023-02-04 18:25:00','currency':'VND','paymentLinkId':'124c33293c43417ab7879e14c8d9eb18','code':'00','desc':'Thành công','counterAccountBankId':'','counterAccountBankName':'','counterAccountName':'','counterAccountNumber':'','virtualAccountName':'','virtualAccountNumber':''}";

        static String transactionSignature = "412e915d2871504ed31be63c8f62a149a4410d34c4c42affc9006ef9917eaa03";

        public static Boolean isValidData(String transaction, String transactionSignature) {
            try {
                JSONObject jsonObject = new JSONObject(transaction);
                Iterator<String> sortedIt = sortedIterator(jsonObject.keys(), (a, b) -> a.compareTo(b));

                StringBuilder transactionStr = new StringBuilder();
                while (sortedIt.hasNext()) {
                    String key = sortedIt.next();
                    String value = jsonObject.get(key).toString();
                    transactionStr.append(key);
                    transactionStr.append('=');
                    transactionStr.append(value);
                    if (sortedIt.hasNext()) {
                        transactionStr.append('&');
                    }
                }

                String signature = new HmacUtils("HmacSHA256", checksumKey).hmacHex(transactionStr.toString());
                return signature.equals(transactionSignature);
            } catch (Exception e) {
                e.printStackTrace();
            }
            return false;
        }

        public static Iterator<String> sortedIterator(Iterator<?> it, Comparator<String> comparator) {
            List<String> list = new ArrayList<String>();
            while (it.hasNext()) {
                list.add((String) it.next());
            }

            Collections.sort(list, comparator);
            return list.iterator();
        }

        public static void main(String[] args) {
            System.out.println(isValidData(transaction, transactionSignature));
        }
    }
```

Xem chi tiết về API [tại đây](/docs/api/.md#tag/payment-webhook/operation/confirm-webhook).

## Thông tin dữ liệu mẫu webhook link thanh toán[​](#thông-tin-dữ-liệu-mẫu-webhook-link-thanh-toán "Đường dẫn trực tiếp đến Thông tin dữ liệu mẫu webhook link thanh toán")

<!-- -->

|                   |                                                                                                                                    |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| coderequired      | stringMã lỗi                                                                                                                       |
| descrequired      | stringThông tin lỗi                                                                                                                |
| successrequired   | boolean                                                                                                                            |
| datarequired      | object                                                                                                                             |
| signaturerequired | stringChữ kí để kiểm tra thông tin, [chi tiết dữ liệu mẫu](https://payos.vn/docs/tich-hop-webhook/kiem-tra-du-lieu-voi-signature/) |

Copy

Expand all  Collapse all

`{
"code": "00",
"desc": "success",
"success": true,
"data": {
"orderCode": 123,
"amount": 3000,
"description": "VQRIO123",
"accountNumber": "12345678",
"reference": "TF230204212323",
"transactionDateTime": "2023-02-04 18:25:00",
"currency": "VND",
"paymentLinkId": "124c33293c43417ab7879e14c8d9eb18",
"code": "00",
"desc": "Thành công",
"counterAccountBankId": "",
"counterAccountBankName": "",
"counterAccountName": "",
"counterAccountNumber": "",
"virtualAccountName": "",
"virtualAccountNumber": ""
},
"signature": "8d8640d802576397a1ce45ebda7f835055768ac7ad2e0bfb77f9b8f12cca4c7f"
}`

## Kiểm tra thông tin bằng chữ ký (payouts)[​](#kiểm-tra-thông-tin-bằng-chữ-ký-payouts "Đường dẫn trực tiếp đến Kiểm tra thông tin bằng chữ ký (payouts)")

### Cách tạo và cấu trúc của signature[​](#cách-tạo-và-cấu-trúc-của-signature "Đường dẫn trực tiếp đến Cách tạo và cấu trúc của signature")

* Sử dụng thuật toán HMAC\_SHA256 để tạo signature.
* data tạo signature dạng: key1=value1\&key2=value2... (key1: tên field, value1 = **encodeURI(giá trị của key1)**).
* Giá trị của key nếu là `null` hay `undefined` sẽ là chuỗi rỗng `""`
* Dữ liệu tạo signature sắp xếp theo key thứ tự alphabet, thứ tự các phần từ trong mảng giữ nguyên.
* Cấu trúc: hash\_hmac("sha256", string $data , string $checksum\_key)

Lưu ý:

Checksum key được tạo ra khi tạo kênh chuyển tiền thành công và có thể thay đổi trên [my.payos.vn](https://my.payos.vn)

cảnh báo

Chữ ký dùng cho API `payouts` **KHÁC** với chữ ký dùng cho API `payment-requests`

### Code mẫu kiểm tra chính xác dữ liệu[​](#code-mẫu-kiểm-tra-chính-xác-dữ-liệu-1 "Đường dẫn trực tiếp đến Code mẫu kiểm tra chính xác dữ liệu")

* Javascript

```
/**
 * Deep sort object with optional array sorting
 * @param obj Object data
 * @param sortArrays Whether to sort arrays or maintain their order
 * @returns Sorted object data
 */
function deepSortObj(obj, sortArrays = false) {
  return Object.keys(obj)
    .sort()
    .reduce((acc, key) => {
      const value = obj[key];

      if (Array.isArray(value)) {
        if (sortArrays) {
          // Sort array elements
          acc[key] = value
            .map((item) =>
              typeof item === 'object' && item !== null ? deepSortObj(item, sortArrays) : item,
            )
            .sort((a, b) => {
              // Sort primitive values
              if (typeof a !== 'object' && typeof b !== 'object') {
                return String(a).localeCompare(String(b));
              }
              // For objects, sort by JSON string representation
              return JSON.stringify(a).localeCompare(JSON.stringify(b));
            });
        } else {
          // Maintain array order, but sort objects within arrays
          acc[key] = value.map((item) =>
            typeof item === 'object' && item !== null ? deepSortObj(item, sortArrays) : item,
          );
        }
      } else if (typeof value === 'object' && value !== null) {
        acc[key] = deepSortObj(value, sortArrays);
      } else {
        acc[key] = value;
      }

      return acc;
    }, {});
}

/**
 * Create HMAC SHA-256 signature using Web Crypto API (browser-compatible)
 *
 * @param {string} secretKey - Secret key for HMAC signature generation
 * @param {object} jsonData - JSON object data to be signed
 * @returns {Promise<string>} HMAC signature in hexadecimal format
 *
 * @example
 * // Basic usage
 * const signature = await createSignatureBrowser('secret', { name: 'John', age: 30 });
 */
async function createSignatureBrowser(secretKey, jsonData) {
  const sortedData = deepSortObj(jsonData, false);

  const queryString = Object.keys(sortedData)
    .map((key) => {
      let value = sortedData[key];

      // Handle arrays by JSON stringify them
      if (Array.isArray(value)) {
        value = JSON.stringify(value);
      }
      // Handle nested objects
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        value = JSON.stringify(value);
      }
      // Handle null/undefined values
      if (value === null || value === undefined) {
        value = '';
      }

      return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
    })
    .join('&');

  // Web Crypto API implementation
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secretKey);
  const messageData = encoder.encode(queryString);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
  const hashArray = Array.from(new Uint8Array(signature));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

  return hashHex;
}

/**
 * Verify signature using Web Crypto API
 *
 * @param {string} secretKey - Secret key used for signature generation
 * @param {object} jsonData - JSON object data that was signed
 * @param {string} expectedSignature - Expected signature to verify against
 * @returns {Promise<boolean>} true if signatures match, false otherwise
 */
async function verifySignatureBrowser(secretKey, jsonData, expectedSignature) {
  const computedSignature = await createSignatureBrowser(secretKey, jsonData);
  return computedSignature.toLowerCase() === expectedSignature.toLowerCase();
}

const payoutChecksumKey = '6e91f59952acc8918c49c4a8e380136d66d1fbbf3375926840a8a7e434d4b325';

const expectedSignature = '34d500c4e17feaad8fab528ac3ae089353e276ca9fb4c6654c06ffdfbd88cc5d';

const payoutData = {
  code: '00',
  desc: 'success',
  data: {
    payouts: [
      {
        id: 'batch_8f9520b9341144f38b9f5fbfa317db8e',
        referenceId: 'payout_1753061728877',
        transactions: [
          {
            id: 'batch_txn_fdb348c0570a4cb99009da22f9504898',
            referenceId: 'payout_1753061728877_0',
            amount: 2000,
            description: 'batch payout',
            toBin: '970422',
            toAccountNumber: '0123456789',
            toAccountName: 'NGUYEN VAN A',
            reference: '103269845',
            transactionDatetime: '2025-07-21T08:35:40+07:00',
            errorMessage: null,
            errorCode: null,
            state: 'SUCCEEDED',
          },
          {
            id: 'batch_txn_d94d371c079f4fc0ab7154e1576629d8',
            referenceId: 'payout_1753061728877_1',
            amount: 2000,
            description: 'batch payout',
            toBin: '970422',
            toAccountNumber: '0123456789',
            toAccountName: 'NGUYEN VAN A',
            reference: '103269846',
            transactionDatetime: '2025-07-21T08:35:44+07:00',
            errorMessage: null,
            errorCode: null,
            state: 'SUCCEEDED',
          },
          {
            id: 'batch_txn_71eb922201f3442d93ec5a3c77347e9f',
            referenceId: 'payout_1753061728877_2',
            amount: 2000,
            description: 'batch payout',
            toBin: '970422',
            toAccountNumber: '0123456789',
            toAccountName: 'NGUYEN VAN A',
            reference: '103269847',
            transactionDatetime: '2025-07-21T08:35:47+07:00',
            errorMessage: null,
            errorCode: null,
            state: 'SUCCEEDED',
          },
        ],
        category: ['salary'],
        approvalState: 'COMPLETED',
        createdAt: '2025-07-21T08:35:34+07:00',
      },
    ],
    pagination: {
      limit: 10,
      offset: 0,
      total: 1,
      count: 1,
      hasMore: false,
    },
  },
};

(async () => {
  const result = await verifySignatureBrowser(
    payoutChecksumKey,
    payoutData.data,
    expectedSignature,
  );

  console.log('Signature payout validation result:', result);
})();
```

