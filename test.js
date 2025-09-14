const { Builder, Browser, By, until } = require("selenium-webdriver");
const fs = require("fs");
const path = require("path");
const assert = require("assert");

describe("Test UI", function() {
  this.timeout(120000); // 2 menit max
  let driver;

  before(async function() {
    driver = await new Builder().forBrowser(Browser.CHROME).build();
    await driver.manage().window().maximize();

    // screenshoot folder
    if (!fs.existsSync("screenshots")) fs.mkdirSync("screenshots");
  });

  after(async function() {
    await driver.quit();
  });

  // helper highlight + screenshot
  async function highlightAndScreenshot(element, name) {
    await driver.executeScript("arguments[0].style.border='3px solid red'", element);
    await driver.sleep(500);
    const screenshot = await driver.takeScreenshot();
    fs.writeFileSync(path.join("screenshots", `${name}.png`), screenshot, "base64");
    await driver.executeScript("arguments[0].style.border=''", element);
  }

  it("Login dan buka menu", async function() {
    console.log("1️⃣ Buka halaman login");
    await driver.get("https://dev.salfok.com/business/login");

    const email = await driver.wait(until.elementLocated(By.id("email")), 10000);
    await email.sendKeys("maulana10rifki@gmail.com");

    const password = await driver.findElement(By.id("password"));
    await password.sendKeys("Bandung1993!");

    const submitBtn = await driver.findElement(By.xpath("//button[@type='submit']"));
    await submitBtn.click();

    console.log("2️⃣ Tunggu dashboard siap");
    await driver.wait(until.elementLocated(By.xpath("//button[normalize-space()='Produk']")), 15000);

    // Menu Produk
    const produkBtn = await driver.findElement(By.xpath("//button[normalize-space()='Produk']"));
    await highlightAndScreenshot(produkBtn, "menu_produk");
    await produkBtn.click();
    console.log("✅ Menu Produk ditampilkan");

    // Menu Diskon
    const diskonMenu = await driver.findElement(By.xpath("//button[normalize-space()='Diskon']"));
    await highlightAndScreenshot(diskonMenu, "menu_diskon");
    await diskonMenu.click();
    console.log("✅ Menu Diskon ditampilkan");

    // Menu Voucher
    const voucherMenu = await driver.findElement(By.xpath("//button[normalize-space()='Voucher']"));
    await highlightAndScreenshot(voucherMenu, "menu_voucher");
    await voucherMenu.click();
    console.log("✅ Menu Voucher ditampilkan");

    // Assertion sederhana
    assert.strictEqual(await voucherMenu.isDisplayed(), true);

    // Tunggu sebentar supaya terlihat
    await driver.sleep(3000);
  });
});
