/**
 * File:
 *   wefunder-webscraper.js
 * 
 * Description:
 *   The Wefunder webscraper
 */

const cheerio = require('cheerio');
const fs = require('fs');
const LangUtils = require('../utils/lang-utils');
const RestUtils = require('../utils/rest-utils');

const DEV_LOAD_HOME_PAGE_FROM_FILE = false;
const DEV_LOAD_HOME_PAGE_FROM_FILE_PATH = './sample-htmls/wefunder/home-page.html'
const DEV_LOAD_COMPANY_PAGE_FROM_FILE = false;
const DEV_LOAD_COMPANY_PAGE_FROM_FILE_PATH = './sample-htmls/wefunder/company-page.html';

const WEFUNDER_BASE_URL = 'https://wefunder.com';

async function makeGetWefunderHomePageRequest() {
  if (DEV_LOAD_HOME_PAGE_FROM_FILE) {
    let data = fs.readFileSync(DEV_LOAD_HOME_PAGE_FROM_FILE_PATH, 'utf8');
    return cheerio.load(data);
  } else {
    try {
      return await RestUtils.makeGetRequest(WEFUNDER_BASE_URL);
    } catch (err) {
      console.log('index.js: Failed to make wefunder home page request in makeGetWefunderHomePageRequest(): ' + err.message.substring(0, 4));
    }
  }
}

async function getHomePageGlideSlidesData() {
  const $ = await makeGetWefunderHomePageRequest();
  const homePageIdRaisingNowSlide = $('#raising_now_slide');
  const homePageIdRaisingNowSlideClassGlideSlides = $(homePageIdRaisingNowSlide).find('.glide__slides').children();
  let homePageGlideSlidesData = [];
  homePageIdRaisingNowSlideClassGlideSlides.each((i, glideSlideElement) => {
    const glideSlideTextAreaSubelements = $(glideSlideElement).find('.p-4.overflow-hidden.bg-white').children();
    let companyName;
    let companySlogan;
    let companyHighlight1;
    let companyHighlight2;
    let count = 0;
    glideSlideTextAreaSubelements.each((i, glideSlideTextElement) => {
      if (count == 0) {
        companyName = $(glideSlideTextElement).text();
      } else if (count == 1) {
        companySlogan = $(glideSlideTextElement).text();
      } else if (count == 2) {
        companyHighlight1 = $(glideSlideTextElement).text();
      } else if (count == 3) {
        companyHighlight2 = $(glideSlideTextElement).text();
      }
      count++;
    });
    const glideSlideAElement = $(glideSlideElement).find('a').first();

    if (typeof companyName !== 'undefined') {
      let glideSlideData = {
        companyName: companyName,
        compantSlogan: companySlogan,
        companyHighlight1: companyHighlight1,
        companyHighlight2: companyHighlight2,
        uri: WEFUNDER_BASE_URL + glideSlideAElement.attr('href')
      };
      homePageGlideSlidesData.push(glideSlideData);
    }
  });
  return homePageGlideSlidesData;
}

async function navigateToEachCompanyPageAndAppendData(glideSlidesData) {
  for (const glideSlideData of glideSlidesData) {
    if (typeof glideSlideData.uri !== 'undefined') {
      let $;
      if (DEV_LOAD_COMPANY_PAGE_FROM_FILE) {
        let data = fs.readFileSync(DEV_LOAD_COMPANY_PAGE_FROM_FILE_PATH, 'utf8');
        $ = cheerio.load(data);
      } else {
        let uri = glideSlideData.uri;
        try {
          $ = await RestUtils.makeGetRequest(uri);
        } catch (err) {
          console.log('index.js: Failed to make wefunder company page request in navigateToEachCompanyPageAndAppendData(): ' + err.message.substring(0, 4));
        }
      }
      let videoDiv = $('#js-pitch-video');
      // We need to manually search the props because for some reason the cheerio .first()
      // function is not working for this div.
      let regex = /data-react-props=.*(http(.*?))&quot.*/;
      let match = regex.exec(videoDiv.html());
      let videoUri;
      if (match !== null) {
        videoUri = match[1];
      }
      let sidebarDiv = $('#js-sidebar-height');
      let sidebarTopPortionDiv = sidebarDiv.find('.p-4');
      let sidebarBottomPortionDiv = sidebarDiv.find('.px-4.py-5.cursor-pointer.wf-animate-transition');
      let amountRaisedH3 = $(sidebarTopPortionDiv).find('h3.text-xl.font-medium');
      let minimumInvestmentP = $(sidebarTopPortionDiv).find('p.wf-text-dimmer.text-sm');
      let preMoneyEvaluationSpan = $(sidebarBottomPortionDiv).find('.leading-5').first('span');
      let investorPerksSpan = $(sidebarBottomPortionDiv).find('.mt-3.flex').first('.wf-text-dimmer');

      glideSlideData['videoUri'] = videoUri;
      if (amountRaisedH3.length !== 0) {
        glideSlideData['amountRaised'] = amountRaisedH3.text();
      }
      if (minimumInvestmentP.length !== 0) {
        let minimumInvestmentText = minimumInvestmentP.text();
        let minimumInvestmentTextFormatted = minimumInvestmentText.substring(minimumInvestmentText.indexOf('$'), minimumInvestmentText.length);
        glideSlideData['minimumInvestment'] = minimumInvestmentTextFormatted;
      }
      if (preMoneyEvaluationSpan.length !== 0) {
        let preMoneyEvaluationText = preMoneyEvaluationSpan.text();
        let preMoneyEvaluationTextFormatted = preMoneyEvaluationText.substring(0, preMoneyEvaluationText.indexOf('pre-money'));
        glideSlideData['preMoneyEvaluation'] = preMoneyEvaluationTextFormatted;
      }
      if (investorPerksSpan.length !== 0) {
        let investorPerksTextSplit = investorPerksSpan.text().trim().split(',');
        let investorPerksTextFormatted = '';
        for (const investorPerk of investorPerksTextSplit) {
          investorPerksTextFormatted += investorPerk.trim() + ',';
        }
        investorPerksTextFormatted = investorPerksTextFormatted.slice(0, -1);
        glideSlideData['investorPerks'] = investorPerksTextFormatted;
      }
    }
    // Sleep 300 milliseconds to prevent making to many requests too quickly.
    if (!DEV_LOAD_COMPANY_PAGE_FROM_FILE) {
      await LangUtils.sleep(300);
    }
  }
  return glideSlidesData;
}

module.exports = {

  run: async function() {
    let glideSlidesData = await getHomePageGlideSlidesData();
    glideSlidesData = await navigateToEachCompanyPageAndAppendData(glideSlidesData);
    for (const glideSlideData of glideSlidesData) {
      console.log(glideSlideData);
    }
  }

}
