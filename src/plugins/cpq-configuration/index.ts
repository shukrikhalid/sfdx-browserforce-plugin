import { BrowserforcePlugin } from '../../plugin';

const PATHS = {
  BASE:'0A3?setupid=ImportedPackage&retURL=%2Fui%2Fsetup%2FSetup%3Fsetupid%3DStudio'
};

const SELECTORS = {
  CONFIGURE: '.actionLink[title*="Configure"][title*="Salesforce CPQ"]',
  PRICE_AND_CALCULATION: 'td[id="page:form:pb:j_id184_lbl"]', // Confirmed
  ENABLE_QUICK_CALCULATE: 'input[id="page:form:pb:j_id185:j_id190"]', // Confirmed
  CALCULATE_IMMEDIATELY: 'input[id="page:form:pb:j_id185:j_id189"]', // Confirmed
  ENABLE_USER_BASED_PRICING: 'input[id="page:form:pb:j_id185:j_id193"]', // Confirmed
  LINE_EDITOR: 'td[id="page:form:pb:j_id115_lbl"]', // Confirmed
  VISUALIZE_PRODUCT_HIERARCHY: 'input[id="page:form:pb:j_id116:j_id125"]', // Confirmed
  KEEP_BUNDLE_TOGETHER: 'input[id="page:form:pb:j_id126:j_id139"]', // Confirmed
  TOTALS_FIELD: 'select[name="page:form:pb:j_id116:j_id131:j_id133"]', // Confirmed
  LINE_SUBTOTALS_TOTAL_FIELD: 'select[name="page:form:pb:j_id116:j_id143:j_id145"]', // Confirmed
  ADDITIONAL_SETTING: 'td[id="page:form:pb:j_id263_lbl"]', // Confirmed
  MULTIPLE_BUNDLES_VIEW: 'select[name="page:form:pb:j_id264:j_id280:j_id282"]', // Confirmed
  PLUGINS: 'td[id="page:form:pb:j_id162_lbl"]', // Confirmed
  QUOTE_CALCULATOR_PLUGIN: 'input[id="page:form:pb:j_id163:j_id171"]', // Confirmed
  ORDER: 'td[id="page:form:pb:j_id253_lbl"]', // Confirmed
  // CREATE_ORDER_WITHOUT_OPPORTUNITIES: 'input[id="page:form:pb:orderOptions:j_id257"]',
  SUBSCRIPTIONS_AND_RENEWALS: 'td[id="page:form:pb:j_id196_lbl"]', // Confirmed
  CONTRACT_IN_FOREGROUND: 'input[id="page:form:pb:subscriptionAndRenewalSettings:j_id223"]', // Confirmed
  SAVE: 'input[name="page:form:j_id2:j_id3:j_id15"]' // Confirmed
};

type Config = {
  enableQuickCalculate: boolean;
  calculateImmediately: boolean;
  enableUsageBasedPricing: boolean;
  visualizeProductHierarchy: boolean;
  keepBundleTogether: boolean;
  totalsField?: string;
  lineSubtotalsTotalField?: string;
  multipleBundlesView?: string;
  quoteCalculatorPlugin?: string;
  createOrdersWithoutOpportunities: boolean;
  contractInForeground: boolean;
};

