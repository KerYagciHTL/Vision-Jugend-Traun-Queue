import qrcode

def generate_qr_code(url, file_name="qrcode.png"):
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(url)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    img.save(file_name)
    print(f"QR-Code wurde gespeichert als: {file_name}")

url = "http://185.128.246.66:3000"
generate_qr_code(url)
