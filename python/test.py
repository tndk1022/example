# -*- coding: utf-8 -*-
from selenium import webdriver
import datetime
driver = webdriver.Chrome('./chromedriver')
driver.implicitly_wait(3)
driver.get('https://news.naver.com/main/ranking/read.nhn?mid=etc&sid1=111&rankingType=popular_day&oid=002&aid=0002121157&date=20200207&type=1&rankingSeq=2&rankingSectionId=102')
title = driver.find_element_by_class_name("tts_head")
print (title.text)

