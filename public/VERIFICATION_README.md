# HeftCoder Verification Files

This directory can be used for verification files required by:
- Google Search Console (HTML verification)
- Microsoft Bing Webmaster Tools
- Other third-party services

## Instructions

1. **Google Search Console**: 
   - Download your verification HTML file from Google Search Console
   - Place it in the `/public` folder
   - The file will be named something like `googleXXXXXXXXXXXX.html`

2. **Bing Webmaster Tools**:
   - Download your verification file
   - Place it in the `/public` folder

## Alternative Verification Methods

You can also verify ownership via:
- **DNS TXT Record**: Add a TXT record to your domain's DNS settings
- **HTML Meta Tag**: Already supported via the SEO component
- **Google Analytics**: If GA4 is configured (which it is)

For `app.heftcoder.icu`, the recommended verification method is:
1. Go to Google Search Console
2. Add property → Domain or URL prefix
3. Choose "HTML file" verification
4. Upload the file to `/public` folder
5. Publish the site
6. Click "Verify" in Search Console
