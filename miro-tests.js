browser.waitForAngularEnabled(false);
describe('Miro - set of tests', function() {

  let defaultUrl = 'https://miro.com/signup/';
  let loginUrl = 'https://miro.com/login/';
  let changedUrl = 'https://miro.com/email-confirm/';
  let startPageUrl = 'https://miro.com/'
  let enterNameError = element(by.xpath('//*[@id="nameError"]'));
  let enterEmailError = element(by.xpath('//*[@id="emailError"]'));
  let enterPasswordError = element(by.xpath('/html/body/div[1]/div/div/div[2]/div[1]/div/form/div[3]'));
  let enterLongerPasswordError = element(by.xpath('/html/body/div[1]/div/div/div[2]/div[1]/div/form/div[2]/div[2]'));
  let weakPasswordWarning = element(by.xpath('/html/body/div[1]/div/div/div[2]/div[1]/div/form/div[2]/div[2]'));
  let agreeWithTermsError = element(by.xpath('//*[@id="termsError"]'));
  let startPage = element(by.xpath('/html/body/div[1]/div/div/div[1]/a'));
  let userName = element(by.xpath('//*[@id="name"]'));
  let userEmail = element(by.xpath('//*[@id="email"]'));
  let userPassword = element(by.xpath('//*[@id="password"]'));
  let submitButton = element(by.xpath('/html/body/div[1]/div/div/div[2]/div[1]/div/form/button'));
  let submitButtonModal = element(by.xpath('/html/body/div[2]/div/div/div[4]/button'));
  let miroTermsCheckbox = element(by.xpath('/html/body/div[1]/div/div/div[2]/div[1]/div/form/div[5]/div[1]/div[1]/span/label'));
  let miroTermsModal = element(by.xpath('/html/body/div[2]/div/div/div[2]/div/span/label'));
  let signInButton = element(by.xpath('/html/body/div[1]/div/div/div[1]/div/a/span'));
  let signUpWithGoogle = element(by.xpath('//*[@id="kmq-google-button"]/div'));
  let signUpWithSlack = element(by.xpath('//*[@id="kmq-slack-button"]/div/img'));
  let signUpWithMsOffice = element(by.xpath('//*[@id="kmq-office365-button"]/div/img'));
  let signUpWithApple = element(by.xpath('//*[@id="apple-auth"]/div/div/img'));
  let signUpWithFacebook = element(by.xpath('/html/body/div[1]/div/div/div[2]/div[1]/div/div[2]/div[2]/div/button[4]/div/img'));
  let footer = element(by.xpath('/html/body/div[1]/div/div/div[2]/div[2]/div'));
  

beforeEach(function() {
    browser.manage().window().maximize();
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
});

afterEach(function() {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
}); 

agreeWithTermsAndSubmit = async function() {
  await miroTermsCheckbox.click();
  await browser.actions().mouseMove(signUpWithGoogle).perform();
  await submitButton.click();
  await browser.driver.sleep('2000');
}

agreeWithTermsAndSubmitModal = async function() {
  await miroTermsModal.click();
  await submitButtonModal.click();
  await browser.driver.sleep('2000');
}

goToMiroSignupPage = async function() {
  await browser.get(defaultUrl);
  await browser.driver.sleep('1000');
}

// TESTS //

it('Check the behaviour when correct data is entered', async function() {
  let randName = (Math.random() + 1).toString(36).substring(3);

  // Go to miro signup page
  await goToMiroSignupPage();

  // fill in the form with the existing name and email
  await userName.sendKeys(randName);
  await userEmail.sendKeys(randName + '@gmail.com');
  await userPassword.sendKeys('ievgentest123');

  // agree with miro terms and submit the form
  await agreeWithTermsAndSubmit();
  
  // verify that user is signed up correctly
  await expect(browser.getCurrentUrl()).toEqual(changedUrl);
});


it('Check the behaviour when existing user tries to sign up', async function() {
  
    // Go to miro signup page
    await goToMiroSignupPage();

    // fill in the form with the existing name and email
    await userName.sendKeys('Ivgan');
    await userEmail.sendKeys('ivgan' + '@gmail.com');
    await userPassword.sendKeys('ievgentest123');

    // agree with miro terms and submit the form
    await agreeWithTermsAndSubmit();
    
    // verify that user is not signed up and remains on a signup page
    await expect(browser.getCurrentUrl()).toEqual(defaultUrl);
});


it('Check the behaviour when user data is not entered', async function() {
  
    // Go to miro signup page
    await goToMiroSignupPage();

    // don't fill in the form with the user's data
    // agree with miro terms and submit the form
    await agreeWithTermsAndSubmit();
    
    // check that corresponding errors on name, email and password appear
    await expect((enterNameError).isDisplayed()).toBe(true);
    await expect((enterEmailError).isDisplayed()).toBe(true);
    await expect((enterPasswordError).isDisplayed()).toBe(true);
    await expect((agreeWithTermsError).isDisplayed()).toBe(false);
});


it('Check the behaviour when password is too short', async function() {
    let randName = (Math.random() + 1).toString(36).substring(3);

    // Go to miro signup page
    await goToMiroSignupPage();

    // fill in the form with correct name and email, but short password
    await userName.sendKeys(randName);
    await userEmail.sendKeys(randName + '@gmail.com');
    await userPassword.sendKeys('11111');

    // agree with miro terms and submit the form
    await agreeWithTermsAndSubmit();
  
    // verify that user is not signed up and remains on a signup page
    await expect(browser.getCurrentUrl()).toEqual(defaultUrl);

    // verify corresponding error message is displayed
    await expect((enterLongerPasswordError).isDisplayed()).toBe(true);
});


it('Check thet user can sign up with a weak password', async function() {
    let randName = (Math.random() + 1).toString(36).substring(3);

    // Go to miro signup page
    await goToMiroSignupPage();

    // fill in the form with correct name and email, but short password
    await userName.sendKeys(randName);
    await userEmail.sendKeys(randName + '@gmail.com');
    await userPassword.sendKeys('11111111');

    // verify corresponding warning message is displayed
    await expect((weakPasswordWarning).isDisplayed()).toBe(true);

    // agree with miro terms and submit the form
    await agreeWithTermsAndSubmit();

    // verify that user is signed up
    await expect(browser.getCurrentUrl()).toEqual(changedUrl);
});


it('Check navigation to the sign in form', async function() {

    // Go to miro signup page
    await goToMiroSignupPage();

    // go to the sign in page
    await signInButton.click();

    // verify url is changed
    await expect(browser.getCurrentUrl()).toEqual(loginUrl);
});


it('Check navigation to the start page', async function() {

  // Go to miro signup page
  await goToMiroSignupPage();

  // go to the sign in page
  await startPage.click();

  // verify url is changed
  await expect(browser.getCurrentUrl()).toEqual(startPageUrl);
});


it('Check signup with Google', async function() {

  // Go to miro signup page
  await goToMiroSignupPage();

  // click on a google widget
  await browser.actions().mouseMove(footer).perform();
  await signUpWithGoogle.click();

  // accept terms and submit the modal
  await agreeWithTermsAndSubmitModal();

  // verify url contains word 'google' 
  await expect(browser.getCurrentUrl()).toContain('google');
});


it('Check signup with Facebook', async function() {

  // Go to miro signup page
  await goToMiroSignupPage();

  // click on a google widget
  await browser.actions().mouseMove(footer).perform();
  await signUpWithFacebook.click();

  // accept terms and submit the modal
  await agreeWithTermsAndSubmitModal();

  // verify url contains word 'google' 
  await expect(browser.getCurrentUrl()).toContain('facebook');
});


it('Check signup with Slack', async function() {

  // Go to miro signup page
  await goToMiroSignupPage();

  // click on a google widget
  await browser.actions().mouseMove(footer).perform();
  await signUpWithSlack.click();

  // accept terms and submit the modal
  await agreeWithTermsAndSubmitModal();

  // verify url contains word 'google' 
  await expect(browser.getCurrentUrl()).toContain('slack');
});


it('Check signup with Microsoft', async function() {

  // Go to miro signup page
  await goToMiroSignupPage();

  // click on a google widget
  await browser.actions().mouseMove(footer).perform();
  await signUpWithMsOffice.click();

  // accept terms and submit the modal
  await agreeWithTermsAndSubmitModal();

  // verify url contains word 'google' 
  await expect(browser.getCurrentUrl()).toContain('microsoftonline');
});


it('Check signup with Apple', async function() {

  // Go to miro signup page
  await goToMiroSignupPage();

  // click on a google widget
  await browser.actions().mouseMove(footer).perform();
  await signUpWithApple.click();

  // accept terms and submit the modal
  await agreeWithTermsAndSubmitModal();

  // verify url contains word 'google' 
  await expect(browser.getCurrentUrl()).toContain('apple');
});
});