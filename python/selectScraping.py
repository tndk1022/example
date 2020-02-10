# -*- coding: utf-8 -*-
from selenium import webdriver
from selenium.webdriver.support.ui import Select
driver = webdriver.Chrome('./chromedriver')
driver.implicitly_wait(1)
driver.get('https://www.aia.co.kr/ko/our-products/medical-protection/non-par-denteal-health-plan.html');
driver.implicitly_wait(1)

element = driver.find_element_by_xpath('//*[@id="calculator-container-form"]/div/div[2]/div/div[2]/div/div[3]/input')
element.send_keys("19951022")

button = driver.find_element_by_xpath('//*[@class="btn-gender-select btn-female"]')
button.click()
button2 = driver.find_element_by_xpath('//*[@id="btn806817556"]')
button2.click()

driver.implicitly_wait(1)


driver.implicitly_wait(2)

