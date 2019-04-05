import { Builder, By, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";

let o = new chrome.Options();
// o.addArguments('start-fullscreen');
o.addArguments("disable-infobars");
// o.addArguments('headless'); // running test on visual chrome browser
o.setUserPreferences({ credential_enable_service: false });

o.addArguments(
  "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36"
);

const Page = function() {
  this.driver = new Builder()
    .setChromeOptions(o)
    .forBrowser("chrome")
    .build();

  // visit a webpage
  this.visit = async function(theUrl) {
    return await this.driver.get(theUrl);
  };

  // visit a webpage
  this.sleep = async function(period) {
    return await this.driver.sleep(period);
  };

  // quit current session
  this.quit = async function() {
    return await this.driver.quit();
  };

  // wait and find a specific element with it's id
  this.findById = async function(id) {
    await this.driver.wait(
      until.elementLocated(By.id(id)),
      15000,
      `Looking for element by id: ${id}`
    );
    return await this.driver.findElement(By.id(id));
  };

  // wait and find a specific element with it's name
  this.findByName = async function(name) {
    await this.driver.wait(
      until.elementLocated(By.name(name)),
      15000,
      `Looking for element by name: ${name}`
    );
    return await this.driver.findElement(By.name(name));
  };

  // wait and find a specific element with a css selector
  this.findByCss = async function(selector) {
    await this.driver.wait(
      until.elementLocated(By.css(selector)),
      15000,
      `Looking for element by selector: ${selector}`
    );
    return await this.driver.findElement(By.css(selector));
  };

  // wait and find elements with a css selector
  this.findElementsByCss = async function(selector) {
    await this.driver.wait(
      until.elementsLocated(By.css(selector)),
      15000,
      `Looking for elements by selector: ${selector}`
    );
    return await this.driver.findElements(By.css(selector));
  };

  // find elements with a css selector
  this.findElementsByCssNoWait = async function(selector) {
    return await this.driver.findElements(By.css(selector));
  };

  // fill input web elements
  this.write = async function(el, txt) {
    return await el.sendKeys(txt);
  };
};

export default Page;