export class CpqConfiguration extends BrowserforcePlugin {
  public async retrieve(definition?: Config): Promise<Config> {
    const page = await this.browserforce.openPage(PATHS.BASE);
    await page.waitForSelector(SELECTORS.CONFIGURE);
    await Promise.all([page.waitForNavigation(), page.click(SELECTORS.CONFIGURE)]);

    await page.waitForSelector(SELECTORS.PRICE_AND_CALCULATION);
    await page.click(SELECTORS.PRICE_AND_CALCULATION);

    // default response
    const response = {
      enableQuickCalculate : false,
      calculateImmediately : false,
      enableUsageBasedPricing : false,
      visualizeProductHierarchy : false,
      keepBundleTogether : false,
      createOrdersWithoutOpportunities: false,
      contractInForeground: false
    };

    const enableQuickCalculateCheckbox = await page.$(SELECTORS.ENABLE_QUICK_CALCULATE);
    if (enableQuickCalculateCheckbox) {
      response.enableQuickCalculate = await page.$eval(
        SELECTORS.ENABLE_QUICK_CALCULATE,
        (el: HTMLInputElement) => el.checked
      );
    }

    const calculateImmediatelyCheckbox = await page.$(SELECTORS.CALCULATE_IMMEDIATELY);
    if (calculateImmediatelyCheckbox) {
      response.calculateImmediately = await page.$eval(
        SELECTORS.CALCULATE_IMMEDIATELY,
        (el: HTMLInputElement) => el.checked
      );
    }

    const enableUsageBasedPricingCheckbox = await page.$(SELECTORS.ENABLE_USER_BASED_PRICING);
    if (enableUsageBasedPricingCheckbox) {
      response.enableUsageBasedPricing = await page.$eval(
        SELECTORS.ENABLE_USER_BASED_PRICING,
        (el: HTMLInputElement) => el.checked
      );
    }

    await page.waitForSelector(SELECTORS.LINE_EDITOR);
    await page.click(SELECTORS.LINE_EDITOR);

    const visualizeProductHierarchyCheckbox = await page.$(SELECTORS.VISUALIZE_PRODUCT_HIERARCHY);
    if (visualizeProductHierarchyCheckbox) {
      response.visualizeProductHierarchy = await page.$eval(
        SELECTORS.VISUALIZE_PRODUCT_HIERARCHY,
        (el: HTMLInputElement) => el.checked
      );
    }

    const keepBundleTogetherCheckbox = await page.$(SELECTORS.KEEP_BUNDLE_TOGETHER);
    if (keepBundleTogetherCheckbox) {
      response.keepBundleTogether = await page.$eval(
        SELECTORS.KEEP_BUNDLE_TOGETHER,
        (el: HTMLInputElement) => el.checked
      );
    }

    await page.waitForSelector(SELECTORS.ORDER);
    await page.click(SELECTORS.ORDER);

    // const createOrdersWithoutOpportunitiesCheckbox = await page.$(SELECTORS.CREATE_ORDER_WITHOUT_OPPORTUNITIES);
    // if (createOrdersWithoutOpportunitiesCheckbox) {
    //   response.createOrdersWithoutOpportunities = await page.$eval(
    //     SELECTORS.CREATE_ORDER_WITHOUT_OPPORTUNITIES,
    //     (el: HTMLInputElement) => el.checked
    //   );
    // }

    await page.waitForSelector(SELECTORS.SUBSCRIPTIONS_AND_RENEWALS);
    await page.click(SELECTORS.SUBSCRIPTIONS_AND_RENEWALS);

    const contractInForegroundCheckbox = await page.$(SELECTORS.CONTRACT_IN_FOREGROUND);
    if (contractInForegroundCheckbox) {
      response.contractInForeground = await page.$eval(
        SELECTORS.CONTRACT_IN_FOREGROUND,
        (el: HTMLInputElement) => el.checked
      );
    }

    await page.close();
    return response;
  }

  public async apply(config: Config): Promise<void> {
    const page = await this.browserforce.openPage(PATHS.BASE);
    await Promise.all([page.waitForNavigation(), page.click(SELECTORS.CONFIGURE)]);

    //configure Pricing and Calculation
    await page.waitForSelector(SELECTORS.PRICE_AND_CALCULATION);
    await page.click(SELECTORS.PRICE_AND_CALCULATION);

    await page.waitForSelector(SELECTORS.ENABLE_QUICK_CALCULATE);

    await page.$eval(
      SELECTORS.ENABLE_QUICK_CALCULATE,
      (e: HTMLInputElement, v: boolean) => {
        e.checked = v;
      },
      config.enableQuickCalculate
    );

     await page.$eval(
      SELECTORS.CALCULATE_IMMEDIATELY,
      (e: HTMLInputElement, v: boolean) => {
        e.checked = v;
      },
      config.calculateImmediately
    );

    await page.$eval(
      SELECTORS.ENABLE_USER_BASED_PRICING,
      (e: HTMLInputElement, v: boolean) => {
        e.checked = v;
      },
      config.enableUsageBasedPricing
    );

    //configure Line Editor
    await page.waitForSelector(SELECTORS.LINE_EDITOR);
    await page.click(SELECTORS.LINE_EDITOR);

    await page.$eval(
      SELECTORS.VISUALIZE_PRODUCT_HIERARCHY,
      (e: HTMLInputElement, v: boolean) => {
        e.checked = v;
      },
      config.visualizeProductHierarchy
    );

    await page.$eval(
      SELECTORS.KEEP_BUNDLE_TOGETHER,
      (e: HTMLInputElement, v: boolean) => {
        e.checked = v;
      },
      config.keepBundleTogether
    );

    const totalsFieldOptions = await page.$$eval(
      `${SELECTORS.TOTALS_FIELD} option`,
      (options: HTMLOptionElement[]) => {
        return options.map((option) => {
          return {
            text: option.text,
            value: option.value
          };
        });
      }
    );
    const totalsFieldOption = totalsFieldOptions.find((x) => x.text === config.totalsField);
    if (!totalsFieldOption) {
      throw new Error(
        `Fail to set Totals Field`
      );
    }
    await page.select(SELECTORS.TOTALS_FIELD, totalsFieldOption.value);

    const lineSubtotalsTotalFieldOptions = await page.$$eval(
      `${SELECTORS.LINE_SUBTOTALS_TOTAL_FIELD} option`,
      (options: HTMLOptionElement[]) => {
        return options.map((option) => {
          return {
            text: option.text,
            value: option.value
          };
        });
      }
    );
    const chooseLineSubtotalsTotalFieldOption = lineSubtotalsTotalFieldOptions.find((x) => x.text === config.lineSubtotalsTotalField);
    if (!chooseLineSubtotalsTotalFieldOption) {
      throw new Error(
        `Fail to set Line Subtotals Total Field`
      );
    }
    await page.select(SELECTORS.LINE_SUBTOTALS_TOTAL_FIELD, chooseLineSubtotalsTotalFieldOption.value);

    //configure Additional Settings
    await page.waitForSelector(SELECTORS.ADDITIONAL_SETTING);
    await page.click(SELECTORS.ADDITIONAL_SETTING);

    const multipleBundlesViewOptions = await page.$$eval(
      `${SELECTORS.MULTIPLE_BUNDLES_VIEW} option`,
      (options: HTMLOptionElement[]) => {
        return options.map((option) => {
          return {
            text : option.text,
            value: option.value
          };
        });
      }
    );
    const multipleBundlesViewChoice = multipleBundlesViewOptions.find((x) => x.text === config.multipleBundlesView);
    if (!multipleBundlesViewChoice) {
      throw new Error(
        `Fail to set Multiple Bundles View`
      );
    }
    await page.select(SELECTORS.MULTIPLE_BUNDLES_VIEW, multipleBundlesViewChoice.value);

    //configure Plugins
    await page.waitForSelector(SELECTORS.PLUGINS);
    await page.click(SELECTORS.PLUGINS);

    if (config.quoteCalculatorPlugin) {
      await page.type(SELECTORS.QUOTE_CALCULATOR_PLUGIN, config.quoteCalculatorPlugin);
    }

    //configure Order
    await page.waitForSelector(SELECTORS.ORDER);
    await page.click(SELECTORS.ORDER);

    // await page.$eval(
    //   SELECTORS.CREATE_ORDER_WITHOUT_OPPORTUNITIES,
    //   (e: HTMLInputElement, v: boolean) => {
    //     e.checked = v;
    //   },
    //   config.createOrdersWithoutOpportunities
    // )

    //configure Subscriptions and Renewals
    await page.waitForSelector(SELECTORS.SUBSCRIPTIONS_AND_RENEWALS);
    await page.click(SELECTORS.SUBSCRIPTIONS_AND_RENEWALS);

    await page.$eval(
      SELECTORS.CONTRACT_IN_FOREGROUND,
      (e: HTMLInputElement, v: boolean) => {
        e.checked = v;
      },
      config.contractInForeground
    )

    await Promise.all([page.waitForNavigation(),page.click(SELECTORS.SAVE)]);
    await page.close();
  }
}